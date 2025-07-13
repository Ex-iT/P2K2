<script setup lang="ts">
import type { TimelineItem } from '@nuxt/ui'
import { useWebSocket } from '@vueuse/core'
import { MAPS_URL, WS_AUTH_RESPONSE, WS_DATA_REQ, WS_HANDSHAKE, WS_URL } from '~/config'

interface TimelineData {
  SPI: number
  DII: number
  LAT: number
  LON: number
  REI: number
  TXT: string
  capcodes: { CPI: number, CTT: string }[]
}

const isConnected = ref(true)
const items = ref<TimelineItem[]>([])
const maxItems = 20

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

function connectWS() {
  open()
}

function disconnectWS() {
  close()
}

watch(status, (status) => {
  if (status === 'OPEN') {
    send(JSON.stringify(WS_HANDSHAKE))
  }
})

watch(data, (data) => {
  if (data) {
    const parsedData = JSON.parse(data) || {}

    if (Array.isArray(parsedData)) {
      items.value.unshift(...parseDataToItems(parsedData))
      items.value = items.value.slice(0, maxItems)
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

function parseDataToItems(data: TimelineData[]) {
  return data.map((item) => {
    const parsedSPI = parseSPI(item.SPI.toString())

    return {
      date: `${parsedSPI.TME} ${parsedSPI.DTT}`,
      title: item.TXT,
      description: item.capcodes.map(capcode => capcode.CTT).join('\n'),
      icon: 'ic:baseline-code',
      lat: item.LAT,
      lon: item.LON,
    }
  })
}

function parseSPI(SPI: string) {
  return {
    DTT: `${SPI.slice(4, 6)}-${SPI.slice(2, 4)}-${SPI.slice(0, 2)}`,
    TME: `${SPI.slice(6, 8)}:${SPI.slice(8, 10)}:${SPI.slice(10, 12)}`,
    DII: SPI.slice(12, 14),
    RII: SPI.slice(14, 16),
  }
}

function openMap(item: TimelineItem) {
  if (!item.lat || !item.lon) {
    return
  }

  const url = new URL(MAPS_URL)
  url.searchParams.set('LAT', item.lat.toString())
  url.searchParams.set('LON', item.lon.toString())
  url.searchParams.set('TXT', item.title || '')

  window.open(url, '_blank')
}

watch(isConnected, (isConnected) => {
  if (isConnected) {
    connectWS()
  } else {
    disconnectWS()
  }
}, {
  immediate: true,
})

onUnmounted(() => {
  disconnectWS()
  console.warn('Disconnected from WebSocket')
})
</script>

<template>
  <NuxtLayout name="main">
    <USwitch
      v-model="isConnected"
      unchecked-icon="ic:twotone-close"
      checked-icon="ic:outline-check"
      default-value
      :label="isConnected ? 'Live data' : 'Live data gepauzeerd'"
      class="my-5"
    />

    <UTimeline
      :items="items"
      :ui="{
        description: 'whitespace-pre-wrap',
      }"
    >
      <template #title="{ item }">
        <div v-if="item.lat && item.lon" class="transition flex items-center gap-2 cursor-pointer hover:opacity-75" @click="openMap(item)">
          <p v-html="item.title" />
          <UIcon name="ic:baseline-pin-drop" class="size-5" />
        </div>
        <p v-else v-html="item.title" />
      </template>
    </UTimeline>
  </NuxtLayout>
</template>
