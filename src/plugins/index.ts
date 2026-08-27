import type { App } from 'vue'
/**
 * plugins/index.ts
*
* Automatically included in `./src/main.ts`
*/

import { createPinia } from 'pinia'
import router from '../router'
import vuetify from './vuetify'

export function registerPlugins (app: App) {
  app.use(vuetify)
  app.use(createPinia())
  app.use(router)
}
