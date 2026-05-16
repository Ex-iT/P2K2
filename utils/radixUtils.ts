import type { RADMap } from '~/shared/types/websocket'

const RADIX = 36
const WORD_BITS = 32
const NUM_WORDS = 10

function hexToDec(hex: string, radix: number): number {
  return Number.parseInt(hex, radix)
}

function decToHex(dec: number, radix: number): string {
  return dec.toString(radix)
}

function decToBin(decValue: number, numBits: number): number[] {
  const bits: number[] = []
  let temp = decValue
  for (let i = 0; i < numBits; i++) {
    bits[i] = temp % 2 >= 1 ? 1 : 0
    temp = Math.floor(temp / 2)
  }
  return bits
}

function binToDec(bits: number[]): number {
  let result = 0
  for (let i = 0; i < bits.length; i++) {
    if (bits[i]) {
      result += 2 ** i
    }
  }
  return result
}

function radToBin(rad: RADMap): number[] {
  const bin: number[] = Array.from({ length: NUM_WORDS * WORD_BITS }, () => 0)

  for (let i = 0; i < NUM_WORDS; i++) {
    const radValue = rad[i] || '0'
    const decValue = hexToDec(String(radValue), RADIX)
    const bits = decToBin(decValue, WORD_BITS)

    for (let j = 0; j < WORD_BITS; j++) {
      bin[i * WORD_BITS + j] = bits[j] ?? 0
    }
  }

  return bin
}

function binToRad(bin: number[]): RADMap {
  const rad: RADMap = {}

  for (let i = 0; i < NUM_WORDS; i++) {
    const wordBits = bin.slice(i * WORD_BITS, (i + 1) * WORD_BITS)
    const decValue = binToDec(wordBits)
    rad[i] = decToHex(decValue, RADIX)
  }

  return rad
}

export function combineRADs(radMaps: RADMap[]): RADMap {
  if (radMaps.length === 0) {
    return {}
  }

  if (radMaps.length === 1) {
    return radMaps[0]!
  }

  const combinedBin = radToBin(radMaps[0]!)

  for (let i = 1; i < radMaps.length; i++) {
    const radBin = radToBin(radMaps[i]!)
    for (let j = 0; j < combinedBin.length; j++) {
      combinedBin[j] = combinedBin[j] || (radBin[j] ?? 0)
    }
  }

  return binToRad(combinedBin)
}
