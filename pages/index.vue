<script setup lang="ts">
import { MAX_ITEMS, REGIONS } from '~/config'

const isLive = ref(false)
const region = ref(REGIONS[0])

const activeItem = ref<number | string | undefined>(undefined)

const {
  newCount,
  items: allItems,
  open: openWS,
  close: closeWS,
  send: sendWS,
} = useSocket()

const items = computed(() => allItems.value.slice(0, MAX_ITEMS))

watch(newCount, (newCount) => {
  if (newCount < MAX_ITEMS) {
    activeItem.value = newCount - 1
  }
})

watch(isLive, (isConnected) => {
  if (isConnected) {
    region.value = REGIONS[0]
    openWS()
  }
  else {
    closeWS()
  }
}, {
  immediate: true,
})

watch(region, (newRegion, _oldRegion) => {
  if (newRegion) {
    sendWS(JSON.stringify({
      COM: 12, // Data request
      RAD: newRegion.data,
    }))
  }
})

onUnmounted(() => {
  closeWS()
})
</script>

<template>
  <NuxtLayout name="main">
    <div class="flex gap-4 items-center my-5">
      <RegionsMenu v-model="region" :disabled="!isLive" />
      <USwitch
        v-model="isLive"
        class="cursor-pointer"
        unchecked-icon="mdi:close"
        checked-icon="mdi:check"
        default-value
        :label="isLive ? 'Live data' : 'Live data gepauzeerd'"
        :ui="{
          base: 'cursor-pointer',
          label: 'cursor-pointer',
        }"
      />
    </div>
    <UTimeline
      v-model="activeItem"
      :items="items"
      :ui="{
        description: 'whitespace-pre-wrap',
      }"
    >
      <template #title="{ item }">
        <div v-if="item.lat && item.lon" class="transition flex gap-2 cursor-pointer hover:opacity-75" @click="openMap(item)">
          <p>{{ item.title }}</p>
          <UIcon name="mdi:map-marker" class="size-5 shrink-0 basis-5" />
        </div>
        <p v-else v-html="item.title" />
      </template>
    </UTimeline>
  </NuxtLayout>
</template>
