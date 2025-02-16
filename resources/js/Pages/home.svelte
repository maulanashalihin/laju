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
<div class="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
    <div class="text-center" in:fly={{ y: 20, duration: 800, delay: 200 }}>
      <h1 class="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
        Welcome to <span class="text-blue-600 dark:text-blue-400">Laju</span>
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
        A high-performance TypeScript web framework for building modern full-stack applications with speed and elegance.
      </p>
      <div class="flex justify-center gap-4">
        <a
          href="/docs"
          use:inertia
          class="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
        >
          Get Started
        </a>
        <a
          href="/about"
          use:inertia
          class="px-6 py-3 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
        >
          Learn More
        </a>
      </div>
    </div>
  </div>
</div>

<!-- Features Section -->
<div class="py-24 bg-white dark:bg-gray-900">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid md:grid-cols-3 gap-8">
      {#each features as feature, i}
        <div 
          class="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-shadow duration-300"
          in:fly={{ y: 20, duration: 800, delay: 200 + (i * 100) }}
        >
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 text-blue-600 dark:text-blue-400"
            >
              {@html feature.icon}
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {feature.title}
          </h3>
          <p class="text-gray-600 dark:text-gray-300">
            {feature.description}
          </p>
        </div>
      {/each}
    </div>
  </div>
</div>

<!-- CTA Section -->
<div class="py-24 bg-gray-50 dark:bg-gray-800">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <div in:fly={{ y: 20, duration: 800 }}>
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Ready to Get Started?
      </h2>
      <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
        Join us and experience the next generation of development tools.
      </p>
      <a
        href="/register"
        use:inertia
        class="inline-flex items-center px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
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