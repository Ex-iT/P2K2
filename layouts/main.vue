<script setup lang="ts">
import AppFooter from '~/components/AppFooter.vue'
</script>

<template>
  <AppHeader />
  <UContainer as="main">
    <slot />
  </UContainer>
  <AppFooter />
</template>
