<script lang="ts">
  import { setContext } from "svelte";
  import * as Panorama from "$lib/components/panorama/index.svelte.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import type { IPanorama } from "$lib/services/PanoramaService";
  import { s_fetch } from "$lib/api/index.js";

  const { data } = $props();
  let panoramas = $state<IPanorama[]>(data.panoramas);

  setContext("place_types", data.placeTypes);

  function saveVenue() {
    s_fetch("?/save", {
      body: panoramas,
    });
  }
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/@photo-sphere-viewer/core/index.min.css"
  />
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/@photo-sphere-viewer/markers-plugin/index.min.css"
  />
</svelte:head>

<div>
  <h1 class="text-white">
    {data.venue.name}
  </h1>
  <p class="text-gray mt-2">г. Тюмень, ул. Республики, 26</p>
</div>

<div class="mt-10">
  <p class="text-3xl mt-10">Настройка заведения</p>
  <Panorama.Root {panoramas} class="mt-5">
    <Panorama.Constructor />

    {#if !panoramas.length}
      <Panorama.Uploader />
    {/if}
  </Panorama.Root>
</div>

<Button class="mt-4" onclick={saveVenue}>Сохранить</Button>
<a class="inline-flex items-center justify-center rounded-md whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 font-medium text-sm/[1.5rem] hover:shadow-[0px_2px_8px_4px] hover:shadow-primary/50 duration-300 transition bg-primary text-primary-foreground hover:bg-primary-hover h-10 px-4 py-2 mt-4" type="link" href="/venue/{data.venue.id}/client" target="_blank">Предпросмотр</a>
