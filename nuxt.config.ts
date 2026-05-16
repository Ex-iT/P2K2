// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',

  devtools: { enabled: false },

  app: {
    head: {
      title: 'P2000 v2',
      htmlAttrs: {
        lang: 'nl',
      },
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          name: 'description',
          content: 'P2000 meldingen van de brandweer, ambulance, politie en KNRM',
        },
        {
          name: 'apple-mobile-web-app-title',
          content: 'P2K2',
        },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '96x96',
          href: '/favicon-96x96.png',
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png',
        },
        {
          rel: 'icon',
          type: 'image/svg+xml',
          sizes: 'any',
          href: '/favicon.svg',
        },
        {
          rel: 'shortcut icon',
          href: '/favicon.ico',
          media: '(prefers-color-scheme:no-preference)',
        },
        {
          rel: 'shortcut icon',
          href: '/favicon-dark.ico',
          media: '(prefers-color-scheme:dark)',
        },
        {
          rel: 'shortcut icon',
          href: '/favicon.ico',
          media: '(prefers-color-scheme:light)',
        },
        {
          rel: 'manifest',
          href: '/site.webmanifest',
        },
      ],
    },
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/ui',
  ],

  css: ['~/assets/css/main.css'],

  icon: {
    mode: 'css',
    cssLayer: 'base',
    clientBundle: {
      scan: true,
      icons: [
        'mdi:bullhorn-variant-outline',
        'mdi:map-marker',
        'mdi:menu',
        'mdi:alarm-plus',
        'mdi:github-box',
        'mdi:web',
        'mdi:fire-truck',
        'mdi:ambulance',
        'mdi:car-emergency',
        'mdi:lifebuoy',
        'mdi:heart-pulse',
        'mdi:helicopter',
      ],
    },
  },

  ui: {
    experimental: {
      componentDetection: true,
    },
  },

  typescript: {
    typeCheck: true,
    strict: true,
  },
})
