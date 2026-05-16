import { DII } from '~/shared/types/websocket'

/**
 * Get the icon name for a given DII code.
 * @param dii The Dispatching institution ID.
 * @returns The MDI icon name.
 */
function getDiiIcon(dii: number | string) {
  const diiNumber = typeof dii === 'number' ? dii : Number.parseInt(dii, 10)

  switch (diiNumber) {
    case DII.BRW:
      return 'mdi:fire-truck'
    case DII.AMBU:
      return 'mdi:ambulance'
    case DII.POL:
      return 'mdi:car-emergency'
    case DII.KNMR:
    case DII.REDB:
      return 'mdi:lifebuoy'
    case DII.GHOR:
      return 'mdi:heart-pulse'
    case DII.HELI:
      return 'mdi:helicopter'
    case DII.GEN:
    default:
      return 'mdi:bullhorn-variant-outline'
  }
}

export { getDiiIcon }
