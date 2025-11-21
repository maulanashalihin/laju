<script>
    import { inertia, router } from "@inertiajs/svelte";
    import LajuIcon from "../../Components/LajuIcon.svelte";
    import axios from "axios";

    let form = {
        email: "",
        phone: "",
    };

    let success = false;
    export let error;

    function submitForm() {
        axios.post("/forgot-password", form).then((response) => {
            success = true;
            form.email = "";
            form.phone = "";
        });
    }
</script>

<section class="bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
    <div class="absolute top-0 -left-4 w-72 h-72 bg-brand-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob dark:mix-blend-normal dark:opacity-10"></div>
    <div class="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 dark:mix-blend-normal dark:opacity-10"></div>

    <div
        class="relative z-10 flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0"
    >
        <div
            class="flex items-center mb-6 text-2xl font-semibold text-slate-900 dark:text-white"
        >
            <LajuIcon></LajuIcon>
        </div>
        <div
            class="w-full bg-white rounded-lg shadow dark:bg-slate-900 dark:border dark:border-slate-800 md:mt-0 sm:max-w-md xl:p-0"
        >
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1
                    class="text-xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white md:text-2xl"
                >
                    Reset Password
                </h1>

                {#if error}
                    <div
                        class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-900 dark:text-red-400"
                        role="alert"
                    >
                        {error}
                    </div>
                {/if}

                {#if success}
                    <div
                        class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-green-900 dark:text-green-400"
                        role="alert"
                    >
                        Password reset link has been sent to your email or phone number.
                    </div>
                {/if}

                <form
                    class="space-y-4 md:space-y-6"
                    on:submit|preventDefault={submitForm}
                >
                    <div>
                        <label
                            for="email"
                            class="block mb-2 text-sm font-medium text-slate-900 dark:text-white"
                            >Email or Phone Number</label
                        >
                        <input
                            bind:value={form.email}
                            type="text"
                            name="email"
                            id="email"
                            class="bg-slate-50 border border-slate-300 text-slate-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-600 focus:outline-none block w-full py-2.5 px-3 dark:bg-slate-800 dark:border-slate-700 dark:placeholder-slate-400 dark:text-white"
                            placeholder="email@example.com or 08xxxxxxxxxx"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                        Send Password Reset Link
                    </button>

                    <p class="text-sm font-light text-slate-500 dark:text-slate-400">
                        Remember your password? <a
                            href="/login"
                            use:inertia
                            class="font-medium text-primary-600 hover:underline dark:text-primary-400"
                            >Login here</a
                        >
                    </p>
                </form>
            </div>
        </div>
    </div>
</section>
