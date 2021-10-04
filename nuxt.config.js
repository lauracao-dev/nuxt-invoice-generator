import colors from 'vuetify/es5/util/colors'

export default {
  target: 'static',
  publicRuntimeConfig: {
    apiURL: process.env.API_URL
  },

  generate: {
    fallback: true
  },

  env: {
    // baseUrl: process.env.BASE_URL || 'http://localhost:3000'
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s',
    title: 'Invoice Generator',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/vue-clipboard2.js',
    '~/plugins/vuedraggable.js',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/dotenv',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules:
    [
      // https://go.nuxtjs.dev/axios
      '@nuxtjs/axios',
    ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true, // customVariables by default only avail in build mode
    theme: {
      themes: {
        light: {
          primary: '#9155fd',
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        path: '',
        component: resolve(__dirname, 'layouts/default.vue'),
        children: [{ path: '/document-view/:id', component: resolve(__dirname, 'pages/document/_id.vue'), name: 'document-view', }]
      })
    }
  },

}
