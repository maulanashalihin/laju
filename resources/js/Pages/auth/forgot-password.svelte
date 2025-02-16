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

<section class="bg-gray-50 dark:bg-gray-900">
    <div
        class="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0"
    >
        <div
            class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
            <LajuIcon></LajuIcon>
        </div>
        <div
            class="w-full bg-white rounded-lg shadow dark:bg-gray-800 dark:border dark:border-gray-700 md:mt-0 sm:max-w-md xl:p-0"
        >
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1
                    class="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl"
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
                        Link reset password telah dikirim ke email atau nomor
                        telepon Anda.
                    </div>
                {/if}

                <form
                    class="space-y-4 md:space-y-6"
                    on:submit|preventDefault={submitForm}
                >
                    <div>
                        <label
                            for="email"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >Email atau Nomor Telepon</label
                        >
                        <input
                            bind:value={form.email}
                            type="text"
                            name="email"
                            id="email"
                            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-emerald-600 focus:outline-none block w-full py-2.5 px-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder="email@example.com atau 08xxxxxxxxxx"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        class="w-full text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800"
                    >
                        Kirim Link Reset Password
                    </button>

                    <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                        Ingat password Anda? <a
                            href="/login"
                            use:inertia
                            class="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                            >Login disini</a
                        >
                    </p>
                </form>
            </div>
        </div>
    </div>
</section>
