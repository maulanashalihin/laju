<script>
import { onMount } from 'svelte';
import { Sun, Moon } from 'lucide-svelte';

let darkMode = $state(false);
let mounted = $state(false);

onMount(() => {
    // Check system preference
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // Check localStorage or fallback to system preference
    const savedMode = localStorage.getItem('darkMode');
    darkMode = savedMode === null ? systemPrefersDark : savedMode === 'true';
    
    // Apply saved preference
    applyDarkMode(darkMode);

    // Add transition class after initial load to prevent flash
    setTimeout(() => {
        document.documentElement.classList.add('transition-colors');
        mounted = true;
    }, 100);

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (localStorage.getItem('darkMode') === null) {
            darkMode = e.matches;
            applyDarkMode(darkMode);
        }
    });
});

function applyDarkMode(isDark) {
    if (isDark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

function toggleDarkMode() {
    darkMode = !darkMode;
    applyDarkMode(darkMode);
    localStorage.setItem('darkMode', darkMode);
}
</script>

<button 
    onclick={toggleDarkMode}
    class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700"
    aria-label="Toggle dark mode"
>
    {#if darkMode}
        <Sun class="w-5 h-5 text-slate-800 dark:text-slate-200" />
    {:else}
        <Moon class="w-5 h-5 text-slate-800 dark:text-slate-200" />
    {/if}
</button>
