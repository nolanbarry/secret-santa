import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

/* From Fontawesome, which has lots of nice/fun free icons */
/* https://fontawesome.com/docs/web/use-with/vue/ */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

library.add(faBars)

const app = createApp(App)

app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
