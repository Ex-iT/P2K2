<script setup lang="ts">
import { REGIONS } from './config'

useWebStorage<UserSettings>('userSettings', {
  region: REGIONS[0]!,
})
</script>

<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
