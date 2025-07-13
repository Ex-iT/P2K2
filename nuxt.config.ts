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
          content: '',
        },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico',
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
    '@vueuse/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  icon: {
    mode: 'css',
    cssLayer: 'base',
  },

  typescript: {
    typeCheck: true,
    strict: true,
  },
})
