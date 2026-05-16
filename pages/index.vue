<script setup lang="ts">
import type { IREGION, UserSettings } from '~/shared/types/websocket'
import useWebStorage from '@/composables/useWebStorage'
import { useSocket } from '~/composables/useSocket'
import { MAX_ITEMS, REGIONS } from '~/config'

const userSettings = useWebStorage<UserSettings>('userSettings')

const regions = ref<IREGION[]>([REGIONS[0]!])

const activeItem = ref<number | string | undefined>(undefined)

const {
  newCount,
  items: allItems,
  status: statusWS,
  connect: openWS,
  disconnect: closeWS,
  requestRegionData,
  clearItems,
} = useSocket()

const items = computed(() => allItems.value.slice(0, MAX_ITEMS))

watch(newCount, (count) => {
  if (count < MAX_ITEMS) {
    activeItem.value = count - 1
  }
})

watch(statusWS, (status) => {
  if (status === 'OPEN') {
    clearItems()
    requestRegionData(getSelectedRegionData())
  }
})

watch(regions, (newRegions) => {
  userSettings.set({ regions: newRegions })
  if (statusWS.value === 'OPEN') {
    clearItems()
    requestRegionData(getSelectedRegionData())
  }
})

onMounted(() => {
  const stored = userSettings.get('regions')
  if (stored && Array.isArray(stored) && stored.length > 0) {
    regions.value = stored
  }
  openWS()
})

onUnmounted(() => {
  closeWS()
})

function getSelectedRegionData(): Record<string, string>[] {
  const selected = regions.value

  if (selected.some(r => r.label === 'Alle regios') || selected.length === 0) {
    return [REGIONS[0]!.data]
  }

  return selected.map(r => r.data)
}
</script>

<template>
  <NuxtLayout name="main">
    <div class="flex gap-4 items-center my-5">
      <RegionsMenu v-model="regions" />
    </div>
    <UTimeline
      v-model="activeItem"
      :items="items"
      :ui="{
        description: 'whitespace-pre-wrap',
      }"
    >
      <template #indicator="{ item }">
        <UIcon :name="item.icon || 'mdi:bullhorn-variant-outline'" class="size-5 shrink-0 basis-5" :class="item.priority" />
      </template>
      <template #title="{ item }">
        <div class="flex flex-col">
          <component
            :is="item.lat && item.lon ? 'a' : 'div'"
            :href="item.lat && item.lon ? openMap(item) : undefined"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex gap-2 items-center"
            :class="{ 'group transition cursor-pointer hover:opacity-75': item.lat && item.lon }"
          >
            <p class="font-medium">
              {{ item.title }}
            </p>
            <UIcon v-if="item.lat && item.lon" name="mdi:map-marker" class="size-4 text-primary-500 shrink-0 basis-4 group-hover:text-primary-600" />
          </component>

          <span v-if="item.timeDate.time && item.timeDate.date" class="text-neutral-500 text-xs">
            {{ item.timeDate.time }} - {{ item.timeDate.date }}
          </span>
        </div>
      </template>
    </UTimeline>
  </NuxtLayout>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.p1 {
  @apply text-red-500;
}

.p2 {
  @apply text-orange-500;
}

.p3 {
  @apply text-yellow-500;
}
</style>
