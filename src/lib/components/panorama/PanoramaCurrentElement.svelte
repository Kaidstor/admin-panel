<script lang="ts">
   import { getContext } from "svelte";
   import { PanoramaController } from "./index.svelte";
   const panorama = getContext<PanoramaController>("panorama");
   const marker = $derived(panorama.currentMarker);

   const { children } : { children: () => any } = $props()
 </script>
 
 {#if marker}
   {@render children()}
 {/if}
