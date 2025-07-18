<script setup lang="ts">
import { MAX_ITEMS } from '~/config'

const isLive = ref(true)

const activeItem = ref<number | string | undefined>(undefined)

const { newCount, items: allItems, open: openWS, close: closeWS } = useSocket()

const items = computed(() => allItems.value.slice(0, MAX_ITEMS))

watch(newCount, (newCount) => {
  if (newCount < MAX_ITEMS) {
    activeItem.value = newCount - 1
  }
})

watch(isLive, (isConnected) => {
  if (isConnected) {
    openWS()
  } else {
    closeWS()
  }
}, {
  immediate: true,
})

onUnmounted(() => {
  closeWS()
})
</script>

<template>
  <NuxtLayout name="main">
    <USwitch
      v-model="isLive"
      unchecked-icon="mdi:close"
      checked-icon="mdi:check"
      default-value
      :label="isLive ? 'Live data' : 'Live data gepauzeerd'"
      class="my-5"
    />

    <UTimeline
      v-model="activeItem"
      :items="items"
      :ui="{
        description: 'whitespace-pre-wrap',
      }"
    >
      <template #title="{ item }">
        <div v-if="item.lat && item.lon" class="transition flex gap-2 cursor-pointer hover:opacity-75" @click="openMap(item)">
          <p v-html="item.title" />
          <UIcon name="mdi:map-marker" class="size-5 shrink-0 basis-5" />
        </div>
        <p v-else v-html="item.title" />
      </template>
    </UTimeline>
  </NuxtLayout>
</template>
