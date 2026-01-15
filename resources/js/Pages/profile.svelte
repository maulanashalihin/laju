<script>
  import Header from "../Components/Header.svelte";
  import { Toast } from "../Components/helper";
  import { page, router } from '@inertiajs/svelte';

  let { flash, user } = $props();


  let current_password = $state('');
  let new_password = $state('');
  let confirm_password = $state('');
  let isLoading = $state(false); 
  let previewUrl = $derived(user?.avatar || null);

  let formName = $state('');
  let formEmail = $state('');
  let formPhone = $state('');

  $effect(() => {
    if (user?.name !== undefined) formName = user.name;
    if (user?.email !== undefined) formEmail = user.email;
    if (user?.phone !== undefined) formPhone = user.phone;
  });




  function handleAvatarChange(event) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      isLoading = true;
      fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success && data.data) {
            // Save avatar URL to database using Inertia router
            router.post('/change-profile', {
              name: formName,
              email: formEmail,
              phone: formPhone,
              avatar: data.data.url
            }, {
              onFinish: () => {
                setTimeout(() => {
                  isLoading = false;
                  previewUrl = data.data.url + "?v=" + Date.now();
                }, 500);
                user.avatar = data.data.url + "?v=" + Date.now();
              }
            });
          } else {
            isLoading = false;
            Toast(data.error || 'Failed to upload avatar', 'error');
          }
        })
        .catch((error) => {
          isLoading = false;
          Toast('Failed to upload avatar', 'error');
        });
    }
  }
 
  function changeProfile() {
    router.post('/change-profile', {
      name: formName,
      email: formEmail,
      phone: formPhone,
      avatar: user.avatar
    }, {
      onStart: () => isLoading = true,
      onFinish: () => isLoading = false
    });
  }

  function changePassword() {
    if (new_password !== confirm_password) {
      Toast('Password tidak cocok', 'error');
      return;
    }

    if (!current_password || !new_password || !confirm_password) {
      Toast('Harap isi semua field', 'error');
      return;
    }

    router.post('/auth/change-password', {
      current_password,
      new_password,
      confirm_password,
    }, {
      onStart: () => isLoading = true,
      onFinish: () => isLoading = false
    });
  }
</script>

<Header group="profile" />

{#if flash?.error || flash?.success}
  <div class="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
    {#if flash?.error}
      <div class="bg-red-500 text-white rounded-lg shadow-lg p-4 flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-sm font-medium">{flash.error}</p>
      </div>
    {/if}
    {#if flash?.success}
      <div class="bg-green-500 text-white rounded-lg shadow-lg p-4 flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <p class="text-sm font-medium">{flash.success}</p>
      </div>
    {/if}
  </div>
{/if}

<div class="max-w-4xl mx-auto p-4">

  <div class="max-w-3xl mx-auto mb-8">
    <div
      class="bg-white mt-24 dark:bg-slate-900 rounded-lg shadow-sm overflow-hidden"
    >
      <div class="p-6">
        <div class="flex items-center space-x-4">
          <div class="relative group">
            <div
              class="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900 overflow-hidden"
            >
              {#if previewUrl}
                <img
                  src={previewUrl}
                  alt="Profile"
                  class="w-full h-full object-cover"
                />
              {:else}
                <div class="w-full h-full flex items-center justify-center">
                  <span
                    class="text-2xl font-bold text-primary-600 dark:text-primary-400"
                  >
                    {user.name?.charAt(0)?.toUpperCase() || ''}
                  </span>
                </div>
              {/if}
            </div>
            <label
              class="absolute bottom-0 right-0 bg-primary-500 text-white p-1.5 rounded-full cursor-pointer hover:bg-primary-600 transition-colors"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
              <input
                type="file"
                accept="image/*"
                onchange={handleAvatarChange}
                class="hidden"
              />
            </label>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">
              {user?.name || ''}
            </h1>
            <p class="text-slate-500 dark:text-slate-400">{user?.email || ''}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="max-w-3xl mx-auto space-y-6">
    <div class="bg-white dark:bg-slate-900 rounded-lg shadow-sm">
      <div class="p-6">
        <h2 class="text-lg font-medium text-slate-900 dark:text-white mb-6">
          Personal Information
        </h2>
        <form onsubmit={(e) => { e.preventDefault(); changeProfile(); }} class="space-y-6">
          <div class="grid grid-cols-1 gap-6">
            <div class="space-y-1">
              <label
                for="name"
                class="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >Name</label
              >
              <input
                bind:value={formName}
                type="text"
                id="name"
                class="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:ring-slate-600 dark:focus:border-slate-600 dark:text-white focus:outline-none transition duration-200 ease-in-out"
                placeholder="Your full name"
              />
            </div>

            <div class="space-y-1">
              <label
                for="email"
                class="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >Email</label
              >
              <input
                bind:value={formEmail}
                type="email"
                id="email"
                class="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:ring-slate-600 dark:focus:border-slate-600 dark:text-white focus:outline-none transition duration-200 ease-in-out"
                placeholder="you@example.com"
              />
            </div>

            

            <div class="space-y-1">
              <label
                for="phone"
                class="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >Phone</label
              >
              <input
                bind:value={formPhone}
                type="text"
                id="phone"
                class="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:ring-slate-600 dark:focus:border-slate-600 dark:text-white focus:outline-none transition duration-200 ease-in-out"
                placeholder="Your phone number"
              />
            </div>
          </div>

          <div class="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              class="inline-flex items-center px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-medium shadow-sm hover:shadow-md transition duration-200 ease-in-out dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {#if isLoading}
                <svg
                  class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              {:else}
                Save Changes
              {/if}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-900 rounded-lg shadow-sm">
      <div class="p-6">
        <h2 class="text-lg font-medium text-slate-900 dark:text-white mb-6">
          Change Password
        </h2>
        <form onsubmit={changePassword} class="space-y-6">
          <div class="grid grid-cols-1 gap-6">
            <div class="space-y-1">
              <label
                for="current_password"
                class="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >Current Password</label
              >
              <input
                bind:value={current_password}
                type="password"
                id="current_password"
                class="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:ring-slate-600 dark:focus:border-slate-600 dark:text-white focus:outline-none transition duration-200 ease-in-out"
              />
            </div>

            <div class="space-y-1">
              <label
                for="new_password"
                class="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >New Password</label
              >
              <input
                bind:value={new_password}
                type="password"
                id="new_password"
                class="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:ring-slate-600 dark:focus:border-slate-600 dark:text-white focus:outline-none transition duration-200 ease-in-out"
              />
            </div>

            <div class="space-y-1">
              <label
                for="confirm_password"
                class="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >Confirm New Password</label
              >
              <input
                bind:value={confirm_password}
                type="password"
                id="confirm_password"
                class="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:ring-slate-600 dark:focus:border-slate-600 dark:text-white focus:outline-none transition duration-200 ease-in-out"
              />
            </div>
          </div>

          <div class="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              class="inline-flex items-center px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-medium shadow-sm hover:shadow-md transition duration-200 ease-in-out dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {#if isLoading}
                <svg
                  class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Updating...
              {:else}
                Update Password
              {/if}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
