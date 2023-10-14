<script>
    import { inertia,router } from '@inertiajs/svelte' 
    import Logo from '../Components/Logo.svelte';
  
    let form = {
      email: '',
      password: '',
      password_confirmation: '',
      terms: false,
    }
    export let error;
    function submitForm()
    {
      
      router.post("/login", {email:form.email,password:form.password})
    }
  </script>
  
  <section class="bg-gray-50  ">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
        <div  class="flex items-center mb-6 text-2xl font-semibold text-gray-900 ">
            <Logo/>
        </div>
        <div class="w-full bg-white rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0  ">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              
                {#if error}
                <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50  dark:text-red-400" role="alert">
                   {error}
                </div>
                {/if}
                <div class="px-6 sm:px-0 max-w-sm">
                    <a href="/google/redirect" class="text-white w-full  bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between dark:focus:ring-[#4285F4]/55 mr-2 mb-2"><svg class="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>Sign in with Google<div></div></a>
                </div>

                <div class="relative flex py-1 items-center">
                    <div class="flex-grow border-t border-gray-400"></div>
                    <span class="flex-shrink mx-4 text-gray-400">OR</span>
                    <div class="flex-grow border-t border-gray-400"></div>
                </div>


               
                <form class="space-y-4 md:space-y-6" on:submit|preventDefault={submitForm}>
                    <div>
                        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 ">No.HP / Email</label>
                        <input bind:value={form.email} required type="text" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-fuchsia-600 focus:border-fuchsia-600 block w-full p-2.5 " placeholder="name@company.com" >
                        <div class="text-gray-400">
                            <small>kamu bisa login menggunakan email atau no.hp</small>
                        </div>
                    </div>
                    <div>
                        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
                        <input bind:value={form.password} required type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-fuchsia-600 focus:border-fuchsia-600 block w-full p-2.5 " >
                    </div>  
                    <button type="submit" class="w-full text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:ring-4 focus:outline-none focus:ring-fuchsia-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-fuchsia-600 dark:hover:bg-fuchsia-700 dark:focus:ring-fuchsia-800">Login</button>
                    <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                        Belum punya akun?   <a href="/register" use:inertia class="font-medium text-fuchsia-600 hover:underline dark:text-fuchsia-500">Buat gratis disini</a>
                    </p>
                    
                </form>
            </div>
        </div>
    </div>
  </section>