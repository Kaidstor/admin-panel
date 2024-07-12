<script lang="ts">
  import { setContext } from "svelte";
  import type { PageData } from "./$types";
  import * as Panorama from "$lib/components/panorama/index.svelte";
  import type { IPanorama } from "$lib/services/PanoramaService";

  const { data }: { data: PageData } = $props();
  let panoramas = $state<IPanorama[]>(data.panoramas);

  setContext("place_types", data.placeTypes);
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
  <h1 class="text-white max-md:text-3xl">
    {data.venue.name}
  </h1>
  <p class="text-gray mt-2">{data.venue.meta.address}</p>
</div>

<div class="mt-10 max-md:mt-5">
  <Panorama.Root {panoramas} class="mt-5 max-md:mt-2 max-md:rounded-sm">
    <Panorama.ClientMenu />
  </Panorama.Root>
</div>
