import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from '@/app/App.vue'
import router from '@/app/router'
import { useLocaleStore } from '@/entities/locale'
import { useThemeStore } from '@/entities/theme'
import { useAuthStore } from '@/entities/user'
import { i18n } from '@/shared/i18n'
import '@/app/styles/index.css'

const app = createApp(App)

app.use(createPinia())
app.use(i18n)
app.use(router)

useThemeStore().init()
useLocaleStore().init()

const authStore = useAuthStore()
void authStore.init()

app.mount('#app')
