import { Payload, getMessages } from './lib/message.js'
import { Theme, setTheme } from './lib/theme.js'

chrome.runtime.onInstalled.addListener(({ reason }) => {
  // if (reason !== chrome.runtime.OnInstalledReason.INSTALL) {
  //   return
  // }

  chrome.alarms.create('life-cycle', {
    delayInMinutes: 1,
    periodInMinutes: 1,
  })

  // chrome.alarms.onAlarm.addListener(async (alarm) => sendAlert())
})

async function sendAlert(senderResponse) {
  // const tab = await getCurrentTab()

  // if (tab?.id) {
  //   chrome.scripting.executeScript({
  //     target: { tabId: tab.id || 0 },
  //     files: ['audio/audio.js'],
  //   })
  // }

  // chrome.action.setBadgeText({ text: '...' })
  // chrome.action.setBadgeBackgroundColor({ color: '#FF0000' })
  // chrome.action.setBadgeTextColor({ color: '#FFFFFF' })
  chrome.notifications.create(
    '',
    {
      type: 'basic',
      iconUrl: 'images/favicon-128-light.png',
      title: 'W00p',
      message: 'some message..',
    },
    (notificationId: string) => {
      senderResponse(notificationId)
    },
  )
}

async function getCurrentTab() {
  const queryOptions = { active: true, lastFocusedWindow: true }
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  const [tab] = await chrome.tabs.query(queryOptions)
  return tab
}

chrome.runtime.onMessage.addListener(
  async (message, sender, senderResponse) => {
    switch (message.action) {
      case 'getMessages':
        sendAlert(senderResponse)
        // getMessages(message.payload as Payload, senderResponse)
        break
      case 'setTheme':
        setTheme(
          (message.payload as Theme) === 'dark' ? 'light' : 'dark',
          senderResponse,
        )
        break
      default:
        break
    }

    return true
  },
)
