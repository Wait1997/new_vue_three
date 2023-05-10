import { createApp } from 'vue'
import { Toast } from 'vant'
import router from './router'
import App from './App.vue'

import 'normalize.css'
import 'vant/es/toast/style'
import './assets/main.css'

const app = createApp(App)

app.use(router).use(Toast).mount('#app')
