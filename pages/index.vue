<script setup lang="ts">
import { MAX_ITEMS, REGIONS } from '~/config'

const userSettings = useWebStorage<UserSettings>('userSettings')

const isLive = ref(false)
const region = ref(REGIONS[0])

const activeItem = ref<number | string | undefined>(undefined)

const {
  newCount,
  items: allItems,
  open: openWS,
  close: closeWS,
  send: sendWS,
  status: statusWS,
} = useSocket()

const items = computed(() => allItems.value.slice(0, MAX_ITEMS))

function setRegion(region: IREGION) {
  sendWS({
    COM: 12,
    RAD: region.data,
  })
  userSettings.set({ region })
}

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

watch(statusWS, (status) => {
  if (status === 'OPEN') {
    // @TODO: Find a better solution for this
    setTimeout(() => {
      sendWS({
        COM: 12,
        RAD: region.value!.data,
      })
    }, 100)
  }
})

watch(region, (newRegion) => {
  if (newRegion && isLive.value) {
    setRegion(newRegion)
  }
})

onMounted(() => {
  const storedRegion = userSettings.get('region')
  if (storedRegion) {
    region.value = storedRegion
  }
  isLive.value = true
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
            <p class="font-medium">{{ item.title }}</p>
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
  @apply  text-red-500;
}
.p2 {
  @apply text-orange-500;
}
.p3 {
  @apply text-yellow-500;
}
</style>
