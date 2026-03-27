<script>
import { Sun, Moon } from 'lucide-svelte';

let darkMode = $state(false);
let mounted = $state(false);

// Initialize dark mode immediately (before component mounts)
(function initDarkMode() {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedMode = localStorage.getItem('darkMode');
    darkMode = savedMode === null ? systemPrefersDark : savedMode === 'true';
    
    // Apply saved preference immediately
    applyDarkMode(darkMode);
    
    // Mark as mounted after applying
    mounted = true;
    
    // Add transition class after initial load to prevent flash
    setTimeout(() => {
        document.documentElement.classList.add('transition-colors');
    }, 100);
})();

// Listen for system preference changes
$effect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    function handleChange(e) {
        if (localStorage.getItem('darkMode') === null) {
            darkMode = e.matches;
            applyDarkMode(darkMode);
        }
    }
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
        mediaQuery.removeEventListener('change', handleChange);
    };
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
    localStorage.setItem('darkMode', darkMode.toString());
}
</script>

<button
    onclick={toggleDarkMode}
    class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700"
    aria-label="Toggle dark mode"
>
    {#if mounted}
        {#if darkMode}
            <Sun class="w-5 h-5 text-slate-800 dark:text-slate-200" />
        {:else}
            <Moon class="w-5 h-5 text-slate-800 dark:text-slate-200" />
        {/if}
    {:else}
        <!-- Placeholder to prevent layout shift -->
        <div class="w-5 h-5" />
    {/if}
</button>
