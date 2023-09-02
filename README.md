# P2000 v2

This is a improved and user-friendly version of the [P2000](<https://nl.wikipedia.org/wiki/P2000_(netwerk)>) notifications.

## Development

To install all dependencies run:

```bash
yarn install
```

To start the development server run:

```bash
yarn dev
```

## Rough notes about the API

The Api is at `https://webservice-v3.112-nederland.nl` and accepts POST requests and returns JSON.

## Headers

```
POST /api/PushMessageCache/GetP2000Messages HTTP/2
Host: webservice-v3.112-nederland.nl
Content-Type: application/json; charset=utf-8
User-Agent: okhttp/3.10.0
```

The `Content-Type` should be `application/json` but doesn't need the `charset`.

The `User-Agent` can be faked with the same structure, like: `z0mg/0.1`.

## Payload

```json
{
  "ccs": [],
  "dd": "OS: 5.10.101-genymotion+-ab74, SDK: 31, Device: vbox86p Google Pixel 3 XL Genymobile",
  "l": false,
  "ls": [
    {
      "ln": 4.9,
      "lt": 52.378,
      "mp": 3,
      "r2": true,
      "ra": true,
      "rb": true,
      "rn": false,
      "ro": true,
      "rp": true,
      "st": 20
    }
  ],
  "rid": "dyrC8w...:...AqDEfp"
}
```

### ccs

Array with [CAP codes](<https://nl.wikipedia.org/wiki/P2000_(netwerk)#Capcode>) to filter on.

### dd

A string containing device information, like OS version, SDK version and Device name / version etc.

### l

A Boolean value indicating `SubscribedToLifeLiners`, trauma helicopters.

### ls

An array with objects of the `DeviceLocationSettings` type.

DeviceLocationSettings type:

- `ln`: (integer) getLongitude
- `lt`: (integer) getLatitude
- `mp`: (integer) getMinPrio
- `r2`: (boolean) createBasicDeviceLocationRegistration => true : createBasicNewsOnlyDeviceLocationRegistration -> false
- `ra`: (boolean) getSubscribedToAmbulance
- `rb`: (boolean) getSubscribedToBrandweer
- `rn`: (boolean) isNewsTabEnabled
- `ro`: (boolean) getSubscribedToAnders
- `rp`: (boolean) getSubscribedToPolitie
- `st`: (integer) radius in kilometers (getActualLocationStraal)

### rid

A string with a (FCM) token (https://firebase.google.com/docs/cloud-messaging/manage-tokens), this is a required field but can contain any string.

```kotlin
public class DeviceRegistrationSentRecord {
    public String hash;
    public List<LocationData> locations;
    public Long timestamp;
}
```

## Attribution

Icons by [SVG Repo](<https://www.svgrepo.com>).
