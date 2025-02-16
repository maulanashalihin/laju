<script>
  import axios from "axios";
  import Header from "../Components/Header.svelte";
  import { Toast } from "../Components/helper";
  export let user;

  let current_password;
  let new_password;
  let confirm_password;
  let isLoading = false;
  let avatarFile;
  let previewUrl = user.avatar || null;
 

 

  function handleAvatarChange(event) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      isLoading = true;
      axios
        .post("/assets/avatar", formData)
        .then((response) => {
          setTimeout(() => {
            isLoading = false;
            previewUrl = response.data + "?v=" + Date.now();
          }, 500);
          user.avatar = response.data + "?v=" + Date.now();
        })
        .catch((error) => {
          isLoading = false;
        });
    }
  }
 
  async function changeProfile() {
    isLoading = true;
    try {
      user.connection_details = connections;
      const response = await axios.post("/change-profile", user);
      Toast("Profile updated", "success");
    } catch (error) {
      if (error.response.data.code == "SQLITE_CONSTRAINT_UNIQUE") {
        Toast("username atau email sudah digunakan", "error");
      } else {
        Toast(error.response.data.code, "error");
      }
    }
    isLoading = false;
  }

  async function changePassword() {
    if (new_password != confirm_password) {
      Toast("Password not match", "error");
      return;
    }

    if (!current_password || !new_password || !confirm_password) {
      Toast("Please fill all fields", "error");
      return;
    }

    isLoading = true;
    try {
      const response = await axios.post("/auth/change-password", {
        current_password,
        new_password,
        confirm_password,
      });
      Toast(response.data.message);
      current_password = "";
      new_password = "";
      confirm_password = "";
    } catch (error) {
      Toast(error.response.data.message, "error");
    }
    isLoading = false;
  }
</script>

<Header group="profile" />

<div class="max-w-4xl mx-auto p-4">
  <div class="max-w-3xl mx-auto mb-8">
    <div
      class="bg-white mt-24 dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
    >
      <div class="p-6">
        <div class="flex items-center space-x-4">
          <div class="relative group">
            <div
              class="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900 overflow-hidden"
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
                    class="text-2xl font-bold text-emerald-600 dark:text-emerald-400"
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              {/if}
            </div>
            <label
              class="absolute bottom-0 right-0 bg-emerald-500 text-white p-1.5 rounded-full cursor-pointer hover:bg-emerald-600 transition-colors"
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
                on:change={handleAvatarChange}
                class="hidden"
              />
            </label>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {user.name}
            </h1>
            <p class="text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="max-w-3xl mx-auto space-y-6">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div class="p-6">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Personal Information
        </h2>
        <form on:submit|preventDefault={changeProfile} class="space-y-6">
          <div class="grid grid-cols-1 gap-6">
            <div class="space-y-1">
              <label
                for="name"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Name</label
              >
              <input
                bind:value={user.name}
                type="text"
                id="name"
                class="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-gray-600 focus:border-blue-500 dark:focus:outline-none dark:focus:border-gray-600 dark:text-white transition duration-200 ease-in-out"
                placeholder="Your full name"
              />
            </div>

            <div class="space-y-1">
              <label
                for="email"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Email</label
              >
              <input
                bind:value={user.email}
                type="email"
                id="email"
                class="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-gray-600 focus:border-blue-500 dark:focus:outline-none dark:focus:border-gray-600 dark:text-white transition duration-200 ease-in-out"
                placeholder="you@example.com"
              />
            </div>

            

            <div class="space-y-1">
              <label
                for="phone"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Phone</label
              >
              <input
                bind:value={user.phone}
                type="text"
                id="phone"
                class="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-gray-600 focus:border-blue-500 dark:focus:outline-none dark:focus:border-gray-600 dark:text-white transition duration-200 ease-in-out"
                placeholder="Your phone number"
              />
            </div>
          </div>

          <div class="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              class="inline-flex items-center px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-sm hover:shadow-md transition duration-200 ease-in-out dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
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

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div class="p-6">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Change Password
        </h2>
        <form on:submit|preventDefault={changePassword} class="space-y-6">
          <div class="grid grid-cols-1 gap-6">
            <div>
              <label
                for="current_password"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Current Password</label
              >
              <input
                bind:value={current_password}
                type="password"
                id="current_password"
                class="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-gray-600 focus:border-blue-500 dark:focus:outline-none dark:focus:border-gray-600 dark:text-white transition duration-200 ease-in-out"
              />
            </div>

            <div>
              <label
                for="new_password"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >New Password</label
              >
              <input
                bind:value={new_password}
                type="password"
                id="new_password"
                class="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-gray-600 focus:border-blue-500 dark:focus:outline-none dark:focus:border-gray-600 dark:text-white transition duration-200 ease-in-out"
              />
            </div>

            <div>
              <label
                for="confirm_password"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Confirm New Password</label
              >
              <input
                bind:value={confirm_password}
                type="password"
                id="confirm_password"
                class="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-gray-600 focus:border-blue-500 dark:focus:outline-none dark:focus:border-gray-600 dark:text-white transition duration-200 ease-in-out"
              />
            </div>
          </div>

          <div class="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              class="inline-flex items-center px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-sm hover:shadow-md transition duration-200 ease-in-out dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
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
