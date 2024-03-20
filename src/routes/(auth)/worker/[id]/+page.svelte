<script lang="ts">
   import Settings from "$lib/components/icons/Settings.svelte";
   import Button from "$lib/components/ui/button/button.svelte";
   import { Image } from "radix-icons-svelte";
   import type { PageData } from "./$types";
   import * as Form from "$lib/components/ui/form/";

   const { data } = $props<{ data: PageData }>();

   const { user } = data;
</script>

<svelte:head>
   <title>{user.name}</title>
</svelte:head>

<Form.Root form={data.updateWorkerForm} action="?/updateWorkerProfile" class="flex flex-row justify-between items-center">
   <div class="flex gap-4">
      {#if user.avatar}
         <img src={user.avatar} alt="avatar" />
      {:else}
         <Button class="h-16 w-16 rounded-full"><Image /></Button>
      {/if}
      <div class="gap-0">
         <div class="flex gap-4 items-center">
            <p class="text-2xl font-bold">Имя: </p>
            <Form.Input name="name" class="py-1 px-4 h-8" value={user.name}/>
         </div>
         <p class="text-lg">Почта: {user.email}</p>
      </div>
   </div>
   <Button type="submit">Сохранить</Button>
</Form.Root>

<div class="mt-10 flex flex-col gap-4">
   <p class="text-xl font-bold">История действий</p>
   {#each [1, 2, 3, 4] as item}
      <div
         class="rounded-lg shadow-[0px_2px_4px_4px] shadow-primary/5 px-4 py-2 hover:bg-gray/50"
      >
         Пользовательское действие
      </div>
   {:else}
      <!-- empty list -->
   {/each}
</div>
