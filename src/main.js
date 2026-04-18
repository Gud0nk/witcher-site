import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/fonts.css'
import './assets/css/cssIndex.css'
import './assets/css/characters.css'
import './assets/css/misc.css'
import './assets/css/app-overrides.css'

createApp(App).use(router).mount('#app')
