export interface RawCapcode {
  CPI: number
  CTT: string
}

export type RawTimelineArray = [
  number | string, // SPI
  number | string, // DII
  number | string, // LAT
  number | string, // LON
  number | string, // REI
  string, // TXT
  (RawCapcode | [number, string])[] // capcodes
]

export interface RawTimelineObject {
  SPI: number | string
  DII: number | string
  LAT: number | string
  LON: number | string
  REI: number | string
  TXT: string
  capcodes: (RawCapcode | [number, string])[]
}

export type RawTimelineData = RawTimelineObject | RawTimelineArray

export interface WSResponse {
  COM?: number
  DAT?: RawTimelineData[]
  [key: string]: any
}

export interface TimelineAlert {
  label: string
  title: string
  description: string
  icon: string
  priority: string
  lat: number
  lon: number
}
