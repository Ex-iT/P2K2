import type { RADMap, RawTimelineData, TimelineAlert, WSResponse } from '~/shared/types/websocket'
import { MAX_ITEMS, WS_AUTH_RESPONSE, WS_URL } from '~/config'
import { parseDataToItems } from '~/utils/parseDataToItems'
import { combineRADs } from '~/utils/radixUtils'

/**
 * WebSocket connection status
 */
type WSStatus = 'CLOSED' | 'OPEN' | 'CONNECTING'

// State management
const items = ref<TimelineAlert[]>([])
const newCount = ref(0)
const status = ref<WSStatus>('CLOSED')
const error = ref<Error | null>(null)

// Session state - server is stateful, tracks connection via COO/UID
let sessionCOO = ''
let sessionUID = ''

// Pending region data waiting for authentication
let pendingRegionData: RADMap[] | null = null

// WebSocket instance
let wsInstance: WebSocket | null = null
let reconnectAttempts = 0
let reconnectTimeout: ReturnType<typeof setTimeout> | null = null
const MAX_RECONNECT_ATTEMPTS = 3
const RECONNECT_DELAY = 1000

/**
 * Parses and processes incoming WebSocket data
 */
function processIncomingData(data: string) {
  try {
    const parsedData = JSON.parse(data) as RawTimelineData[] | WSResponse

    if (Array.isArray(parsedData)) {
      // New timeline data received
      newCount.value = parsedData.length
      items.value.unshift(...parseDataToItems(parsedData))

      // Keep only the most recent items
      if (items.value.length > MAX_ITEMS * 2) {
        items.value = items.value.slice(0, MAX_ITEMS * 2)
      }
    } else {
      // Handle WebSocket response messages
      handleWsResponse(parsedData)
    }
  } catch (err) {
    console.error('Failed to parse WebSocket data:', err)
    error.value = err instanceof Error ? err : new Error('Unknown error parsing WebSocket data')
  }
}

/**
 * Handles WebSocket response messages based on COM codes
 */
function handleWsResponse(response: WSResponse) {
  switch (response.COM) {
    case WS_AUTH_RESPONSE:
      // Capture session data for reconnection
      if (response.COO) {
        sessionCOO = response.COO
      }
      if (response.UID !== undefined) {
        sessionUID = String(response.UID)
      }
      reconnectAttempts = 0
      // Auth complete - send any pending region data
      if (pendingRegionData) {
        const data = pendingRegionData
        pendingRegionData = null
        sendRegionData(data)
      }
      break
    case 29:
      // Keep-alive
      break
    default:
      break
  }
}

/**
 * Sends a message through the WebSocket connection
 */
function sendWsMessage(message: object) {
  if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
    wsInstance.send(JSON.stringify(message))
  } else {
    console.warn('WebSocket is not open, unable to send message')
  }
}

/**
 * Builds the handshake message with session data
 */
function buildHandshake() {
  return {
    TYP: 'ANN',
    COO: sessionCOO,
    UID: sessionUID,
    COM: 6,
  }
}

/**
 * Clears the client-side timeline items
 */
function clearItems() {
  items.value = []
  newCount.value = 0
}

/**
 * Clears session data (call on logout)
 */
function clearSession() {
  sessionCOO = ''
  sessionUID = ''
  pendingRegionData = null
}

/**
 * Establishes WebSocket connection with automatic reconnection
 */
function connect() {
  if (wsInstance && (wsInstance.readyState === WebSocket.OPEN || wsInstance.readyState === WebSocket.CONNECTING)) {
    return
  }

  // Reset reconnect attempts if manually reconnecting after max attempts
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    reconnectAttempts = 0
  }

  status.value = 'CONNECTING'
  error.value = null

  try {
    wsInstance = new WebSocket(WS_URL)

    wsInstance.onopen = () => {
      status.value = 'OPEN'
      sendWsMessage(buildHandshake())
    }

    wsInstance.onmessage = (event) => {
      processIncomingData(event.data)
    }

    wsInstance.onclose = () => {
      status.value = 'CLOSED'

      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++
        reconnectTimeout = setTimeout(() => {
          connect()
        }, RECONNECT_DELAY)
      } else {
        error.value = new Error('Max reconnection attempts reached')
      }
    }

    wsInstance.onerror = (err) => {
      console.error('WebSocket error:', err)
      error.value = err instanceof Error ? err : new Error('WebSocket connection error')
      status.value = 'CLOSED'

      if (wsInstance) {
        wsInstance.close()
        wsInstance = null
      }
    }
  } catch (err) {
    status.value = 'CLOSED'
    error.value = err instanceof Error ? err : new Error('Failed to create WebSocket connection')
  }
}

/**
 * Closes WebSocket connection and resets reconnection attempts
 */
function disconnect() {
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout)
    reconnectTimeout = null
  }
  if (wsInstance) {
    wsInstance.close()
    wsInstance = null
  }
  status.value = 'CLOSED'
  error.value = null
  reconnectAttempts = 0
  clearSession()
}

/**
 * Sends region data request (called after auth or directly if already authenticated)
 */
function sendRegionData(maps: RADMap[]) {
  if (maps.length === 0) {
    return
  }

  const combinedRad = combineRADs(maps)
  sendWsMessage({ COM: 12, FRQ: false, RAD: combinedRad })
}

/**
 * Requests data for one or more regions
 * If not yet authenticated, queues the request until auth completes
 */
function requestRegionData(radData: RADMap | RADMap[]) {
  const maps = Array.isArray(radData) ? radData : [radData]

  // If we have a valid session (non-empty COO), send directly
  if (sessionCOO) {
    sendRegionData(maps)
  } else {
    // Queue for after authentication
    pendingRegionData = maps
  }
}

/**
 * WebSocket composable hook for P2000 live data
 *
 * @returns Object containing WebSocket state and control methods
 */
export function useSocket() {
  return {
    // State
    items,
    newCount,
    status,
    error,

    // Actions
    connect,
    disconnect,
    clearItems,
    clearSession,
    requestRegionData,
  }
}
