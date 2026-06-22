import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from '@/app/App.vue'
import router from '@/app/router'
import { useAuthStore } from '@/entities/user/model/authStore'
import '@/app/styles/index.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const authStore = useAuthStore()
authStore.init()

app.mount('#app')
