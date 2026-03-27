<script>
    import Header from "../Components/Header.svelte";
    import { Toast } from "../Components/helper";
    import { inertia, router } from "@inertiajs/svelte";
    import { fly } from "svelte/transition";
    import DarkModeToggle from "../Components/DarkModeToggle.svelte";

    let { flash, user } = $props();

    let current_password = $state("");
    let new_password = $state("");
    let confirm_password = $state("");
    let isLoading = $state(false);
    let previewUrl = $derived(user?.avatar || null);

    let formName = $state("");
    let formEmail = $state("");
    let formPhone = $state("");

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
                        router.post(
                            "/change-profile",
                            {
                                name: formName,
                                email: formEmail,
                                phone: formPhone,
                                avatar: data.data.url,
                            },
                            {
                                onFinish: () => {
                                    setTimeout(() => {
                                        isLoading = false;
                                        previewUrl =
                                            data.data.url + "?v=" + Date.now();
                                    }, 500);
                                    user.avatar =
                                        data.data.url + "?v=" + Date.now();
                                },
                            },
                        );
                    } else {
                        isLoading = false;
                        Toast(data.error || "Failed to upload avatar", "error");
                    }
                })
                .catch((error) => {
                    isLoading = false;
                    Toast("Failed to upload avatar", "error");
                });
        }
    }

    function changeProfile() {
        router.post(
            "/change-profile",
            {
                name: formName,
                email: formEmail,
                phone: formPhone,
                avatar: user.avatar,
            },
            {
                onStart: () => (isLoading = true),
                onFinish: () => (isLoading = false),
            },
        );
    }

    function changePassword() {
        if (new_password !== confirm_password) {
            Toast("Password tidak cocok", "error");
            return;
        }

        if (!current_password || !new_password || !confirm_password) {
            Toast("Harap isi semua field", "error");
            return;
        }

        router.post(
            "/auth/change-password",
            {
                current_password,
                new_password,
                confirm_password,
            },
            {
                onStart: () => (isLoading = true),
                onFinish: () => (isLoading = false),
            },
        );
    }
</script>

<Header group="profile" />

