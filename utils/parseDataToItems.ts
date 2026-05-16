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

// Priority detection based on documented P2000 codes:
// - Ambulance: A0 (reanimation), A1 (life-threatening), A2 (urgent), B/B1/B2 (planned transport)
// - Brandweer: P 1 / Prio 1 (spoed), P 2 / Prio 2 (urgent), P 3 / Prio 3 (routine)
// - Politie: Prio 1 / Prio 2
function getPriority(text: string) {
  if (/P\s*1\b/i.test(text) || /A\s*[01]\b/i.test(text) || /\bprio\s*1\b/i.test(text)) {
    return 'p1'
  }
  if (/P\s*2\b/i.test(text) || /A\s*2\b/i.test(text) || /\bprio\s*2\b/i.test(text)) {
    return 'p2'
  }
  if (/P\s*3\b/i.test(text) || /\bB\d?\b/i.test(text) || /\bprio\s*3\b/i.test(text)) {
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
