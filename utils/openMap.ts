import type { TimelineItem } from '@nuxt/ui'
import { MAPS_URL } from '~/config'

function openMap(item: TimelineItem) {
  if (!item.lat || !item.lon) {
    return
  }

  const url = new URL(MAPS_URL)
  url.searchParams.set('LAT', item.lat.toString())
  url.searchParams.set('LON', item.lon.toString())
  url.searchParams.set('TXT', item.title || '')

  window.open(url, '_blank')
}

export {
  openMap,
}
