<script lang="ts">
  import { newPanorama } from "$lib/api/panorama";
  import { Image } from "radix-icons-svelte";
  import { getContext } from "svelte";
  import type { PanoramaController } from "./index.svelte";

  const panorama = getContext<PanoramaController>("panorama");
  let imageInput: HTMLInputElement;
</script>

<input
  bind:this={imageInput}
  type="file"
  hidden
  onchange={async (event) => {
    const uploadedPanorama = await newPanorama(event)
    uploadedPanorama && panorama!.panoramas.push(uploadedPanorama)
  }}
/>
<button
  class="absolute h-full w-full flex justify-center items-center bg-primary/50 rounded-lg hover:bg-primary/60 duration-500 z-30"
  onclick={() => imageInput?.click()}><Image size={48} /></button
>
