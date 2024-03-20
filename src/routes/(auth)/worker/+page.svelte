<script lang="ts">
   import Button from "$lib/components/ui/button/button.svelte";
   import Worker from "$lib/features/cards/Worker.svelte";
   import FormCreateUser from "$lib/features/forms/form-add-user.svelte";
    import { Cross2 } from "radix-icons-svelte";
   import type { PageData } from "./$types";

   let formCreateUser = $state<HTMLDialogElement>();
   const { data } = $props<{ data: PageData }>();

   const { workers, venues } = data;
</script>

<svelte:head><title>Сотрудники</title></svelte:head>

<div class="flex justify-between items-center">
   <h1>Сотрудники</h1>
   <Button onclick={() => formCreateUser?.showModal()}>+</Button>
</div>

<div class="grid grid-cols-4 gap-10 mt-10">
   {#each workers as worker}
      <Worker {worker} />
   {/each}
</div>

<dialog bind:this={formCreateUser} class="px-12 py-8 rounded-lg bg-dark">

   <button
      onclick={() => formCreateUser!.close()}
   class="absolute top-2 right-2 p-2 text-white hover:text-primary">
      <Cross2 size={24} color="currentColor" />
   </button>

   <p class="text-4xl text-white font-bold">Создать сотрудника</p>
   <FormCreateUser
      class="mt-8"
      action="?/createWorker"
      form={data.createWorkerForm}
      {venues}
   />
</dialog>
