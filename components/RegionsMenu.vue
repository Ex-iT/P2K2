<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { REGIONS } from '~/config'

const props = withDefaults(defineProps<{
  disabled?: boolean
}>(), {
  disabled: true,
})

const model = defineModel<IREGION>()
const open = ref(false)

const items = computed(() => REGIONS.map(region => ({
  label: region.label,
  type: 'checkbox' as const,
  onSelect(event: Event) {
    event.preventDefault()
    model.value = region
    open.value = false
  },
  checked: region.label === model.value?.label,
})) satisfies DropdownMenuItem[])
</script>

<template>
  <UDropdownMenu
    v-model:open="open"
    :items="items"
    :disabled="props.disabled"
    :modal="false"
    :content="{
      align: 'start',
    }"
    :ui="{
      content: 'min-w-56',
    }"
  >
    <UButton
      :label="model?.label || 'Selecteer een regio'"
      icon="i-lucide-menu"
      color="neutral"
      variant="outline"
    />
  </UDropdownMenu>
</template>
