enum DII {
  GEN = 0, // General
  BRW = 1, // Fire brigade
  AMBU = 2, // Ambulance
  POL = 3, // Police
  KNMR = 4, // Lifeguard
  GHOR = 5, // GHOR (Health Service)
  REDB = 6, // Reddingsbrigade
  HELI = 9, // Trauma helicopter
}

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
      return 'mdi:car-police'
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

export {
  getDiiIcon,
  DII,
}
