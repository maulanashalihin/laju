<script>
  import { fly, fade } from 'svelte/transition';
  import { page, router, inertia } from '@inertiajs/svelte';
  import { clickOutside } from '../Components/helper';
  import DarkModeToggle from './DarkModeToggle.svelte'; 

  let user = $page.props.user;
  let isMenuOpen = false;
  let isUserMenuOpen = false;
  let scrollY = 0;

  export let group; 

  const menuLinks = [
    { href: '/home', label: 'Beranda', group: 'home', show : true },  
    { href: '/profile', label: 'Profile', group: 'profile', show : user ? true : false },
  ];

  function handleLogout() {
    router.post('/logout');
  }

  // Prevent body scroll when menu is open
  $: if (typeof document !== 'undefined') {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
  }
</script>

<svelte:window bind:scrollY />

<header 
  class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
>
  <!-- Background / Blur Layer -->
  <div 
    class="absolute inset-0 transition-all duration-300"
    class:bg-white_80={scrollY > 10}
    class:dark:bg-slate-950_80={scrollY > 10}
    class:backdrop-blur-xl={scrollY > 10}
    class:border-b={scrollY > 10}
    class:border-slate-100={scrollY > 10}
    class:dark:border-slate-800_50={scrollY > 10}
    class:shadow-sm={scrollY > 10}
    style:opacity={scrollY > 10 ? 1 : 0}
  ></div>

  <nav class="relative mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
    
    <!-- Logo -->
    <a href="/" use:inertia class="flex items-center gap-2.5 group relative z-20">
    <div class="flex items-center gap-2 mb-4">
                        <svg width="30" height="30" viewBox="0 0 100 100" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" style="stop-color:#f97316;stop-opacity:1" />
                                    <stop offset="100%" style="stop-color:#ea580c;stop-opacity:1" />
                                </linearGradient>
                            </defs>
                            <path d="M30 10 H65 L55 50 H20 Z" fill="url(#grad1)" />
                            <path d="M20 58 H85 L75 90 H10 Z" fill="url(#grad1)" />
                            <rect x="70" y="58" width="20" height="32" transform="skewX(-14)" fill="white"
                                fill-opacity="0.1" />
                        </svg>
                        <h2 class="text-2xl font-black tracking-tighter italic">Laju<span
                                class="text-primary-500">.dev</span></h2>
                    </div>
    </a>
    
    <!-- Desktop Menu (Centered Island) -->
    <div class="hidden md:flex items-center gap-1 p-1.5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-full border border-slate-200/50 dark:border-slate-800/50 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-sm transition-all duration-300 hover:bg-white/80 dark:hover:bg-slate-900/80 hover:shadow-md">
      {#each menuLinks.filter((item) => item.show) as item}
        <a 
          use:inertia 
          href={item.href} 
          class="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 relative overflow-hidden {item.group === group 
            ? 'text-primary-700 dark:text-primary-300 bg-white dark:bg-slate-800 shadow-sm ring-1 ring-black/5 dark:ring-white/10' 
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'}"
        >
          {item.label}
        </a>
      {/each}
    </div>
    
    <!-- Right Side Actions -->
    <div class="flex items-center gap-3 sm:gap-4 relative z-20">
      <div class="hidden sm:block">
        <DarkModeToggle />
      </div>
      
      <!-- Auth User -->
      <div class="hidden sm:flex items-center pl-4 border-l border-slate-200 dark:border-slate-800">
        {#if user && user.id}
          <div class="relative" use:clickOutside on:click_outside={() => isUserMenuOpen = false}>
            <button 
              class="flex items-center gap-3 p-1 pr-4 rounded-full border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-white hover:border-primary-200 dark:hover:bg-slate-800 dark:hover:border-primary-700 transition-all duration-300 group"
              class:ring-2={isUserMenuOpen}
              class:ring-primary-100={isUserMenuOpen}
              class:dark:ring-primary-900={isUserMenuOpen}
              on:click={() => isUserMenuOpen = !isUserMenuOpen}
            >
              <div class="w-9 h-9 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-950 group-hover:scale-105 transition-transform">
                <span class="text-primary-700 dark:text-primary-300 font-semibold text-sm">{user.name[0].toUpperCase()}</span>
              </div>
              <div class="flex flex-col items-start">
                <span class="font-semibold text-sm text-slate-700 dark:text-slate-200 leading-none">{user.name}</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5 text-slate-400 group-hover:text-primary-500 transition-all duration-300 {isUserMenuOpen ? 'rotate-180' : ''}">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {#if isUserMenuOpen}
              <div 
                class="absolute right-0 mt-3 w-60 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 overflow-hidden ring-1 ring-black/5"
                transition:fly={{ y: 10, duration: 200 }}
              >
                <div class="p-4 bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                  <p class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Signed in as</p>
                  <p class="text-sm font-semibold text-slate-900 dark:text-white truncate">{user.email || user.name}</p>
                </div>
                
                <div class="p-2 flex flex-col gap-0.5">
                  <a href="/profile" use:inertia class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-colors group">
                    <span class="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700 text-slate-500 group-hover:text-primary-500 transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </span>
                    Profile
                  </a> 
                </div>
                
                <div class="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                  <button 
                    on:click={handleLogout}
                    class="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    Logout
                  </button>
                </div>
              </div>
            {/if}
          </div>
        {:else}
          <div class="flex items-center gap-2">
            <a href="/login" use:inertia class="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-4 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Masuk</a>
            <a href="/register" use:inertia class="btn-primary text-sm px-5 py-2.5 rounded-full shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 active:scale-95 transition-all">Daftar</a>
          </div>
        {/if}
      </div>

      <!-- Mobile Menu Toggle -->
      <div class="flex items-center gap-2 md:hidden">
        <div class="scale-90">
          <DarkModeToggle />
        </div>
        <button
          class="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-all active:scale-95"
          on:click={() => isMenuOpen = !isMenuOpen}
          aria-label="Menu"
        >
          <div class="w-5 h-5 flex flex-col justify-center gap-1.5">
            <span class="w-full h-0.5 bg-current rounded-full transition-all duration-300 origin-center {isMenuOpen ? 'rotate-45 translate-y-2' : ''}"></span>
            <span class="w-full h-0.5 bg-current rounded-full transition-all duration-300 {isMenuOpen ? 'opacity-0 scale-0' : ''}"></span>
            <span class="w-full h-0.5 bg-current rounded-full transition-all duration-300 origin-center {isMenuOpen ? '-rotate-45 -translate-y-2' : ''}"></span>
          </div>
        </button>
      </div>
    </div>
  </nav>
  
  <!-- Mobile Menu Overlay -->
  {#if isMenuOpen}
  <div class="md:hidden fixed inset-0 z-40 h-[100dvh]">
    <!-- Backdrop -->
    <button 
      class="absolute inset-0 w-full h-full cursor-default bg-slate-900/30 backdrop-blur-md transition-opacity duration-300 border-none p-0 m-0"
      transition:fade={{ duration: 200 }}
      on:click={() => isMenuOpen = false}
      on:keydown={(e) => e.key === 'Escape' && (isMenuOpen = false)}
      aria-label="Close menu"
    ></button>
    
    <!-- Menu Drawer -->
    <div
      class="absolute right-0 top-0 h-full w-[85%] max-w-[320px] bg-white dark:bg-slate-950 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col pointer-events-auto"
      transition:fly={{ x: 300, duration: 400, opacity: 1 }}
    >
      <!-- Drawer Header -->
      <div class="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
        <span class="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
          Menu
        </span>
        <button 
          on:click={() => isMenuOpen = false}
          class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          aria-label="Close menu"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto py-4 px-4">
        <div class="flex flex-col space-y-2">
          {#each menuLinks.filter((item) => item.show) as item}
            <a 
              href={item.href} 
              use:inertia
              class="flex items-center justify-between p-4 rounded-2xl text-base font-medium transition-all active:scale-98 {item.group === group 
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 shadow-sm border border-primary-100 dark:border-primary-800' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent'}"
            >
              {item.label}
              {#if item.group === group}
                <div class="w-2 h-2 rounded-full bg-primary-500"></div>
              {/if}
            </a>
          {/each}
        </div>
      </div>

      <!-- Drawer Footer -->
      <div class="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
        {#if user}
          <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 mb-4 shadow-sm">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-700 dark:text-primary-400 font-bold">
                {user.name[0].toUpperCase()}
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-slate-900 dark:text-white truncate">{user.name}</p>
                <p class="text-xs text-slate-500 truncate">{user.email || 'Member'}</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <a href="/profile" use:inertia class="flex items-center justify-center py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Profile</a>
              <button on:click={handleLogout} class="flex items-center justify-center py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">Logout</button>
            </div>
          </div>
        {:else}
          <div class="grid gap-3">
            <a href="/login" use:inertia class="btn-secondary w-full justify-center py-3 rounded-xl">Masuk</a>
            <a href="/register" use:inertia class="btn-primary w-full justify-center py-3 rounded-xl shadow-lg shadow-primary-500/20">Daftar</a>
          </div>
        {/if}
      </div>
    </div>
  </div>
  {/if}
</header>
