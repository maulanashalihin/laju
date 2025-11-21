<!-- home.svelte -->
<script>
  import { inertia } from '@inertiajs/svelte'
  import { fly, fade } from 'svelte/transition'
  import { page } from '@inertiajs/svelte'
  import Header from '../Components/Header.svelte'
  
  let features = [
    {
      title: "Powerful Features",
      description: "Built with modern tools for maximum productivity",
      icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />`
    },
    {
      title: "Dark Mode Support",
      description: "Seamless dark mode integration for better viewing",
      icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />`
    },
    {
      title: "Modern UI/UX",
      description: "Beautiful interfaces with smooth animations",
      icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />`
    }
  ]
</script>

<Header group="home" />

<!-- Hero Section -->
<div class="relative min-h-screen overflow-hidden bg-white dark:bg-slate-950">
  <div class="absolute top-0 -left-4 w-72 h-72 bg-brand-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob dark:mix-blend-normal dark:opacity-10"></div>
  <div class="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 dark:mix-blend-normal dark:opacity-10"></div>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 relative z-10">
    <div class="text-center" in:fly={{ y: 20, duration: 800, delay: 200 }}>
      <h1 class="flex justify-center">
          <div class="flex items-center gap-2 mb-4">
                        <svg width="40" height="40" viewBox="0 0 100 100" fill="none"
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
                        <div class="text-4xl font-black tracking-tighter italic">Laju<span
                                class="text-brand-500">.dev</span></div>
                    </div>
      </h1>
      <p class="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
        A high-performance TypeScript web framework for building modern full-stack applications with speed and elegance.
      </p>
      <div class="flex justify-center gap-4">
        <a
          href="https://github.com/maulanashalihin/laju/tree/main/docs"
           target="_blank"
          class="px-6 py-3 text-white bg-brand-600 hover:bg-brand-700 rounded-xl font-medium transition-all shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40"
        >
          Get Started
        </a>
        <a
          href="https://deepwiki.com/maulanashalihin/laju"
           target="_blank"
          class="px-6 py-3 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 rounded-xl font-medium transition-colors"
        >
          Learn More
        </a>
      </div>
    </div>
  </div>
</div>

<!-- Features Section -->
<div class="py-24 bg-white dark:bg-slate-950">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid md:grid-cols-3 gap-8">
      {#each features as feature, i}
        <div 
          class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-brand-500/50 dark:hover:border-brand-500/50 hover:shadow-lg transition-all duration-300 group"
          in:fly={{ y: 20, duration: 800, delay: 200 + (i * 100) }}
        >
          <div class="w-12 h-12 bg-brand-100 dark:bg-brand-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 text-brand-600 dark:text-brand-400"
            >
              {@html feature.icon}
            </svg>
          </div>
          <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {feature.title}
          </h3>
          <p class="text-slate-600 dark:text-slate-400">
            {feature.description}
          </p>
        </div>
      {/each}
    </div>
  </div>
</div>

<!-- CTA Section -->
<div class="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <div in:fly={{ y: 20, duration: 800 }}>
      <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-4">
        Ready to Get Started?
      </h2>
      <p class="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
        Join us and experience the next generation of development tools.
      </p>
      <a
        href="/register"
        use:inertia
        class="inline-flex items-center px-8 py-4 text-white bg-brand-600 hover:bg-brand-700 rounded-xl font-bold transition-all shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40"
      >
        Create Account
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5 ml-2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </a>
    </div>
  </div>
</div>