import type { TimelineItem } from '@nuxt/ui'
import { WS_AUTH_RESPONSE, WS_DATA_REQ, WS_HANDSHAKE, WS_URL } from '~/config'

const items = ref<TimelineItem[]>([])
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
    const parsedData = JSON.parse(data) || {}

    if (Array.isArray(parsedData)) {
      newCount.value = parsedData.length
      items.value.unshift(...parseDataToItems(parsedData))
    }

    switch (parsedData.COM) {
      case WS_AUTH_RESPONSE:
        send(JSON.stringify(WS_DATA_REQ))
        break
      default:
        break
    }
  }
})

function useSocket() {
  return { newCount, items, status, data, send, open, close }
}

export {
  useSocket,
}
