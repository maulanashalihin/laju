<script>
  import { inertia, router } from "@inertiajs/svelte"
  import LajuIcon from "../../Components/LajuIcon.svelte"

  let form = $state({
    email: "",
    phone: ""
  })

  let isLoading = $state(false)
  let { flash } = $props()

  function submitForm() {
    isLoading = true
    router.post("/forgot-password", form, {
      onFinish: () => {
        isLoading = false
      }
    })
  }
</script>

<section class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
  </div>

  <div class="w-full max-w-md px-6 relative z-10">
    <div class="flex justify-center mb-8">
      <LajuIcon />
    </div>

    <div class="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
      <div class="text-center mb-8">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-500/20 flex items-center justify-center">
          <svg class="w-8 h-8 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-white">Forgot password?</h2>
        <p class="text-slate-400 mt-2">No worries, we'll send you reset instructions</p>
      </div>

      {#if flash?.error}
        <div class="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
          <svg class="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-red-400 text-sm">{flash.error}</span>
        </div>
      {/if}

      {#if flash?.success}
        <div class="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-start gap-3">
          <svg class="w-5 h-5 text-green-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-green-400 text-sm">{flash.success}</span>
        </div>
      {/if}

      <form class="space-y-6" onsubmit={(e) => { e.preventDefault(); submitForm(); }}>
        <div class="space-y-2">
          <label for="email" class="block text-sm font-medium text-slate-300">Email address</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              bind:value={form.email}
              type="email"
              name="email"
              id="email"
              class="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {#if isLoading}
            <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending...
          {:else}
            Send reset link
          {/if}
        </button>
      </form>

      <div class="mt-8 text-center">
        <a href="/login" use:inertia class="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to sign in
        </a>
      </div>
    </div>
  </div>
</section>
