import { createInertiaApp } from "@inertiajs/svelte";
import { mount } from "svelte";

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob("./Pages/**/*.svelte");
    return pages[`./Pages/${name}.svelte`]();
  },
  setup({ el, App, props }) {
    el.classList.add("dark:bg-gray-900", "min-h-screen");
    mount(App, { target: el, props });
  },
});
