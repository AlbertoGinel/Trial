// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@sidebase/nuxt-auth', "@nuxt/image"],
  auth: { provider: { type: 'authjs' }, origin: '/login' },

  components: true,
})