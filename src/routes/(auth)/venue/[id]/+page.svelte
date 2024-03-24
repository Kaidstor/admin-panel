<script lang="ts">
  import FormSelect from "$lib/components/ui/form/form-select.svelte";
  import { setContext } from "svelte";
  import type { PageData } from "./$types";
  import * as Panorama from "$lib/components/panorama/index.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import type { Viewer } from "@photo-sphere-viewer/core";
  import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";

  const panoramas = [] as (() => Viewer)[];

  const { data } = $props<{ data: PageData }>();
  setContext("place_types", data.placeTypes);

  const readyPanorama = (event: CustomEvent) => {
    panoramas.push(event.detail.value);
  };

  const preparePanoramas = () => {
    const viewer = panoramas[0]() as Viewer;
    const markersPlugin = viewer.getPlugin<MarkersPlugin>(MarkersPlugin);

    console.log(
      markersPlugin.getMarkers().map((marker) => {
        const { yaw, pitch } = marker.config.position as {
          yaw: number;
          pitch: number;
        };
        
        return {
          id: marker.config.id,
          yaw,
          pitch,
          type: marker.data.type,
          file: marker.data.file,
          data: marker.data.placeType,
        };
      })
    );
  };
</script>

<div>
  <h1 class="text-white">
    Заведение {data.venueId}
  </h1>
  <small class="text-gray">г. Тюмень, ул. Республики, 26</small>
</div>

<div class="mt-10">
  <p>Привязать хостес</p>
  <form action="" class="mt-2">
    <FormSelect
      name="venueId"
      defaultValue="Хостес не выбран"
      items={data.workers}
    />
  </form>

  <Panorama.Root class="mt-4" on:panorama-ready={readyPanorama}>
    <Panorama.Constructor />
  </Panorama.Root>
</div>

<Button onclick={preparePanoramas}>Сохранить</Button>
