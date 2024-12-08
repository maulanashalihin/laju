<script>
  import { inertia, page, router } from "@inertiajs/svelte";
  import { clickOutside } from "../Components/helper";
  import { onMount } from "svelte";
  import dayjs from "dayjs";
  import LajuIcon from "../Components/LajuIcon.svelte";
  let show = false;

  let mobile_menu = false;

  let user = $page.props.user;

  let showInstallPWAIcon = false;

  export let path = "whatsapp";

  let menus = [
    {
      path: "home",
      href: "/home",
      title: "Home",
      show: true,
    },
  ];

  let installPrompt = null;

  onMount(() => {
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      installPrompt = event;

      const showInstallDate = localStorage.getItem("showInstallPWAIcon");

      if (showInstallDate) {
        if (Date.now() > parseInt(showInstallDate)) {
          showInstallPWAIcon = true;
        }
      } else {
        showInstallPWAIcon = true;
      }
    });
  });

  async function Install() {
    if (!installPrompt) {
      return;
    }

    const result = await installPrompt.prompt();
    console.log(`Install prompt was: ${result.outcome}`);
    showInstallPWAIcon = false;
  }

  function Logout() {
    router.post("/logout");
  }
</script>

<!-- Page Container -->
<div
  id="page-container"
  class="flex flex-col mx-auto w-full min-h-screen bg-gray-100"
