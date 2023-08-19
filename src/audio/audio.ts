window.__P2K2__ = window.__P2K2__ || {}

if (!window.__P2K2__.audio) {
  window.__P2K2__.audio = new Audio()
  window.__P2K2__.audio.src = chrome.runtime.getURL('assets/notification.wav')
}

try {
  window.__P2K2__.audio?.play()
} catch (error) {
  /* empty */
}
