<script setup lang="ts">
import type { IREGION } from '@/shared/types/websocket'
import { REGIONS } from '@/config'

interface Props {
  modelValue: IREGION[]
  disabled?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const alleRegios = REGIONS[0]!
const individualRegions = REGIONS.slice(1)

const selectedRegions = computed(() => props.modelValue)

const isAlleRegiosSelected = computed(() => {
  return selectedRegions.value.some(r => r.label === 'Alle regios')
})

function isRegionSelected(region: IREGION): boolean {
  return selectedRegions.value.some(r => r.label === region.label)
}

function toggleRegion(region: IREGION, checked: boolean | string) {
  const isChecked = checked === true || checked === 'true'

  let newRegions: IREGION[]

  if (isChecked) {
    const withoutAlle = selectedRegions.value.filter(r => r.label !== 'Alle regios')
    newRegions = [...withoutAlle, region]
  } else {
    const without = selectedRegions.value.filter(r => r.label !== region.label)
    newRegions = without.length === 0 ? [alleRegios] : without
  }

  emit('update:modelValue', newRegions)
}

function handleAlleRegiosChecked(checked: boolean | string) {
  const isChecked = checked === true || checked === 'true'
  const newRegions = isChecked ? [alleRegios] : [individualRegions[0]!]
  emit('update:modelValue', newRegions)
}

const labelText = computed(() => {
  if (selectedRegions.value.length === 0) {
    return 'Alle regios'
  }

  if (isAlleRegiosSelected.value) {
    return 'Alle regios'
  }

  if (selectedRegions.value.length === 1) {
    return selectedRegions.value[0]!.label
  }

  return `${selectedRegions.value.length} regio's geselecteerd`
})

const open = ref(false)
</script>

<template>
  <UDropdownMenu
    v-model:open="open"
    :disabled="disabled"
    :modal="false"
  >
    <UButton
      :label="labelText"
      icon="mdi:menu"
      color="neutral"
      variant="outline"
    />

    <template #content-top>
      <div class="space-y-2 p-4 w-[200px]">
        <UCheckbox
          :model-value="isAlleRegiosSelected"
          label="Alle regios"
          :disabled="disabled"
          @update:model-value="(checked: boolean | string) => handleAlleRegiosChecked(checked)"
        />
        <div class="divider" />
        <template v-for="region in individualRegions" :key="region.label">
          <UCheckbox
            :model-value="isRegionSelected(region)"
            :label="region.label"
            :disabled="disabled"
            @update:model-value="(checked: boolean | string) => toggleRegion(region, checked)"
          />
        </template>
      </div>
    </template>
  </UDropdownMenu>
</template>