>
  <!-- Page Header -->
  <header
    id="page-header"
    class="flex flex-none items-center bg-white shadow-sm z-1"
  >
    <div class="container xl:max-w-7xl mx-auto px-4 lg:px-8">
      <div class="flex justify-between py-4">
        <!-- Left Section -->
        <div class="flex items-center space-x-2 lg:space-x-6">
          <!-- Logo -->
          <a
            use:inertia
            href="/home"
            class="group inline-flex items-center space-x-2 font-bold text-lg tracking-wide text-gray-700 hover:text-emerald-600 active:text-gray-700"
          >
            <!-- svelte-ignore a11y-missing-attribute -->
            <LajuIcon></LajuIcon>
          </a>
          <!-- END Logo -->

          <!-- Desktop Navigation -->
          <nav class="hidden lg:flex lg:items-center lg:space-x-2">
            {#each menus as menu}
              {#if menu.show}
                <a
                  use:inertia
                  href={menu.href}
                  class="text-sm font-medium flex items-center space-x-2 px-3 py-2 rounded {path ==
                  menu.path
                    ? 'border border-emerald-50 bg-emerald-50 text-emerald-500'
                    : 'text-gray-600 border border-transparent hover:text-emerald-500 hover:bg-emerald-50 hover:border-emerald-50 active:bg-emerald-100 active:border-emerald-100'}"
                >
                  <span>{menu.title}</span>
                </a>
              {/if}
            {/each}
          </nav>
          <!-- END Desktop Navigation -->
        </div>
        <!-- END Left Section -->

        <!-- Right Section -->
        <div class="flex items-center space-x-1 lg:space-x-2">
          <!-- Notifications -->

          <!-- END Notifications -->

          <!-- User Dropdown -->
          <div
            use:clickOutside
            on:click_outside={() => {
              show = false;
            }}
            class="relative inline-block"
          >
            <!-- Dropdown Toggle Button -->
            <button
              type="button"
              on:click={() => {
                show = true;
              }}
              class="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-5 text-sm rounded border-gray-300 bg-white text-gray-800 shadow-sm hover:text-gray-800 hover:bg-gray-100 hover:border-gray-300 hover:shadow focus:ring focus:ring-gray-500 focus:ring-opacity-25 active:bg-white active:border-white active:shadow-none"
              id="tk-dropdown-layouts-user"
              aria-haspopup="true"
              aria-expanded="true"
            >
              <span>{$page.props.user.name}</span>
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                class="opacity-50 hi-solid hi-chevron-down inline-block w-5 h-5"
                ><path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                /></svg
              >
            </button>
            <!-- END Dropdown Toggle Button -->

            <!-- Dropdown -->
            <!-- 
                Visibility
                  Closed        'hidden'
                  Opened        '' (no class)
  
                Show/Hide with transitions
                  enter         'transition ease-out duration-150'
                  enter-start   'transform opacity-0 scale-75'
                  enter-end     'transform opacity-100 scale-100'
                  leave         'transition ease-in duration-100'
                  leave-start   'transform opacity-100 scale-100'
                  leave-end     'transform opacity-0 scale-75'
              -->
            <div
              role="menu"
              aria-labelledby="tk-dropdown-layouts-user"
              class="{show ||
                'hidden'} absolute right-0 origin-top-right mt-2 w-48 shadow-xl rounded"
            >
              <div
                class="bg-white ring-1 ring-black ring-opacity-5 rounded divide-y divide-gray-100"
              >
                <div class="p-2 space-y-1">
                  <a
                    class="w-full text-left flex items-center space-x-2 rounded py-2 px-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:bg-gray-100 focus:text-gray-700"
                    use:inertia
                    href="/profile">Profile</a
                  >

                  <form on:submit|preventDefault={Logout}>
                    <button
                      type="submit"
                      role="menuitem"
                      class="w-full text-left flex items-center space-x-2 rounded py-2 px-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:bg-gray-100 focus:text-gray-700"
                    >
                      <span>Sign out</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <!-- END Dropdown -->
          </div>
          <!-- END User Dropdown -->

          <!-- Toggle Mobile Navigation -->
          <div class="lg:hidden">
            <button
              aria-label="Toggle Mobile Navigation"
              on:click={() => {
                mobile_menu = !mobile_menu;
              }}
              type="button"
              class="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-6 rounded border-gray-300 bg-white text-gray-800 shadow-sm hover:text-gray-800 hover:bg-gray-100 hover:border-gray-300 hover:shadow focus:ring focus:ring-gray-500 focus:ring-opacity-25 active:bg-white active:border-white active:shadow-none"
            >
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                class="hi-solid hi-menu inline-block w-5 h-5"
                ><path
                  fill-rule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                /></svg
              >
            </button>
          </div>
          <!-- END Toggle Mobile Navigation -->
        </div>
        <!-- END Right Section -->
      </div>

      <!-- Mobile Navigation -->
      <!-- 
          Visibility
            Closed        'hidden'
            Opened        '' (no class)
        -->
      <div
        use:clickOutside
        on:click_outside={() => {
          mobile_menu = false;
        }}
        class={mobile_menu || "hidden"}
      >
        <nav class="flex flex-col space-y-2 py-4 border-t">
          {#each menus.filter((item) => item.show) as menu}
            <a
              use:inertia
              href={menu.href}
              class="text-sm font-medium flex items-center space-x-2 px-3 py-2 rounded {menu.path ==
              path
                ? 'border border-emerald-50 bg-emerald-50 text-emerald-500'
                : 'text-gray-600 border border-transparent hover:text-emerald-500 hover:bg-emerald-50 hover:border-emerald-50 active:bg-emerald-100 active:border-emerald-100'} "
            >
              <span>{menu.title}</span>
            </a>
          {/each}
        </nav>
      </div>
      <!-- END Mobile Navigation -->
    </div>
  </header>
  <!-- END Page Header -->

  <!-- Page Content -->
  <main id="page-content" class="flex flex-auto flex-col max-w-full">
    <slot />
  </main>



  
  {#if showInstallPWAIcon}
    <div class="fixed inset-x-0 bottom-0">
      <div
        class="relative flex items-center justify-between gap-4 bg-emerald-500 px-4 py-3 text-white"
      >
        <div class=" flex items-center text-sm gap-3">
          <button
            on:click={() => {
              showInstallPWAIcon = false;
              localStorage.setItem(
                "showInstallPWAIcon",
                dayjs().add(1, "day").valueOf(),
              );
            }}
            aria-label="Close"
            class="shrink-0 rounded-lg bg-black/10 p-1 transition hover:bg-black/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
          <div class="inline-block">Install App</div>
        </div>
        <button
          on:click={Install}
          class="px-2 bg-white py-1 inline-block text-emerald-500 rounded-xl"
          >Install</button
        >
      </div>
    </div>
  {/if}
  <!-- END Page Content -->
</div>
<!-- END Page Container -->
