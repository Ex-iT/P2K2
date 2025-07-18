enum DII {
  BRW = 1, // Fire brigade
  AMBU = 2, // Ambulance
  POL = 3, // Police
  KNMR = 4, // Lifeguard
}

function getDiiIcon(dii: number) {
  switch (dii) {
    case DII.BRW:
      return 'mdi:fire-truck'
    case DII.AMBU:
      return 'mdi:ambulance'
    case DII.POL:
      return 'mdi:car-police'
    case DII.KNMR:
      return 'mdi:boat'
    default:
      return 'mdi:code'
  }
}

export {
  getDiiIcon,
}
