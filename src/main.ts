import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from '@/app/App.vue'
import router from '@/app/router'
import { useLocaleStore } from '@/entities/locale/model/localeStore'
import { useThemeStore } from '@/entities/theme/model/themeStore'
import { useAuthStore } from '@/entities/user/model/authStore'
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
