<script setup lang="ts">
import type { UserSettings } from '@/shared/types/websocket'
import useWebStorage from '@/composables/useWebStorage'
import { REGIONS } from '@/config'

useWebStorage<UserSettings>('userSettings', {
  regions: [REGIONS[0]!],
})
</script>

<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
