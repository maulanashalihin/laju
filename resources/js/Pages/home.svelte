<script>
  import { inertia } from "@inertiajs/svelte";
  import Layout from "../Layouts/main.svelte";
  import { onMount } from "svelte";

  export let users = [];
  export let total = 0;
  export let page = 1;
  export let search = "";
  export let filter = "all";

  let selectedUsers = new Set();
  let selectAll = false;

  $: if (selectAll) {
    selectedUsers = new Set(users.map(user => user.id));
  } else {
    selectedUsers = new Set();
  }

  function toggleUser(userId) {
    if (selectedUsers.has(userId)) {
      selectedUsers.delete(userId);
    } else {
      selectedUsers.add(userId);
    }
    selectedUsers = selectedUsers; // trigger reactivity
  }

  function handleSearch() {
    inertia.get("/home", { search, filter, page: 1 }, { preserveState: true });
  }

  function handleFilter(newFilter) {
    filter = newFilter;
    inertia.get("/home", { search, filter, page: 1 }, { preserveState: true });
  }

  function handlePage(newPage) {
    page = newPage;
    inertia.get("/home", { search, filter, page }, { preserveState: true });
  }

  async function deleteSelected() {
    if (confirm("Are you sure you want to delete the selected users?")) {
      inertia.delete("/users", { 
        data: { ids: Array.from(selectedUsers) },
        onSuccess: () => {
          selectedUsers = new Set();
          selectAll = false;
        }
      });
    }
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString();
  }
</script>

<Layout path="home">
  <div class="container xl:max-w-7xl mx-auto p-4 lg:p-8">
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
        <p class="mt-1 text-sm text-gray-500">
          Manage your system users and their access
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <a
          href="/register"
          use:inertia
          class="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          Add User
        </a>
      </div>
    </div>

    <!-- Filters -->
    <div class="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <!-- Search -->
      <div class="flex">
        <input
          type="text"
          bind:value={search}
          placeholder="Search users..."
          class="w-full rounded-l-lg border border-gray-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          on:keyup={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          class="rounded-r-lg border border-l-0 border-emerald-600 bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700"
          on:click={handleSearch}
        >
          Search
        </button>
      </div>

      <!-- Filter Buttons -->
      <div class="flex space-x-2">
        <button
          class="px-4 py-2 text-sm rounded-lg {filter === 'all' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
          on:click={() => handleFilter('all')}
        >
          All Users
        </button>
        <button
          class="px-4 py-2 text-sm rounded-lg {filter === 'verified' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
          on:click={() => handleFilter('verified')}
        >
          Verified
        </button>
        <button
          class="px-4 py-2 text-sm rounded-lg {filter === 'unverified' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
          on:click={() => handleFilter('unverified')}
        >
          Unverified
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3">
              <input
                type="checkbox"
                bind:checked={selectAll}
                class="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Joined
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          {#each users as user (user.id)}
            <tr class="hover:bg-gray-50">
              <td class="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedUsers.has(user.id)}
                  on:change={() => toggleUser(user.id)}
                  class="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center">
                  <div>
                    <div class="font-medium text-gray-900">{user.name}</div>
                    {#if user.phone}
                      <div class="text-sm text-gray-500">{user.phone}</div>
                    {/if}
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-gray-900">{user.email}</td>
              <td class="px-4 py-3">
                {#if user.is_verified}
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Verified
                  </span>
                {:else}
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Unverified
                  </span>
                {/if}
              </td>
              <td class="px-4 py-3 text-sm text-gray-900">
                {formatDate(user.created_at)}
              </td>
              <td class="px-4 py-3 text-sm text-gray-500">
                <button
                  class="text-emerald-600 hover:text-emerald-900"
                  on:click={() => inertia.visit(`/users/${user.id}/edit`)}
                >
                  Edit
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    {#if total > 0}
      <div class="mt-4 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, total)} of {total} users
        </div>
        <div class="flex space-x-2">
          <button
            class="px-4 py-2 text-sm rounded-lg {page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}"
            disabled={page === 1}
            on:click={() => handlePage(page - 1)}
          >
            Previous
          </button>
          <button
            class="px-4 py-2 text-sm rounded-lg {page * 10 >= total ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}"
            disabled={page * 10 >= total}
            on:click={() => handlePage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    {/if}

    <!-- Bulk Actions -->
    {#if selectedUsers.size > 0}
      <div class="fixed bottom-0 inset-x-0 pb-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="bg-emerald-600 rounded-lg shadow-lg px-6 py-4">
            <div class="flex items-center justify-between flex-wrap">
              <div class="flex-1 flex items-center">
                <span class="text-white">
                  {selectedUsers.size} user{selectedUsers.size === 1 ? '' : 's'} selected
                </span>
              </div>
              <div class="flex-shrink-0">
                <button
                  on:click={deleteSelected}
                  class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-emerald-600 bg-white hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-emerald-600 focus:ring-white"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</Layout>