<!-- Flash Messages -->
{#if flash?.error || flash?.success}
    <div
        class="fixed top-20 left-1/2 lg:left-72 lg:translate-x-0 -translate-x-1/2 z-50 w-full max-w-md px-4"
    >
        {#if flash?.error}
            <div
                class="bg-red-500/10 border border-red-500/20 backdrop-blur-xl text-red-600 dark:text-red-400 rounded-2xl shadow-2xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2 duration-300"
            >
                <div
                    class="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0"
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
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
                <p class="text-sm font-medium">{flash.error}</p>
            </div>
        {/if}
        {#if flash?.success}
            <div
                class="bg-green-500/10 border border-green-500/20 backdrop-blur-xl text-green-600 dark:text-green-400 rounded-2xl shadow-2xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2 duration-300"
            >
                <div
                    class="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0"
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
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
                <p class="text-sm font-medium">{flash.success}</p>
            </div>
        {/if}
    </div>
{/if}

<!-- Main Content -->
<div class="relative min-h-screen bg-white dark:bg-slate-950">
    <!-- Desktop Sidebar Spacer -->
    <div
        class="hidden lg:block w-72 fixed inset-y-0 left-0 pointer-events-none"
    ></div>

    <!-- Background Effects -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <div
            class="absolute top-0 -left-4 w-96 h-96 bg-brand-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"
        ></div>
        <div
            class="absolute top-0 -right-4 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"
        ></div>
    </div>

    <!-- Page Header -->
    <div
        class="relative pt-8 pb-12 px-6 border-b border-slate-200 dark:border-slate-800/50 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl"
    >
        <div class="max-w-5xl mx-auto">
            <div
                class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4"
            >
                <a
                    href="/home"
                    use:inertia
                    class="hover:text-brand-400 transition-colors">Dashboard</a
                >
                <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                    /></svg
                >
                <span class="text-slate-700 dark:text-slate-300">Settings</span>
            </div>
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Account Settings
            </h1>
            <p class="text-slate-600 dark:text-slate-400">
                Manage your profile and security preferences
            </p>
        </div>
    </div>

    <!-- Content Area -->
    <div class="relative max-w-5xl mx-auto px-6 py-12">
        <!-- Profile Overview Card -->
        <div
            class="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 mb-8"
            in:fly={{ y: 20, duration: 600 }}
        >
            <div
                class="flex flex-col sm:flex-row items-center sm:items-start gap-6"
            >
                <!-- Avatar -->
                <div class="relative group">
                    <div
                        class="w-28 h-28 rounded-2xl bg-gradient-to-br from-brand-500 to-orange-500 p-1 shadow-2xl shadow-brand-500/20"
                    >
                        <div
                            class="w-full h-full rounded-xl bg-white dark:bg-slate-900 overflow-hidden"
                        >
                            {#if previewUrl}
                                <img
                                    src={previewUrl}
                                    alt="Profile"
                                    class="w-full h-full object-cover"
                                />
                            {:else}
                                <div
                                    class="w-full h-full flex items-center justify-center"
                                >
                                    <span
                                        class="text-4xl font-bold dark:text-white text-brand-500"
                                        >{user.name?.charAt(0)?.toUpperCase() ||
                                            ""}</span
                                    >
                                </div>
                            {/if}
                        </div>
                    </div>
                    <label
                        class="absolute bottom-0 right-0 w-10 h-10 bg-brand-500 hover:bg-brand-600 text-white rounded-xl flex items-center justify-center cursor-pointer transition-all shadow-lg shadow-brand-500/30 group-hover:scale-110"
                    >
                        <svg
                            class="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                            />
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                        <input
                            type="file"
                            accept="image/*"
                            onchange={handleAvatarChange}
                            class="hidden"
                        />
                    </label>
                </div>

                <!-- User Info -->
                <div class="flex-1 text-center sm:text-left">
                    <h2
                        class="text-2xl font-bold text-slate-900 dark:text-white mb-1"
                    >
                        {user?.name || ""}
                    </h2>
                    <p class="text-slate-600 dark:text-slate-400 mb-4">
                        {user?.email || ""}
                    </p>
                    <div
                        class="flex flex-wrap justify-center sm:justify-start gap-2"
                    >
                        <span
                            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-brand-500/10 text-brand-400 border border-brand-500/20"
                        >
                            <div
                                class="w-1.5 h-1.5 rounded-full bg-brand-500"
                            ></div>
                            Active Member
                        </span>
                        <span
                            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700"
                        >
                            <svg
                                class="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                ><path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                /></svg
                            >
                            Verified
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Appearance Settings -->
        <div
            class="bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 mb-8"
            in:fly={{ y: 20, duration: 600, delay: 50 }}
        >
            <div class="flex items-center gap-3 mb-6">
                <div
                    class="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center"
                >
                    <svg
                        class="w-5 h-5 text-purple-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 3v2.25m6.364.379l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59M15.75 18.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                        />
                    </svg>
                </div>
                <div>
                    <h3
                        class="text-lg font-semibold text-slate-900 dark:text-white"
                    >
                        Appearance
                    </h3>
                    <p class="text-sm text-slate-600 dark:text-slate-500">
                        Customize how Laju looks on your device
                    </p>
                </div>
            </div>

            <div class="flex items-center justify-between">
                <div>
                    <p
                        class="text-sm font-medium text-slate-900 dark:text-white"
                    >
                        Dark Mode
                    </p>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Switch between light and dark themes
                    </p>
                </div>
                <div class="scale-110 origin-left">
                    <DarkModeToggle />
                </div>
            </div>
        </div>

        <!-- Settings Grid -->
        <div class="grid md:grid-cols-2 gap-6">
            <!-- Personal Information -->
            <div
                class="bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6"
                in:fly={{ y: 20, duration: 600, delay: 100 }}
            >
                <div class="flex items-center gap-3 mb-6">
                    <div
                        class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"
                    >
                        <svg
                            class="w-5 h-5 text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                    </div>
                    <div>
                        <h3
                            class="text-lg font-semibold text-slate-900 dark:text-white"
                        >
                            Personal Information
                        </h3>
                        <p class="text-sm text-slate-600 dark:text-slate-500">
                            Update your personal details
                        </p>
                    </div>
                </div>

                <form
                    onsubmit={(e) => {
                        e.preventDefault();
                        changeProfile();
                    }}
                    class="space-y-5"
                >
                    <div>
                        <label
                            for="name"
                            class="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2"
                            >Full Name</label
                        >
                        <input
                            bind:value={formName}
                            type="text"
                            id="name"
                            class="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-900 dark:text-white placeholder-slate-500 transition-all outline-none"
                            placeholder="Your full name"
                        />
                    </div>

                    <div>
                        <label
                            for="email"
                            class="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2"
                            >Email Address</label
                        >
                        <input
                            bind:value={formEmail}
                            type="email"
                            id="email"
                            class="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-900 dark:text-white placeholder-slate-500 transition-all outline-none"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label
                            for="phone"
                            class="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2"
                            >Phone Number</label
                        >
                        <input
                            bind:value={formPhone}
                            type="text"
                            id="phone"
                            class="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-900 dark:text-white placeholder-slate-500 transition-all outline-none"
                            placeholder="+62 xxx xxxx xxxx"
                        />
                    </div>

                    <div class="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            class="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-orange-600 hover:from-brand-500 hover:to-orange-500 text-white font-semibold transition-all shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {#if isLoading}
                                <svg
                                    class="animate-spin h-5 w-5"
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
                                <svg
                                    class="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    ><path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M5 13l4 4L19 7"
                                    /></svg
                                >
                                Save Changes
                            {/if}
                        </button>
                    </div>
                </form>
            </div>

            <!-- Change Password -->
            <div
                class="bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6"
                in:fly={{ y: 20, duration: 600, delay: 200 }}
            >
                <div class="flex items-center gap-3 mb-6">
                    <div
                        class="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center"
                    >
                        <svg
                            class="w-5 h-5 text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                    </div>
                    <div>
                        <h3
                            class="text-lg font-semibold text-slate-900 dark:text-white"
                        >
                            Security
                        </h3>
                        <p class="text-sm text-slate-600 dark:text-slate-500">
                            Update your password
                        </p>
                    </div>
                </div>

                <form onsubmit={changePassword} class="space-y-5">
                    <div>
                        <label
                            for="current_password"
                            class="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2"
                            >Current Password</label
                        >
                        <input
                            bind:value={current_password}
                            type="password"
                            id="current_password"
                            class="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-900 dark:text-white placeholder-slate-500 transition-all outline-none"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label
                            for="new_password"
                            class="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2"
                            >New Password</label
                        >
                        <input
                            bind:value={new_password}
                            type="password"
                            id="new_password"
                            class="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-900 dark:text-white placeholder-slate-500 transition-all outline-none"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label
                            for="confirm_password"
                            class="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2"
                            >Confirm New Password</label
                        >
                        <input
                            bind:value={confirm_password}
                            type="password"
                            id="confirm_password"
                            class="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-900 dark:text-white placeholder-slate-500 transition-all outline-none"
                            placeholder="••••••••"
                        />
                    </div>

                    <div class="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            class="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-semibold transition-all shadow-lg shadow-red-500/25 hover:shadow-red-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {#if isLoading}
                                <svg
                                    class="animate-spin h-5 w-5"
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
                                <svg
                                    class="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    ><path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    /></svg
                                >
                                Update Password
                            {/if}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
