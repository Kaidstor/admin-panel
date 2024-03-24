<script lang="ts">
  import { cn } from "$lib/utils";
  import { Viewer } from "@photo-sphere-viewer/core";
  import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
  import { createEventDispatcher, setContext } from "svelte";
  import { PanoramaController, type MarkerItem } from "./index.svelte";
  import PanoramaElement from "./PanoramaElement.svelte";

  const dispatch = createEventDispatcher();
  let viewer = $state<Viewer>();
  let container = $state<HTMLDivElement>();

  dispatch("panorama-ready", {
    value: () => {
      return viewer;
    },
  });

  const { markers, ...props } = $props<{
    class: string;
    children: unknown;
    markers?: MarkerItem[];
  }>();

  const panorama = new PanoramaController(() => viewer!, markers);

  $effect(() => {
    viewer = new Viewer({
      navbar: false,
      container: container!,
      panorama: "/panorama_1.jpg",
      plugins: [[MarkersPlugin, { markers: [] }]],
    });
  });

  setContext("panorama", panorama);
  export { className as class };
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

<div
  bind:this={container}
  class={cn(
    "w-full aspect-video rounded-lg overflow-hidden relative",
    props.class
  )}
>
  {#if viewer}
    <slot />
    {#each panorama.markers as marker (marker.id)}
      <PanoramaElement {...marker} />
    {/each}
  {/if}
</div>

