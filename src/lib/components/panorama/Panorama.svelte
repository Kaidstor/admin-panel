<script lang="ts">
  import { cn } from "$lib/utils";
  import { Viewer } from "@photo-sphere-viewer/core";
  import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
  import { setContext } from "svelte";
  import { PanoramaController } from "./index.svelte";
  import type { IPanorama } from "$lib/services/PanoramaService";
  import PanoramaElement from "./PanoramaElement.svelte";

  let viewer = $state<Viewer>();
  let container = $state<HTMLDivElement>();

  const {
    children,
    panoramas,
    ...props
  }: {
    panoramas: IPanorama[];
    class: string;
    children: () => any;
  } = $props();

  const panoramaController = new PanoramaController(() => viewer!, panoramas);

  $effect(() => {
    if (!panoramaController.hasViewer) {
      const panorama =
        panoramaController.current?.image ||
        "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

      viewer = new Viewer({
        panorama,
        navbar: false,
        container: container!,
        plugins: [[MarkersPlugin, {}]],
      });

      container!.addEventListener(
        "mousedown",
        (e) => {
          const target = e.target as HTMLDivElement;
          if (target?.classList?.contains("marker")) {
            panoramaController.currentMarker = panoramaController.getMarkerById(
              +target.dataset.id!
            );
            panoramaController.moveEnd = false;

            e.stopPropagation();
            e.preventDefault();
          }
        },
        true
      );

      container!.addEventListener(
        "dblclick",
        (e) => {
          const target = e.target as HTMLDivElement;
          if (target?.classList?.contains("marker")) {
            const panorama_id =
              panoramaController.currentMarker!.transition_panorama_id;

            e.stopPropagation();
            e.preventDefault();

            if (panorama_id) {
              panoramaController.setCurrent(panorama_id);
              panoramaController.currentMarker = null;
            }
          }
        },
        true
      );

      container!.addEventListener(
        "touchstart",
        (e) => {
          const target = e.target as HTMLDivElement;
          if (target?.classList?.contains("marker")) {
            e.stopPropagation();
            e.preventDefault();

            const marker = panoramaController.getMarkerById(
              +target.dataset.id!
            );

            if (marker) {
              const { transition_panorama_id } = marker;

              if (transition_panorama_id) {
                panoramaController.setCurrent(transition_panorama_id);
                panoramaController.currentMarker = null;
              } else {
                panoramaController.currentMarker = marker;
              }
            }
          }
        },
        true
      );

      container!.addEventListener("mouseup", (e) => {
        panoramaController.moveEnd = true;
      });
    }
    console.log("panorama update");
  });

  setContext("panorama", panoramaController);
  export { className as class };
</script>

<div
  bind:this={container}
  class={cn(
    "w-full aspect-video rounded-lg overflow-hidden relative",
    props.class
  )}
>
  {#if viewer}
    {@render children()}
    {#if panoramaController.current}
      {#each panoramaController.current.markers as marker (marker.id)}
        <PanoramaElement {marker} />
      {/each}
    {/if}
  {/if}
</div>
