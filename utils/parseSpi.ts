function parseSpi(SPI: string) {
  return {
    DTT: `${SPI.slice(4, 6)}-${SPI.slice(2, 4)}-${SPI.slice(0, 2)}`,
    TME: `${SPI.slice(6, 8)}:${SPI.slice(8, 10)}:${SPI.slice(10, 12)}`,
    DII: SPI.slice(12, 14),
    RII: SPI.slice(14, 16),
  }
}

export {
  parseSpi,
}
