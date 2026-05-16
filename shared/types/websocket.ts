export interface ParsedSPI {
  DTT: string
  TME: string
  DII: string
  RII: string
}

export enum DII {
  GEN = 0,
  BRW = 1,
  AMBU = 2,
  POL = 3,
  KNMR = 4,
  GHOR = 5,
  REDB = 6,
  HELI = 9,
}

export interface RawCapcode {
  CPI: number
  CTT: string
}

export type RawCapcodeEntry = RawCapcode | RawCapcodeTuple

export type RawCapcodeTuple = [number, string]

export interface RawTimelineObject {
  SPI: number | string
  DII: number | string
  LAT: number | string
  LON: number | string
  REI: number | string
  TXT: string
  capcodes: RawCapcodeEntry[]
}

export type RawTimelineArray = [
  number | string,
  number | string,
  number | string,
  number | string,
  number | string,
  string,
  RawCapcodeEntry[],
]

export type RawTimelineData = RawTimelineObject | RawTimelineArray

export interface TimelineAlert {
  description: string
  icon: string
  label: string
  lat: number
  lon: number
  priority: string
  timeDate: TimeDate
  title: string
}

export interface TimeDate {
  date: string
  time: string
}

export interface UserSettings {
  regions: IREGION[]
}

export type RADMap = Record<string, string>

export interface IREGION {
  data: RADMap
  label: string
}

export interface WSResponse {
  COM?: number
  COO?: string
  CST?: number
  DAT?: RawTimelineData[]
  RAD?: string[]
  UID?: number | string
  USN?: string
  [key: string]: unknown
}

export type WSStatus = 'CLOSED' | 'OPEN' | 'CONNECTING'
