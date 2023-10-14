import { createInertiaApp } from '@inertiajs/svelte'
import "./index.css"

createInertiaApp({
  resolve: name => require(`./Pages/${name}.svelte`),
  setup({ el, App, props }) {
    new App({ target: el, props })
  },
})
 