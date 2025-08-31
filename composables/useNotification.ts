import type { UseWebNotificationOptions } from '@vueuse/core'
import { useWebNotification as vueUseWebNotification } from '@vueuse/core'

const notificationOptions = ref<UseWebNotificationOptions>({
  title: 'P2K2',
  body: '',
  dir: 'auto',
  lang: 'nl',
  tag: 'p2k2-notification',
  icon: '/web-app-manifest-96x96.png',
})

const {
  ensurePermissions,
  permissionGranted,
  isSupported: isWebNotificationSupported,
  show: showNotification,
  close: closeNotification,
  onClick: onClickNotification,
} = vueUseWebNotification(notificationOptions.value)

function useWebNotification() {
  return {
    ensurePermissions,
    permissionGranted,
    isSupported: isWebNotificationSupported,
    showNotification,
    closeNotification,
    onClickNotification,
    notificationOptions,
  }
}

export {
  useWebNotification,
}
