<script lang="ts">
  import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
  import { getContext } from "svelte";
  import type { MarkerItem, PanoramaController } from "./index.svelte";

  let { yaw, pitch, id } = $props<MarkerItem>();
  let element = $state<HTMLDivElement>();

  $effect(() => {
    const panorama = getContext<PanoramaController>("panorama");
    const { viewer } = panorama;

    const markersPlugin = viewer.getPlugin<MarkersPlugin>(MarkersPlugin);

    markersPlugin.addMarker({
      id,
      position: { yaw, pitch },
      element,
      anchor: "center center",
      data: {
        type: 'place',
        placeType: 'Стол'
      },
    });

    const marker = markersPlugin.getMarker(id);

    element!.addEventListener("mousedown", (e) => {
      panorama.currentMarker = marker;
      panorama.moveEnd = false;

      e.stopPropagation();
      e.preventDefault();
    });

    element!.addEventListener("mouseup", (e) => {
      panorama.currentMarker = marker;
      panorama.moveEnd = true;
    });

    return () => {
      console.log(`removed ${id}`)
      markersPlugin.removeMarker(id);
    };
  });
</script>

<div
  bind:this={element}
  class="rounded-lg text-black font-bold!flex justify-center items-center text-center draggable bg-[#c0ff16a8] text-base/[4rem] place"
></div>
