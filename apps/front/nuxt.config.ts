// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  future: {
    compatibilityVersion: 4,
  },
  runtimeConfig: {
    mistralApiKey: '',
    mistralApiEndpoint: '',
    mistralAgentId: '',
    mistralTestAgentId: '',
    ragEndpoint: '',
  },
})
