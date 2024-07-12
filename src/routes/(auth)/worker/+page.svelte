<script lang="ts">
   import Button from "$lib/components/ui/button/button.svelte";
   import Worker from "$lib/features/cards/Worker.svelte";
   import FormAddWorker from "$lib/features/forms/form-add-worker.svelte";
   import { Cross2 } from "radix-icons-svelte";

   let dialogCreateUser = $state<HTMLDialogElement>();

   const closeDialog = () => dialogCreateUser?.close();

   const { data } = $props();
   const { workers, venues, addWorkerForm } = $derived(data);
</script>

<svelte:head><title>Хостесы</title></svelte:head>

<div class="flex justify-between items-center">
   <h1>Хостесы</h1>
   <Button onclick={() => dialogCreateUser?.showModal()}>+</Button>
</div>

<div class="grid grid-cols-4 gap-10 mt-10">
   {#each workers as worker}
      <Worker {worker} />
   {/each}
</div>

<dialog bind:this={dialogCreateUser} class="px-12 py-8 rounded-lg bg-stone-100">

   <button
      onclick={closeDialog}
   class="absolute top-2 right-2 p-2 text-stone-700 hover:text-stone-900">
      <Cross2 size={24} color="currentColor" />
   </button>

   <p class="text-4xl text-stone-700 font-bold">Создать сотрудника</p>
   
   
  
   <FormAddWorker {addWorkerForm} {venues} callback={closeDialog}/>
  
  <div class="flex justify-center mt-2"><small class="text-gray">Пароль по умолчанию: password</small></div>

</dialog>
