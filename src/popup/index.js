import 'bulma-fluent/bulma.sass';
import Vue from 'vue';
import App from './App.vue';

import VueSimpleMarkdown from 'vue-simple-markdown';
import 'vue-simple-markdown/dist/vue-simple-markdown.css';

Vue.use(VueSimpleMarkdown)
import Vuesax from 'vuesax';
import 'vuesax/dist/vuesax.css';

Vue.use(Vuesax, {
  // options here
})

// eslint-disable-next-line
new Vue({
  el: '#app',
  render: (h) => h(App),
})
