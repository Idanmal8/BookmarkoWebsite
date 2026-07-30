import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import { initAnalytics } from './utils/analytics'

// After index.html's 404 fallback has restored the real path, so GA reports
// `/blog/foo` rather than `/?p=/blog/foo`.
initAnalytics()

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
