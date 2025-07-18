interface TimelineData {
  SPI: number // Timestamp
  DII: number // Dispatching institution
  LAT: number // Latitude
  LON: number // Longitude
  REI: number // Response institution
  TXT: string // Text
  capcodes: {
    CPI: number // Capcode
    CTT: string // Capcode text
  }[]
}

function parseDataToItems(data: TimelineData[]) {
  return data.map((item) => {
    const parsedSpi = parseSpi(item.SPI.toString())

    return {
      date: `${parsedSpi.TME} ${parsedSpi.DTT}`,
      title: item.TXT,
      description: item.capcodes.map(capcode => capcode.CTT).join('\n'),
      icon: getDiiIcon(item.DII),
      lat: item.LAT,
      lon: item.LON,
    }
  })
}

export {
  parseDataToItems,
}
