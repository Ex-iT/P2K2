import { MessagesResponse, Payload } from '../lib/message.js'

const content = document.getElementById('content')
const header = document.querySelector('button')
header?.addEventListener('click', handleClick)

// @TODO: Fix color scheme icons
// const mql = window.matchMedia('(prefers-color-scheme: dark)')
// mql.onchange = ({ matches }) => {
//   chrome.runtime.sendMessage({
//     action: 'setTheme',
//     payload: matches ? 'dark' : 'light',
//   })
// }
// const isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
// chrome.runtime.sendMessage({
//   action: 'setTheme',
//   payload: isDarkTheme ? 'dark' : 'light',
// })

// const interval = setInterval(() => {
//   console.log(1)
// }, 1e3)

// let i = 0
// chrome.alarms.onAlarm.addListener((alarm) => {
//   console.log(alarm)
//   chrome.action.setBadgeText({ text: (i++).toString() })
//   // if (audio) {
//   //   audio.play()
//   // }
// })

function handleClick() {
  const payload: Payload = {
    ccs: [],
    dd: 'OS: 1, SDK: 1, Device: Google Pixel 1',
    l: true,
    ls: [
      {
        ln: 5.249008, // Zeist
        lt: 52.0865318, // Zeist
        // ln: 4.9, // Amsterdam
        // lt: 52.378, // Amsterdam
        mp: 3,
        r2: true,
        ra: true,
        rb: true,
        rn: false,
        ro: true,
        rp: true,
        st: 20,
      },
    ],
    rid: 'x',
  }

  chrome.runtime.sendMessage(
    { action: 'getMessages', payload },
    (response: Array<MessagesResponse>) => {
      console.log(response)
      if (content) {
        content.innerHTML = JSON.stringify(response, null, 2)
      }
    },
  )
}

// console.log('Click')
// chrome.action.setBadgeBackgroundColor({ color: '#FF0000' })
// chrome.action.setBadgeTextColor({ color: '#FFFFFF' })

// i = i++

// if (i >= 10) {
//   chrome.action.setBadgeText({ text: '...' })
// } else {
//   chrome.action.setBadgeText({ text: (i++).toString() })
// }
