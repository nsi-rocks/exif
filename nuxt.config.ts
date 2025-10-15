// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxtjs/i18n'],
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon-96x96.png', sizes: '96x96' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ],
      meta: [
        { name: 'apple-mobile-web-app-title', content: 'EXIF Rocks !' }
      ]
    },
  },
  css: ['~/assets/css/main.css'],
  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'fr', name: 'Français', file: 'fr.json' },
    ],
    defaultLocale: 'fr',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      alwaysRedirect: true,
      redirectOn: 'root',
      fallbackLocale: 'fr'
    }
  },
  compatibilityDate: '2025-01-20',
  fonts: {
    provider: 'fontsource',
    defaults: {
      subsets: ['latin'],
      weights: ['400 700'],
      styles: ['normal', 'italic'],
    }
  },
  nitro: {
    prerender: { 
      autoSubfolderIndex: false,
      crawlLinks: true,
    }
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
})