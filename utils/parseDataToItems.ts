import type { RawTimelineData, RawTimelineObject, TimelineAlert } from '~/shared/types/websocket'
import { getDiiIcon } from './getDiiIcon'
import { parseSpi } from './parseSpi'

/**
 * Normalizes a data item whether it's an object or an array.
 */
function normalizeItem(item: RawTimelineData): RawTimelineObject {
  if (Array.isArray(item)) {
    return {
      SPI: item[0],
      DII: item[1],
      LAT: item[2],
      LON: item[3],
      REI: item[4],
      TXT: item[5],
      capcodes: item[6] || [],
    }
  }
  return item as RawTimelineObject
}

/**
 * Extracts priority color and status from the text.
 */
function getPriority(text: string) {
  if (text.includes('P 1') || text.includes('A 1')) return 'p1'
  if (text.includes('P 2') || text.includes('A 2')) return 'p2'
  if (text.includes('P 3') || text.includes('B 1') || text.includes('B 2')) return 'p3'
  return ''
}

/**
 * Parses raw WebSocket data into Timeline items.
 */
function parseDataToItems(data: RawTimelineData[]): TimelineAlert[] {
  return data.map((rawItem) => {
    const item = normalizeItem(rawItem)
    const parsedSpi = parseSpi(item.SPI.toString())

    // Clean up text by removing HTML tags
    const title = item.TXT.replace(/(<([^>]+)>)/g, '') || ''

    // Handle both object-based and array-based capcodes
    const description = item.capcodes
      .map((capcode) => {
        if (Array.isArray(capcode)) {
          return capcode[1] // CTT is the second element
        }
        return capcode.CTT
      })
      .filter(Boolean)
      .join('\n')

    const icon = getDiiIcon(item.DII)
    const priority = getPriority(item.TXT)

    return {
      label: `${parsedSpi.TME} ${parsedSpi.DTT}`, // UTimeline expects 'label' for the date/time
      title,
      description,
      icon,
      priority,
      lat: typeof item.LAT === 'string' ? Number.parseFloat(item.LAT) : (item.LAT as number),
      lon: typeof item.LON === 'string' ? Number.parseFloat(item.LON) : (item.LON as number),
    }
  })
}

export {
  parseDataToItems,
}
