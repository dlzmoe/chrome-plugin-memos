import 'bulma-fluent/bulma.sass'
import Vue from 'vue'
import App from './App.vue'

import VueSimpleMarkdown from 'vue-simple-markdown'
// You need a specific loader for CSS files like https://github.com/webpack/css-loader
import 'vue-simple-markdown/dist/vue-simple-markdown.css'

Vue.use(VueSimpleMarkdown)

// eslint-disable-next-line
new Vue({
  el: '#app',
  render: (h) => h(App),
})
