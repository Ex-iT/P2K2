export const WS_URL = 'wss://www.livep2000.nl:443/LSM/websocket'
export const WS_HANDSHAKE = {
  TYP: 'ANN', // Account type (ANN = Anonymous | MEM = Member)
  COO: '',
  UID: '',
  COM: 6, // Authentication request (client -> master)
}
export const WS_DATA_REQ = {
  FRQ: true, // Command First Request
  COM: 12, // data request
}
export const WS_AUTH_RESPONSE = 7
export const MAPS_URL = 'https://maps.livep2000.nl/map.php?DII=2&LAT=&LON=&TXT=&ADR='
