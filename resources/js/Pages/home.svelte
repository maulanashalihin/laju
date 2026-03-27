<script>
    import Header from "../Components/Header.svelte";
    import { page, inertia } from "@inertiajs/svelte";
    import { fly } from "svelte/transition";

    let user = page.props.user;
</script>

<Header group="home" />

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
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">Dashboard</h1>
            <p class="text-slate-600 dark:text-slate-400">Welcome back, {user?.name || "Guest"}</p>
        </div>
    </div>

    <!-- Content Area -->
    <div class="relative max-w-5xl mx-auto px-6 py-12">
        <!-- Welcome Card -->
        <div
            class="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 mb-8"
            in:fly={{ y: 20, duration: 600 }}
        >
            <div class="flex items-center gap-4">
                <div
                    class="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-orange-500 flex items-center justify-center shadow-2xl shadow-brand-500/20"
                >
                    <svg
                        class="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                    </svg>
                </div>
                <div>
                    <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                        Welcome to Laju
                    </h2>
                    <p class="text-slate-600 dark:text-slate-400">
                        The AI-Native TypeScript framework built for speed
                    </p>
                </div>
            </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid md:grid-cols-3 gap-6 mb-8">
            <!-- Stat Card 1 -->
            <div
                class="bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6"
                in:fly={{ y: 20, duration: 600, delay: 100 }}
            >
                <div class="flex items-center gap-3 mb-4">
                    <div
                        class="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center"
                    >
                        <svg
                            class="w-5 h-5 text-brand-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                            />
                        </svg>
                    </div>
                    <span class="text-sm font-medium text-slate-600 dark:text-slate-400"
                        >Performance</span
                    >
                </div>
                <div class="text-3xl font-bold text-slate-900 dark:text-white mb-1">258,611</div>
                <div class="text-sm text-green-600 dark:text-green-400">
                    +11x faster than Express
                </div>
            </div>

            <!-- Stat Card 2 -->
            <div
                class="bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6"
                in:fly={{ y: 20, duration: 600, delay: 200 }}
            >
                <div class="flex items-center gap-3 mb-4">
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
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <span class="text-sm font-medium text-slate-600 dark:text-slate-400"
                        >Avg Latency</span
                    >
                </div>
                <div class="text-3xl font-bold text-slate-900 dark:text-white mb-1">1.52ms</div>
                <div class="text-sm text-green-600 dark:text-green-400">
                    -3.6x better response time
                </div>
            </div>

            <!-- Stat Card 3 -->
            <div
                class="bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6"
                in:fly={{ y: 20, duration: 600, delay: 300 }}
            >
                <div class="flex items-center gap-3 mb-4">
                    <div
                        class="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center"
                    >
                        <svg
                            class="w-5 h-5 text-cyan-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                        </svg>
                    </div>
                    <span class="text-sm font-medium text-slate-600 dark:text-slate-400"
                        >Uptime</span
                    >
                </div>
                <div class="text-3xl font-bold text-slate-900 dark:text-white mb-1">99.99%</div>
                <div class="text-sm text-slate-600 dark:text-slate-400">Last 30 days</div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div
            class="bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6"
            in:fly={{ y: 20, duration: 600, delay: 400 }}
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
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                    </svg>
                </div>
                <div>
                    <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
                        Quick Start
                    </h3>
                    <p class="text-sm text-slate-600 dark:text-slate-500">
                        Get started with Laju framework
                    </p>
                </div>
            </div>

            <div class="grid sm:grid-cols-2 gap-4">
                <a
                    href="https://github.com/maulanashalihin/laju/tree/main/docs"
                    target="_blank"
                    class="flex items-center gap-3 p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-brand-500/30 transition-all group"
                >
                    <div
                        class="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center group-hover:bg-brand-500/20 transition-colors"
                    >
                        <svg
                            class="w-5 h-5 text-brand-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                        </svg>
                    </div>
                    <div>
                        <div class="text-sm font-semibold text-slate-900 dark:text-white">
                            Documentation
                        </div>
                        <div class="text-xs text-slate-600 dark:text-slate-500">Read the docs</div>
                    </div>
                </a>

                <a
                    href="/profile"
                    use:inertia
                    class="flex items-center gap-3 p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-brand-500/30 transition-all group"
                >
                    <div
                        class="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors"
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
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                    </div>
                    <div>
                        <div class="text-sm font-semibold text-slate-900 dark:text-white">
                            Profile Settings
                        </div>
                        <div class="text-xs text-slate-600 dark:text-slate-500">
                            Manage your account
                        </div>
                    </div>
                </a>
            </div>
        </div>
    </div>
</div>
