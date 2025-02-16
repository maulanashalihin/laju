<script>
import { onMount } from 'svelte';

let darkMode = false;
let mounted = false;
export let onchange = (mode) => {};

onMount(() => {
    // Check system preference
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // Check localStorage or fallback to system preference
    const savedMode = localStorage.getItem('darkMode');
    darkMode = savedMode === null ? systemPrefersDark : savedMode === 'true';
    
    // Apply saved preference
    if (darkMode) {
        document.documentElement.classList.add('dark');
    }

    // Add transition class after initial load to prevent flash
    setTimeout(() => {
        document.documentElement.classList.add('transition-colors');
        mounted = true;
    }, 100);

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (localStorage.getItem('darkMode') === null) {
            darkMode = e.matches;
            toggleDarkMode();
        }
    });
});

function toggleDarkMode() {
    darkMode = !darkMode;
    
    if (darkMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', darkMode);

    
    onchange(darkMode)
}
</script>

<button 
    on:click={toggleDarkMode}
    class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200"
    aria-label="Toggle dark mode"
>
    {#if darkMode}
        <!-- Sun icon for light mode -->
        <svg class="w-5 h-5 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    {:else}
        <!-- Moon icon for dark mode -->
        <svg class="w-5 h-5 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
    {/if}
</button>
