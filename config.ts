export const WS_URL = 'wss://www.livep2000.nl:443/LSM/websocket'
export const WS_HANDSHAKE = {
  TYP: 'ANN', // Account type (ANN = Anonymous | MEM = Member)
  COO: '', // Cookie
  UID: '', // User ID
  COM: 6, // Authentication request (client -> master)
}
export const WS_DATA_REQ = {
  FRQ: true, // Command First Request
  COM: 12, // data request
}
export const WS_AUTH_RESPONSE = 7 // Authentication response code
export const MAPS_URL = 'https://maps.livep2000.nl/map.php?DII=2&LAT=&LON=&TXT=&ADR='
export const MAX_ITEMS = 50

export const REGIONS: IREGION[] = [
  {
    label: 'Alle regios',
    data: {
      0: '1gp7nj3',
      1: '1ug4yd3',
      2: 'ydb931',
      3: '1pv5ur3',
      4: '3',
      5: '13vwye8',
      6: '0',
      7: '0',
      8: '0',
      9: '0',
    },
  },
  {
    label: 'Groningen',
    data: {
      0: '1gp7njy',
      5: 'qug174',
    },
  },
  {
    label: 'Friesland',
    data: {
      0: '1gp7obi',
      5: 'qug17k',
    },
  },
  {
    label: 'Drenthe',
    data: {
      0: '1gp8cta',
      5: 'qug180',
    },
  },
  {
    label: 'IJsselland',
    data: {
      0: '1gpu4m6',
      5: 'qug18g',
    },
  },
  {
    label: 'Twente',
    data: {
      0: '1h96uam',
      5: 'qug18w',
    },
  },
  {
    label: 'Noord en Oost Gelderland',
    data: {
      0: '1ygho0u',
      5: 'qug19c',
    },
  },
  {
    label: 'Gelderland Midden',
    data: {
      0: '1gp7nj2',
      1: '1ug4ydb',
      5: 'qug19s',
    },
  },
  {
    label: 'Gelderland Zuid',
    data: {
      0: '1gp7nj2',
      1: '1ug4yk7',
      5: 'qug1a8',
    },
  },
  {
    label: 'Utrecht',
    data: {
      0: '1gp7nj2',
      1: '1ug54on',
      5: 'qug1ao',
    },
  },
  {
    label: 'Noord-Holland Noord',
    data: {
      0: '1gp7nj2',
      1: '1ugakmv',
      5: 'qug1b4',
    },
  },
  {
    label: 'Zaanstreek-Waterland',
    data: {
      0: '1gp7nj2',
      1: '1ul4r1z',
      5: 'qug1bk',
    },
  },
  {
    label: 'Kennemerland',
    data: {
      0: '1gp7nj2',
      1: '1yvyghj',
      5: 'qug1c0',
    },
  },
  {
    label: 'Amsterdam-Amstelland',
    data: {
      0: '1gp7nj2',
      2: 'ydb933',
      5: 'qug1cg',
    },
  },
  {
    label: 'Gooi en Vechtstreek',
    data: {
      0: '1gp7nj2',
      2: 'ydb94t',
      5: 'qug1cw',
    },
  },
  {
    label: 'Haaglanden',
    data: {
      0: '1gp7nj2',
      2: 'ydbanx',
      5: 'qug1dc',
    },
  },
  {
    label: 'Hollands Midden',
    data: {
      0: '1gp7nj2',
      2: 'ydcnnh',
      5: 'qug1ds',
    },
  },
  {
    label: 'Rotterdam Rijnmond',
    data: {
      0: '1gp7nj2',
      2: 'yek799',
      5: 'qug1e8',
    },
  },
  {
    label: 'Zuid-Holland Zuid',
    data: {
      0: '1gp7nj2',
      2: 'zh9mm5',
      5: 'qug1eo',
    },
  },
  {
    label: 'Zeeland',
    data: {
      0: '1gp7nj2',
      2: '1xvva2l',
      5: 'qug1f4',
    },
  },
  {
    label: 'Midden- en West-Brabant',
    data: {
      0: '1gp7nj2',
      3: '1pv5urj',
      5: 'qug1fk',
    },
  },
  {
    label: 'Brabant Noord',
    data: {
      0: '1gp7nj2',
      3: '1pv5v5b',
      5: 'qug1g0',
    },
  },
  {
    label: 'Brabant Zuid en Oost',
    data: {
      0: '1gp7nj2',
      3: '1pv67e7',
      5: 'qug1gg',
    },
  },
  {
    label: 'Limburg Noord',
    data: {
      0: '1gp7nj2',
      3: '1pvh3an',
      5: 'qug1gw',
    },
  },
  {
    label: 'Limburg Zuid',
    data: {
      0: '1gp7nj2',
      3: '1q55g4v',
      5: 'qug1hc',
    },
  },
  {
    label: 'Flevoland',
    data: {
      0: '1gp7nj2',
      3: '1yqsuzz',
      5: 'qug1hs',
    },
  },
]

export const WS_RESET = {
  COM: 12,
  RAD: REGIONS[0]!.data,
}
