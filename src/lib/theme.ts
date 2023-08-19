export type Theme = 'light' | 'dark'

export function setTheme(theme: Theme, senderResponse: (theme: Theme) => void) {
  chrome.action
    .setIcon({
      path: {
        // '16': `images/favicon-16-${theme}.png`,
        // '24': `images/favicon-24-${theme}.png`,
        // '32': `images/favicon-32-${theme}.png`,
        '48': `images/favicon-48-${theme}.png`,
        '128': `images/favicon-128-${theme}.png`,
      },
    })
    .then(() => senderResponse(theme))
}
