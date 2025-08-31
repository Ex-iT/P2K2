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
    const title = item.TXT.replace(/(<([^>]+)>)/g, '')
    const description = item.capcodes.map(capcode => capcode.CTT).join('\n')
    const icon = getDiiIcon(item.DII)

    return {
      date: `${parsedSpi.TME} ${parsedSpi.DTT}`,
      title,
      description,
      icon,
      lat: item.LAT,
      lon: item.LON,
    }
  })
}

export {
  parseDataToItems,
}
