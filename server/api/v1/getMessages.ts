import { randomInt, randomUUID } from 'node:crypto'
import capcodes from '@/public/capcodes.json'

export default defineEventHandler(async () => {
  // @TODO: move to config
  const URL = 'https://webservice-v3.112-nederland.nl'
  const ENDPOINT = '/api/PushMessageCache/GetP2000Messages'

  // @TODO: create an interface for the payload
  const payload = {
    ccs: [], // CAPcodes
    dd: `OS: ${randomInt(1, 10)}.${randomInt(1, 99)}.${randomInt(1, 999)}, SDK: ${randomInt(1, 99)}, Device: Google Pixel ${randomInt(1, 10)}`,
    l: true, // Trauma helicopter
    ls: [
      {
        ln: 5.249008, // Zeist
        lt: 52.0865318, // Zeist
        // ln: 4.9, // Amsterdam
        // lt: 52.378, // Amsterdam
        mp: 3, // Prio
        r2: true,
        ra: true,
        rb: true,
        rn: false,
        ro: true,
        rp: true,
        st: 20, // Radius (in KM)
      },
    ],
    rid: randomUUID(),
  }

  try {
    // @TODO: Create a return type for this promise
    return fetch(`${URL}${ENDPOINT}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then((json) => {
        // @TODO: Type the item
        json.forEach((item) => {
          if (item.cc.length) {
            item.capcodes = item.cc.map((cc: string) => {
              const code = `0${cc}`
              // @TODO: type the capcodes.json
              const capcode = capcodes[code]
              if (capcode) {
                return {
                  id: capcode.id,
                  label: capcode.label,
                }
              }
              return code
            })
          }
        })

        return json
      })
  } catch (error) {
    return []
  }
})
