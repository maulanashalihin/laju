<script>
    import axios from "axios";
    import Layout from "../Layouts/main.svelte";
    
    import { Toast } from "../Components/helper"; 
    export let user;

    let current_password;
    let new_password;
    let confirm_password;

    function changeProfile()
    {
        axios.post('/auth/change-profile',{
            name:user.name,
            email:user.email,
            phone:user.phone, 
        }).then(response=>{
            Toast(response.data.message);
        }).catch(error=>{
            Toast(error.response.data.message,"error");
        })
    }
   
    function changePassword()
    {
        if(new_password != confirm_password)
        {
            Toast("Password not match","error")
            return;
        }

        if(!current_password || !new_password || !confirm_password)
        {
            Toast("Please fill all fields","error")
            return;
        }   
        axios.post('/auth/change-password',{
            current_password:current_password,
            new_password:new_password,
            confirm_password:confirm_password
        }).then(response=>{
            Toast(response.data.message);
        }).catch(error=>{
            Toast(error.response.data.message,"error");
        })
    }
  </script>
  
  <Layout path="profile">
    <!-- Page Heading -->
    <div class="bg-gray-50">
      <div class="container xl:max-w-7xl mx-auto p-4 lg:p-8">
        <div
          class="text-center sm:text-left sm:flex sm:items-center sm:justify-between py-2 lg:py-0 space-y-2 sm:space-y-0"
        >
          <div class="grow">
            <h1 class="text-xl font-bold text-gray-700 mb-1">PROFILE</h1>
          </div>
          
        </div>
      </div>
    </div>
    <!-- END Page Heading -->
  
    <!-- Page Section -->
    <div class="container xl:max-w-7xl mx-auto p-4 lg:p-8">
        <div class="space-y-4 lg:space-y-8">
            <!-- Card: User Profile -->
            <div class="flex flex-col rounded shadow-sm bg-white overflow-hidden">
              <!-- Card Header: User Profile -->
              <div class="py-4 px-5 lg:px-6 w-full bg-gray-50">
                <h3 class="flex items-center space-x-2">
                  <svg class="hi-solid hi-user-circle inline-block w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd"/></svg>
                  <span>User Profile</span>
                </h3>
              </div>
              <!-- END Card Header: User Profile -->
          
              <!-- Card Body: User Profile -->
              <div class="p-5 lg:p-6 grow w-full md:flex md:space-x-5">
                <p class="md:flex-none md:w-1/3 text-gray-500 text-sm mb-5">
                  Your account’s vital info
                </p>
                <form on:submit|preventDefault={changeProfile} class="space-y-6 md:w-1/2">
                  
              
                  <div class="space-y-1">
                    <label for="name" class="font-medium">Name</label>
                    <input bind:value="{user.name}" class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5  placeholder-gray-400" type="text" id="name" placeholder="John Doe" />
                  </div>
                  <div class="space-y-1">
                    <label for="email" class="font-medium">Email</label>
                    <input bind:value="{user.email}" class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5  placeholder-gray-400" type="email" id="email" placeholder="john.doe@example.com" />
                  </div>
                  <div class="space-y-1">
                    <label for="phone" class="font-medium">Phone</label>
                    <input bind:value="{user.phone}" class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5  placeholder-gray-400" type="text" id="phone" placeholder="081355555555" />
                  </div>
               
                  <button type="submit" class="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-5 text-sm rounded border-emerald-500 bg-emerald-500 text-white hover:text-white hover:bg-emerald-600 hover:border-emerald-600 focus:ring focus:ring-emerald-500 focus:ring-opacity-50 active:bg-emerald-500 active:border-emerald-500">
                    Update Profile
                  </button>
                </form>
              </div>
              <!-- END Card Body: User Profile -->
            </div>
            <!-- END Card: User Profile -->
          
            <!-- Card: Change Password -->
            <div class="flex flex-col rounded shadow-sm bg-white overflow-hidden">
              <!-- Card Header: Change Password -->
              <div class="py-4 px-5 lg:px-6 w-full bg-gray-50">
                <h3 class="flex items-center space-x-2">
                  <svg class="hi-solid hi-lock-open inline-block w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z"/></svg>
                  <span>Change Password</span>
                </h3>
              </div>
              <!-- END Card Header: Change Password -->
          
              <!-- Card Body: Change Password -->
              <div class="p-5 lg:p-6 grow w-full md:flex md:space-x-5">
                <p class="md:flex-none md:w-1/3 text-gray-500 text-sm mb-5">
                  Changing your sign in password is an easy way to keep your account secure.
                </p>
                <form on:submit|preventDefault={changePassword} class="space-y-6 md:w-1/2">
                  <div class="space-y-1">
                    <label for="password" class="font-medium">Current Password</label>
                    <input required bind:value="{current_password}" class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5  placeholder-gray-400" type="password" id="password" />
                  </div>
                  <div class="space-y-1">
                    <label for="password-new" class="font-medium">New Password</label>
                    <input required bind:value="{new_password}" class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5  placeholder-gray-400" type="password" id="password-new" />
                  </div>
                  <div class="space-y-1">
                    <label for="password-new-confirm" class="font-medium">Confirm Password</label>
                    <input required bind:value="{confirm_password}" class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5  placeholder-gray-400" type="password" id="password-new-confirm" />
                  </div>
                  <button type="submit" class="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-5 text-sm rounded border-emerald-500 bg-emerald-500 text-white hover:text-white hover:bg-emerald-600 hover:border-emerald-600 focus:ring focus:ring-emerald-500 focus:ring-opacity-50 active:bg-emerald-500 active:border-emerald-500">
                    Update Password
                  </button>
                </form>
              </div>
              <!-- END Card Body: Change Password -->
            </div>
            <!-- END Card: Change Password -->
          
            <!-- Card: Billing Information -->
             
            <!-- END Card: Billing Information -->
          
            <!-- Card: Notifications -->
             
            <!-- END Card: Notifications -->
          </div>
    </div>
    <!-- END Page Section -->
  </Layout>
  