<script>
    import { inertia,router } from '@inertiajs/svelte' 
      import { password_generator, validatePhone } from '../Components/helper';
      import Logo from '../Components/Logo.svelte';
  
    let form = {
      email: '',
      password: '',
      name : '',
      phone : '',
      password_confirmation: '',
      createdAt : new Date().toISOString(), updatedAt  : new Date().toISOString(),
      terms: false,
    }
  
    export let error;
    
    function submitForm()
    {
      if(form.password != form.password_confirmation)
      {
        alert("Password and confirm password must be same")
        return false;
      }
      if(form.terms == false)
      {
        alert("Please accept terms and conditions")
        return false;
      }
      form.phone = validatePhone(form.phone.toString())
      router.post("/register", form)
    }
  
    function generatePassword()
    { 
      const retVal = password_generator(10); 
      form.password = retVal
      form.password_confirmation = retVal
    }
  
    
  
  </script>
  
  <section class="bg-gray-50  ">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
        <div  class="flex items-center mb-6 text-2xl font-semibold text-gray-900  ">
            <Logo/>
        </div>
        <div class="w-full bg-white rounded-lg shadow   md:mt-0 sm:max-w-md xl:p-0  ">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl  ">
                    Create and account
                </h1>
                
                {#if error}
                <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50  " role="alert">
                   {error}
                </div>
                {/if}
                <form class="space-y-4 md:space-y-6" on:submit|preventDefault={submitForm}>
                    <div>
                      <label for="email" class="block mb-2 text-sm font-medium text-gray-900  ">Nama</label>
                      <input bind:value={form.name} required type="text" name="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-fuchsia-600 focus:border-fuchsia-600 block w-full p-2.5 " placeholder="Abdullah" >
                  </div>
                  
                   
                  <div>
                    <label for="email" class="block mb-2 text-sm font-medium text-gray-900  ">Email</label>
                    <input bind:value={form.email} required type="text" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-fuchsia-600 focus:border-fuchsia-600 block w-full p-2.5 " placeholder="name@company.com" >
                </div>
                <div>
                  <label for="phone" class="block mb-2 text-sm font-medium text-gray-900  ">No.Whatsapp</label>
                  <input bind:value={form.phone} required type="number" name="phone" id="phone" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-fuchsia-600 focus:border-fuchsia-600 block w-full p-2.5 " placeholder="0813xxxxx" >
              </div>
                    <div>
                        <label for="password" class="block mb-2 text-sm font-medium text-gray-900  ">Password</label>
                        <input bind:value={form.password} required type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-fuchsia-600 focus:border-fuchsia-600 block w-full p-2.5 " >
                        <button type="button" on:click="{generatePassword}" class="text-xs text-gray-500">Generate Password</button>
                      </div>
                    <div>
                        <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900  ">Confirm password</label>
                        <input bind:value={form.password_confirmation} type="password" name="confirm-password" id="confirm-password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-fuchsia-600 focus:border-fuchsia-600 block w-full p-2.5 " >
                    </div>
                    <div class="flex items-start">
                        <div class="flex items-center h-5">
                          <input id="terms" aria-describedby="terms" bind:checked={form.terms} type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-fuchsia-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-fuchsia-600 dark:ring-offset-gray-800" required="">
                        </div>
                        <div class="ml-3 text-sm">
                          <label for="terms" class="font-light text-gray-500  ">I accept the <a class="font-medium text-fuchsia-600 hover:underline  " href="/">Terms and Conditions</a></label>
                        </div>
                    </div>
                    <button type="submit" class="w-full text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:ring-4 focus:outline-none focus:ring-fuchsia-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-fuchsia-600 dark:hover:bg-fuchsia-700 dark:focus:ring-fuchsia-800">Create an account</button>
                    <p class="text-sm font-light text-gray-500  ">
                        Already have an account? <a href="/login" use:inertia class="font-medium text-fuchsia-600 hover:underline  ">Login here</a>
                    </p>
                </form>
            </div>
        </div>
    </div>
  </section>