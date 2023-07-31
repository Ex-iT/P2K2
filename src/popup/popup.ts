let i = 0

const header = document.querySelector('button')
header?.addEventListener('click', handleClick)

function handleClick() {
  console.log('Click')
  chrome.action.setBadgeBackgroundColor({ color: '#FF0000' })
  chrome.action.setBadgeTextColor({ color: '#FFFFFF' })

  i = i++

  if (i >= 10) {
    chrome.action.setBadgeText({ text: '...' })
  } else {
    chrome.action.setBadgeText({ text: (i++).toString() })
  }
}
