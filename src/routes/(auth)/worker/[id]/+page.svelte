<script lang="ts">
   import Button from "$lib/components/ui/button/button.svelte";
   import { Image } from "radix-icons-svelte";
   import * as Form from "$lib/components/ui/form/";

   const { data } = $props();

   const { user } = data;
</script>

<svelte:head>
   <title>{user.name}</title>
</svelte:head>

<Form.Root form={data.updateWorkerForm} action="?/updateWorkerProfile" class="flex flex-row justify-between items-center">
   <div class="flex gap-5">
      {#if user.avatar}
         <img src={user.avatar} alt="avatar" />
      {:else}
         <Button class="h-64 w-64 rounded-full"><Image size={48} /></Button>
      {/if}
      <div>
         <p class="text-4xl font-medium">{user.name}</p>
         <!-- <div class="flex gap-4 items-center">
            <Form.Input name="name" class="py-1 px-4 h-8 bg-slate-100" value={user.name}/>
         </div> -->
         <p class="text-lg">{user.email}</p>
         <button class="text-lg text-red-700/75 hover:text-red-700 mt-2" onclick={() => alert('Пока что не удаляется')}>Удалить профиль</button>
      </div>
   </div>
</Form.Root>
