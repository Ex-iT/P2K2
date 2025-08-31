<script setup lang="ts">
const {
  ensurePermissions,
  permissionGranted,
  isSupported: isWebNotificationSupported,
  showNotification,
  closeNotification,
  onClickNotification,
  notificationOptions,
} = useWebNotification()

const isLive = ref(false)

onClickNotification(() => {
  window.focus()
  closeNotification()
})

async function requestNotificationPermission() {
  const a = await ensurePermissions()
  console.log(a)
}

function triggerNotification() {
  showNotification()
}

// watch(newCount, (newCount) => {
//   if (newCount < MAX_ITEMS) {
//     activeItem.value = newCount - 1

//     notificationOptions.value.title = items.value[0]?.title || 'P2K2'
//     notificationOptions.value.body = items.value[0]?.description || ''

//     showNotification()
//   }
// })
</script>

<template>
  isSupported: {{ isWebNotificationSupported }}
  <br>
  permissionGranted: {{ permissionGranted }}
  <br>
  <div class="flex gap-4 items-center my-5">
    <USwitch
      v-model="isLive"
      unchecked-icon="mdi:close"
      checked-icon="mdi:check"
      default-value
      :label="isLive ? 'Live data' : 'Live data gepauzeerd'"
    />
    <USwitch
      v-if="isWebNotificationSupported"
      v-model="permissionGranted"
      unchecked-icon="mdi:close"
      checked-icon="mdi:check"
      default-value
      :label="isWebNotificationSupported ? 'Notifications' : 'Notifications gepauzeerd'"
    />
    <UButton
      v-if="isWebNotificationSupported"
      icon="mdi:notifications"
      @click="requestNotificationPermission()"
    >
      Enable notifications
    </UButton>
    <UButton
      v-if="isWebNotificationSupported"
      icon="mdi:alert-circle"
      @click="triggerNotification()"
    >
      Trigger notifications
    </UButton>
  </div>
</template>
