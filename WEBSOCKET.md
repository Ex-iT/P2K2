# P2K2 WebSocket Implementation Documentation

## Overview

This document explains how the P2K2 application interacts with the P2000 WebSocket service provided by livep2000.nl. The WebSocket delivers real-time emergency service notifications from the Netherlands.

## Connection Details

- **WebSocket URL**: `wss://www.livep2000.nl:443/LSM/websocket`
- **Protocol**: WebSocket (RFC 6455)
- **Data Format**: JSON messages

## Connection Flow

1. **Initial Connection**: Client establishes WebSocket connection
2. **Handshake**: Client sends authentication message with session (COO/UID)
3. **Authentication**: Server responds with auth confirmation (COM: 7) containing session cookies
4. **Data Request**: Client requests data with full RAD filter (after auth completes)
5. **Data Streaming**: Server streams timeline data
6. **Keep-alive**: Server sends periodic COM: 29 messages

### Message Sequence

```
Client -> Server: WebSocket Connection
Client -> Server: { TYP: "ANN", COO: "", UID: "", COM: 6 }
Server -> Client: { COM: 7, RAD: [...], UID: ..., COO: ..., ... }  (auth response + session)
Client -> Server: { COM: 12, FRQ: false, RAD: {...} }  (after auth completes)
Server -> Client: [ timeline_data_array ]
Server -> Client: { COM: 29 } (keep-alive)
Server -> Client: [ more_timeline_data ]
```

## Critical Implementation Details

### 1. Session Handling

The server is **stateful** - it tracks connection state via cookies (COO) and user ID (UID):

- On auth response (COM: 7), capture `COO` and `UID` from the server
- On reconnection, include these values in the handshake to maintain session state

```typescript
// In useSocket.ts
let sessionCOO = ''
let sessionUID = ''

// After auth response
case WS_AUTH_RESPONSE:
  sessionCOO = response.COO
  sessionUID = String(response.UID)
  break
```

### 2. Authentication Timing

**Important**: Wait for authentication to complete before requesting data. The server needs time to process the handshake before it accepts region requests.

Implementation pattern:
- Queue any region requests that arrive before auth completes
- Send queued requests after receiving COM: 7

```typescript
let pendingRegionData: RADMap[] | null = null

// In auth handler
case WS_AUTH_RESPONSE:
  if (pendingRegionData) {
    sendRegionData(pendingRegionData)
    pendingRegionData = null
  }
  break

// In requestRegionData
function requestRegionData(radData: RADMap | RADMap[]) {
  if (sessionCOO) {
    sendRegionData(maps)
  } else {
    pendingRegionData = maps
  }
}
```

### 3. Multi-Region Selection

The original approach of sending multiple `FRQ=false` requests with delays doesn't work reliably. Instead, **combine multiple region RADs into a single full RAD**.

Each region config in `config.ts` has a partial RAD (2-3 keys). To combine:
1. Convert each region's RAD from base-36 strings to binary (320-bit array)
2. OR the binary representations together
3. Convert back to base-36 RAD (10 keys, all keys must be present)

```typescript
// utils/radixUtils.ts
function radToBin(rad: RADMap): number[] {
  // Convert each RAD key (base-36) to 32-bit binary
}

function binToRad(bin: number[]): RADMap {
  // Convert binary back to base-36 strings
}

function combineRADs(radMaps: RADMap[]): RADMap {
  const combinedBin = radToBin(radMaps[0]!)
  for (let i = 1; i < radMaps.length; i++) {
    const radBin = radToBin(radMaps[i]!)
    for (let j = 0; j < combinedBin.length; j++) {
      combinedBin[j] = combinedBin[j] || radBin[j]
    }
  }
  return binToRad(combinedBin)
}
```

**Why this works**: The server expects a full RAD (all 10 keys present) to properly filter. Partial RAD returns 0 items.

### 4. FRQ Flag Behavior

- `FRQ: true` - Server ignores the RAD object and returns data based on its stored filter
- `FRQ: false` - Server uses the provided RAD for filtering

**Always use `FRQ: false`** with a full combined RAD.

## RAD and BIN Encoding System

The livep2000.nl server uses a binary encoding system to filter which regions and alerts to send.

### BIN Array (Binary Array)

The BIN is a 320-bit binary array (10 x 32-bit chunks):

```
userObj.BIN = [bit0, bit1, bit2, ..., bit319]
```

Each bit controls specific functionality:

