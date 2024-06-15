<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import Crown from "$lib/components/icons/Crown.svelte";
  import { Cross2, Plus } from "radix-icons-svelte";
  import FormAddVenue from "$lib/features/forms/form-add-venue.svelte";

  let formCreateVenue = $state<HTMLDialogElement>();
  const { data } = $props();
</script>

<svelte:head>
  <title>Список заведений</title>
</svelte:head>

<div class="flex justify-between">
  <h1>Список заведений</h1>

  <Button size="default" class="flex gap-3 items-center" onclick={() => formCreateVenue?.showModal()}>
    <Plus />
  </Button>
</div>

<div class="mt-10 grid grid-cols-3 max-lg:grid-cols-1 max-2xl:grid-cols-2 gap-10">
  {#each data.venues as item}
    <div
      class="shadow-[0px_2px_8px_4px] rounded-lg shadow-primary/10 px-8 py-6"
    >
      <div class="flex justify-between">
        <a class="font-bold text-xl" href={`/venue/${item.id}`}>{item.name}</a>
        <Button class="py-1 text-md" href={`/tariff`}>
          <Crown />
          <p class="font-sofia">+ PRO</p>
        </Button>
      </div>
      <div class="flex gap-4 space-between">
        <div class="flex flex-col mt-6 flex-1">
          <p class="text-lg">{item.meta.address}</p>
          <p class="text-stone-600">
            <span class="text-stone-600">13 дней</span> до отключения тарифа
          </p>
        </div>
        <div class="flex items-end">
          <span class="opacity-50">ID: {item.id}</span>
        </div>
      </div>
    </div>
  {:else}
    <!-- empty list -->
  {/each}
</div>


<dialog bind:this={formCreateVenue} class="px-12 py-8 rounded-lg bg-stone-100">

  <button
     onclick={() => formCreateVenue!.close()}
  class="absolute top-2 right-2 p-2 text-white hover:text-primary">
     <Cross2 size={24} color="currentColor" />
  </button>

  <p class="text-4xl text-stone-700 font-bold">Добавить заведение</p>
  
  <FormAddVenue
     class="mt-8"
     action="?/addVenue"
     callback={() => formCreateVenue!.close()}
     form={data.createVenueForm}
  />
</dialog>
