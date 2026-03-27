import { MAX_ITEMS, WS_AUTH_RESPONSE, WS_DATA_REQ, WS_HANDSHAKE, WS_RESET, WS_URL } from '~/config'
import type { RawTimelineData, WSResponse, TimelineAlert } from '~/shared/types/websocket'

const items = ref<TimelineAlert[]>([])
const newCount = ref(0)

const { status, data, send, open, close } = useWebSocket(WS_URL, {
  immediate: false,
  autoReconnect: {
    retries: 3,
    delay: 1000,
    onFailed() {
      console.error('Failed to connect WebSocket after 3 retries')
    },
  },
})

watch(status, (status) => {
  if (status === 'OPEN') {
    send(JSON.stringify(WS_HANDSHAKE))
  }
})

watch(data, (data) => {
  if (data) {
    const parsedData = JSON.parse(data) as RawTimelineData[] | WSResponse

    if (Array.isArray(parsedData)) {
      newCount.value = parsedData.length
      items.value.unshift(...parseDataToItems(parsedData))
      if (items.value.length > MAX_ITEMS * 2) {
        items.value = items.value.slice(0, MAX_ITEMS * 2)
      }
    } else {
      switch (parsedData.COM) {
        case WS_AUTH_RESPONSE:
          send(JSON.stringify(WS_DATA_REQ))
          break
        default:
          break
      }
    }
  }
})

function sendData(data: any) {
  if (status.value === 'OPEN') {
    send(JSON.stringify(WS_RESET))
    send(JSON.stringify(data))
  } else {
    console.error('WebSocket is not open')
  }
}

function useSocket() {
  return { newCount, items, status, data, send: sendData, open, close }
}

export {
  useSocket,
}