| Bit Range | Purpose |
|-----------|---------|
| 0-125 | Region enablement (25 regions x 5 bits each) |
| 130-134 | Button states |
| 135 | City/place selector enable |
| 144-159 | Display settings |
| 160-163 | Selected menu (4 bits) |
| 164-169 | Pre-selected region (6 bits) |
| 164-179 | Sound/volume settings |
| 180-183 | Selected sound (4 bits) |
| 184-187 | Volume level (4 bits) |
| 188-191 | Zoom level (4 bits) |
| 232-275 | City range (12 bits x 4 slots) |
| 280-283 | City enabled flags |

### Region Bit Mapping

Each region uses 5 consecutive bits (offset = regionIndex * 5):

```
Region 0 (Alle regios):  bits 0-4
Region 1 (Groningen):    bits 5-9
Region 2 (Friesland):    bits 10-14
Region 3 (Drenthe):       bits 15-19
... (continues for 25 regions)
```

Within each region's 5 bits:
- bit + 0: Region enabled/disabled
- bit + 1-4: Region-specific settings

### RAD Array (Radix-36 Encoding)

The BIN array is split into 10 chunks of 32 bits and encoded as base-36 strings:

```
userObj.RAD = [
  "1gp7nj3",  // bits 0-31
  "1ug4yd3",  // bits 32-63
  "ydb931",   // bits 64-95
  "1pv5ur3",  // bits 96-127
  "3",        // bits 128-159
  "13vwye8",  // bits 160-191
  "0",        // bits 192-223
  "0",        // bits 224-255
  "0",        // bits 256-287
  "0"         // bits 288-319
]
```

### Encoding Functions (from livep2000.nl)

```javascript
// Binary to base-36 (single 32-bit chunk)
function arrayToRadix36X1(bitARR) {
  const decimal = BinToDec(bitARR)
  return DecToHex(decimal, 36) // base-36 string
}

// Binary to RAD array (entire 320 bits)
function arrayToRadix36X6(binArray) {
  const chunks = []
  const numChunks = Math.ceil(binArray.length / 32)
  for (let x = 0; x < numChunks; x++) {
    const chunk = binArray.slice(x * 32, x * 32 + 32)
    chunks.push(arrayToRadix36X1(chunk))
  }
  return chunks
}

// Binary to decimal
function BinToDec(bits) {
  let result = 0
  for (let i = 0; i < bits.length; i++) {
    if (bits[i]) result += 2 ** i
  }
  return result
}

// Decimal to binary
function DecToBin(value, bits) {
  const result = []
  for (let i = 0; i < bits; i++) {
    result[i] = value % 2 >= 1 ? 1 : 0
    value = Math.floor(value / 2)
  }
  return result
}
```

### Setting Bits and Values

```javascript
// Set a single bit
function setBit(bitNumber, value) {
  if (userObj.BIN[bitNumber] != value) {
    userObj.BIN[bitNumber] = value
    const segmentNumber = Math.floor(bitNumber / 32)
    userObj.RAD[segmentNumber] = arrayToRadix36X1(
      userObj.BIN.slice(segmentNumber * 32, (segmentNumber + 1) * 32)
    )
  }
}

// Set multiple bits (numBits = number of bits)
function setVal(value, startBit, numBits) {
  const binary = DecToBin(value, numBits)
  for (let x = 0; x < binary.length; x++) {
    userObj.BIN[startBit + x] = binary[x]
  }
  const segmentNumber = Math.floor(startBit / 32)
  userObj.RAD[segmentNumber] = arrayToRadix36X1(
    userObj.BIN.slice(segmentNumber * 32, (segmentNumber + 1) * 32)
  )
}
```

## Client to Server Messages

### 1. Authentication Handshake

```json
{
  "TYP": "ANN",
  "COO": "session_cookie_from_previous_response",
  "UID": "user_id_from_previous_response",
  "COM": 6
}
```

- `TYP`: Account type ("ANN" = Anonymous, "MEM" = Member)
- `COO`: Cookie from previous auth response (empty for first connection)
- `UID`: User ID from previous auth response (empty for first connection)
- `COM`: Command code (6 = authentication request)

### 2. Data Request

```json
{
  "COM": 12,
  "FRQ": false,
  "RAD": {
    "0": "1gp7nj3",
    "1": "1ug4yd3",
    "2": "ydb931",
    "3": "1pv5ur3",
    "4": "3",
    "5": "13vwye8",
    "6": "0",
    "7": "0",
    "8": "0",
    "9": "0"
  }
}
```

