// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

  devtools: { enabled: false },

  app: {
    head: {
      title: "AI App Tester",
      titleTemplate: "%s – AI App Tester",
      htmlAttrs: {
        lang: "en"
      },
      meta: [{ name: "description", content: "" }],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: ""
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Livvic:wght@400;500;600;700;900&&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&&family=Comfortaa:wght@300;400;500;600;700&display=swap"
        }
      ]
    },

    pageTransition: {
      name: "page",
      mode: "out-in"
    }
  },

  modules: ["nuxt-mongoose", "@pinia/nuxt", "@nuxt/ui"],

  css: ["~/assets/scss/main.scss"],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/scss/abstracts.scss" as *;'
        }
      }
    }
  },

  components: [{ path: "~/components", pathPrefix: false }],

  runtimeConfig: {
    anthropicApiKey: ""
  }
});
