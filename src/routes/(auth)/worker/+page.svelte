<script lang="ts">
  import SelectDefault from "$lib/components/select-default.svelte";
   import Button from "$lib/components/ui/button/button.svelte";
   import Worker from "$lib/features/cards/Worker.svelte";
   import { createWorkerFormSchema } from "$lib/zod/shemas.js";
   import { Cross2 } from "radix-icons-svelte";
   import { superForm } from "sveltekit-superforms";
   import { zod } from "sveltekit-superforms/adapters";

   let createUserModal = $state<HTMLDialogElement>();
   const { data } = $props();

   const { form, errors, enhance } = superForm(data.createWorkerForm, {
      onSubmit: ({ validators }) => {
         validators(zod(createWorkerFormSchema));
      },
      onResult: (({result}) => {
         if (result.type == 'success') {
            createUserModal?.close();

            data.workers.push(result.data!.user);
         }
      })
   });
   const { workers, venues } = data;
</script>

<svelte:head><title>Хостесы</title></svelte:head>

<div class="flex justify-between items-center">
   <h1>Хостесы</h1>
   <Button onclick={() => createUserModal?.showModal()}>+</Button>
</div>

<div class="grid grid-cols-4 gap-10 mt-10">
   {#each workers as worker}
      <Worker {worker} />
   {/each}
</div>

<dialog bind:this={createUserModal} class="px-12 py-8 rounded-lg bg-stone-100">

   <button
      onclick={() => createUserModal!.close()}
   class="absolute top-2 right-2 p-2 text-stone-700 hover:text-stone-900">
      <Cross2 size={24} color="currentColor" />
   </button>

   <p class="text-4xl text-stone-700 font-bold">Создать сотрудника</p>
   
   
  

   <form 
      class="mt-5 flex flex-col gap-3"
      action="?/createWorker"
      method="POST"
      use:enhance
   >
      <div class="flex flex-col">
          <input
              name="email" type="email" placeholder="Почта" class="h-10 rounded-md bg-stone-200 px-3"
              bind:value={$form.email}
          />
  
          
          {#if $errors.email}
            <small class="text-destructive px-6">{$errors.email}</small>
          {/if}
      </div> 
      
      <div class="flex flex-col">
          <input
              name="name" type="text" placeholder="Имя" class="h-10 rounded-md bg-stone-200 px-3"
              bind:value={$form.name}
          />
  
          {#if $errors.name}
              <small class="text-destructive px-6">{$errors.name}</small>
          {/if}
      </div>
  
      {#if venues.length}
          <SelectDefault
              placeholder="Выбрать заведение"
              value={$form.venueId}
              name="venueId"
              items={venues}
          />
      {/if}
      
      {#if $errors.venueId}
         <small class="text-destructive px-6">{$errors.venueId}</small>
      {/if}

      <Button type="submit" class="bg-stone-300 hover:bg-stone-400">Создать</Button>
  </form>
  
  <div class="flex justify-center mt-2"><small class="text-gray">Пароль по умолчанию: password</small></div>

</dialog>