- `COM`: Command code (12 = data request)
- `FRQ`: First request flag
  - `true`: Server ignores RAD, uses stored filter
  - `false`: Server uses provided RAD for filtering
- `RAD`: Full region filter map (ALL 10 keys required)

**Important**: Partial RAD (e.g., only keys 0 and 5) returns 0 items.

## Server to Client Messages

### 1. Authentication Response (COM: 7)

```json
{
  "COM": 7,
  "UID": 1234567,
  "COO": "session_cookie_string",
  "USN": "username",
  "CST": 15,
  "RAD": ["1gp7nj3", "1ug4yd3", "ydb931", "1pv5ur3", "3", "13vwye8", "0", "0", "0", "0"]
}
```

- `CST`: Connection state (15 = anonymous connected)
- `COO`: Session cookie - SAVE THIS for reconnection
- `UID`: User ID - SAVE THIS for reconnection
- `RAD`: Server's current region filter

### 2. Timeline Data Array

```json
[
  {
    "SPI": 2605081241050212,
    "DII": 2,
    "LAT": 52.2622795,
    "LON": 4.6296128,
    "REI": 12,
    "TXT": "B2 12251 Rit 68474 <span class=s>SPOORSTRAAT</span> <span class=c>NIEUW-VENNEP</span>",
    "capcodes": [
      { "CPI": 126999, "CTT": "MKA Kennemerland ( Monitorcode )" },
      { "CPI": 126251, "CTT": "MKA Kennemerland ( Medium Care Ambulance 12-251 )" }
    ]
  }
]
```

### 3. Keep-alive (COM: 29)

```json
{
  "COM": 29
}
```

## Data Structure Fields

### SPI (Service Point Identifier)
13-digit timestamp with dispatch info encoded:
- Positions 1-2: Day (DD)
- Positions 3-4: Month (MM)
- Positions 5-6: Year (YY)
- Positions 7-8: Hour (HH)
- Positions 9-10: Minute (MM)
- Positions 11-12: Second (SS)
- Position 13+: Dispatch identifiers

### DII (Dispatch Info Identifier)
Determines the alert priority and service type (icon mapping).

### Capcodes
Array of capability/cader identifiers:
- `CPI`: Numeric code for the unit
- `CTT`: Description text

### TXT (Message Text)
Contains HTML spans:
- `<span class=s>`: Street/location
- `<span class=c>`: City/municipality

## Region Data Configuration

Each region in `config.ts` is defined by a partial RADMap:

```typescript
type RADMap = Record<string, string>
```

Individual regions have partial RAD (2-3 keys), "Alle regios" has full RAD (10 keys):

```typescript
// All regions (full 10-key RAD)
const ALL_REGIONS = {
  0: '1gp7nj3',
  1: '1ug4yd3',
  2: 'ydb931',
  3: '1pv5ur3',
  4: '3',
  5: '13vwye8',
  6: '0',
  7: '0',
  8: '0',
  9: '0'
}

// Groningen (partial RAD - 2 keys)
const GRONINGEN = {
  0: '1gp7njy',
  5: 'qug174'
}
```

## Implementation Summary

### Key Files

| File | Purpose |
|------|---------|
| `composables/useSocket.ts` | WebSocket connection, session handling, region requests |
| `composables/useWebStorage.ts` | LocalStorage persistence |
| `components/RegionsMenu.vue` | Region selection dropdown (v-model) |
| `pages/index.vue` | Main page, connects socket, loads/saves settings |
| `config.ts` | Region definitions (REGIONS array) |
| `utils/radixUtils.ts` | RAD binary conversion and combining |

### Data Flow

1. **Page load**: `index.vue` loads saved regions from localStorage via `userSettings`
2. **Mount**: Opens WebSocket connection
3. **Auth**: Server responds with COM:7 containing COO/UID session
4. **After auth**: Region data request sent with combined full RAD
5. **On region change**: Watch triggers new request with updated RAD

### Region Selection Rules

- "Alle regios" is **exclusive** - selecting it clears individual regions
- Unchecking "Alle regios" defaults to first individual region
- Empty selection defaults to "Alle regios"

## Safety Considerations

To prevent server overload:

1. Single WebSocket connection only
2. Limit reconnection attempts (max 3)
3. 1+ second delay between reconnection attempts
4. Wait for auth before requesting data

## Error Handling

- Connection errors trigger reconnection attempts
- JSON parsing errors are caught and logged
- Session errors clear auth and re-authenticate
- All errors exposed via `error` ref for UI feedback