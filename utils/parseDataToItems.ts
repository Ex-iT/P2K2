import type { RawTimelineData, RawTimelineObject, TimelineAlert } from '~/shared/types/websocket'
import { getDiiIcon } from './getDiiIcon'
import { parseSpi } from './parseSpi'

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

function getPriority(text: string) {
  if (/\bP 1\b/.test(text) || /\bA 1\b/.test(text)) {
    return 'p1'
  }
  if (/\bP 2\b/.test(text) || /\bA 2\b/.test(text)) {
    return 'p2'
  }
  if (/\bP 3\b/.test(text) || /\bB 1\b/.test(text) || /\bB 2\b/.test(text)) {
    return 'p3'
  }
  return ''
}

function parseDataToItems(data: RawTimelineData[]): TimelineAlert[] {
  return data.map((rawItem) => {
    const item = normalizeItem(rawItem)
    const parsedSpi = parseSpi(item.SPI.toString())

    const title = item.TXT.replace(/(<([^>]+)>)/g, '') || ''

    const description = item.capcodes
      .map((capcode) => {
        if (Array.isArray(capcode)) {
          return capcode[1]
        }
        return capcode.CTT
      })
      .filter(Boolean)
      .join('\n')

    const icon = getDiiIcon(item.DII)
    const priority = getPriority(item.TXT)

    const lat = typeof item.LAT === 'string' ? Number.parseFloat(item.LAT) : (item.LAT as number)
    const lon = typeof item.LON === 'string' ? Number.parseFloat(item.LON) : (item.LON as number)

    return {
      label: `${parsedSpi.TME} ${parsedSpi.DTT}`,
      title,
      description,
      icon,
      priority,
      lat: Number.isFinite(lat) ? lat : null,
      lon: Number.isFinite(lon) ? lon : null,
      timeDate: {
        time: parsedSpi.TME || '',
        date: parsedSpi.DTT || '',
      },
    }
  })
}

export {
  parseDataToItems,
}
