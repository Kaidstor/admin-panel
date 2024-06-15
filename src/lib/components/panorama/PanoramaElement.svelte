<script lang="ts">
  import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
  import { getContext } from "svelte";
  import type { PanoramaController } from "./index.svelte";
  import type { IMarkerWithPlace } from "$lib";

  const panorama = getContext<PanoramaController>("panorama");
  const { viewer } = panorama;

  let { marker }: { marker: IMarkerWithPlace } = $props();
  const { yaw, pitch } = $derived(marker);

  const markerId = marker.id.toString();
  let element = $state<HTMLDivElement>();

  const markersPlugin = viewer.getPlugin<MarkersPlugin>(MarkersPlugin);

  $effect(() => {
    const markerData = {
      id: markerId,
      position: { yaw, pitch },
      element,
      anchor: "center center",
      data: marker,
    };
    if (!panorama.currentMarkerElement) {
      try {
        markersPlugin.addMarker(markerData);
      } catch (e) {
        markersPlugin.updateMarker(markerData);
      }
    } else {
      markersPlugin.updateMarker(markerData);
    }
    return () => {
      console.log("removed");
    };
  });
</script>

<div
  bind:this={element}
  class:panorama-transition={marker?.type == "transition"}
  class:text-transparent={marker?.type == "transition"}
  class:place={marker?.type == "place"}
  data-id={markerId}
  class="rounded-lg text-black font-bold!flex justify-center items-center text-center draggable bg-[#c0ff16a8] text-base/[4rem] place marker"
>
  {marker.place?.name}
</div>
