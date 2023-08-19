interface LS {
  ln: number // getLongitude
  lt: number // getLatitude
  mp: number // getMinPrio
  r2: boolean // createBasicDeviceLocationRegistration => true : createBasicNewsOnlyDeviceLocationRegistration -> false
  ra: boolean // getSubscribedToAmbulance
  rb: boolean // getSubscribedToBrandweer
  rn: boolean // isNewsTabEnabled
  ro: boolean // getSubscribedToAnders
  rp: boolean // getSubscribedToPolitie
  st: number // getActualLocationStraal (radius in kilometers)
}

export interface Payload {
  ccs: Array<string> // CAPcodes
  dd: string // Device info string
  l: boolean // Trauma helicopter
  ls: Array<LS>
  rid: string // Token
}

export interface MessagesResponse {
  cont: string
  ver: number
  msg: string
  zip: string
  cc: Array<number>
  dnst: string
  lon: number
  hnr: string
  strt: string
  reg: string
  id: number
  smsg: string
  prio: string
  priol: number
  lat: number
  ts: string
  acc: string
  ll: boolean
}

export function getMessages(
  payload: Payload,
  senderResponse: (json: MessagesResponse | []) => void,
) {
  const URL = 'https://webservice-v3.112-nederland.nl'
  const ENDPOINT = '/api/PushMessageCache/GetP2000Messages'

  try {
    fetch(`${URL}${ENDPOINT}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((json) => senderResponse(json))
  } catch (error) {
    console.log(error)
    senderResponse([])
  }
}
