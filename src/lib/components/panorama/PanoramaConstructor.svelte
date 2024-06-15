<script lang="ts">
  import { getContext } from "svelte";
  import { Uploader, ElementSettings,  PanoramaController } from "./index.svelte";

  import type { place_types_values } from "$lib";
  import { Trash } from "radix-icons-svelte";
  import { s_fetch } from "$lib/api";
  import type { IPanorama } from "$lib/services/PanoramaService";

  const panorama = getContext<PanoramaController>("panorama");
  const place_types = getContext(
    "place_types"
  ) as (typeof place_types_values)[number][];
  const { viewer } = panorama;

  const marker = $derived(panorama.currentMarker);
  let dialogPanoramas = $state<HTMLDialogElement>();


  viewer.addEventListener("click", ({ data }) => {
    if (!data.rightclick) {
      if (panorama.currentMarker) {
        panorama.currentMarker = null;
      } else {
        const { yaw, pitch } = data;
        const id = +Math.random()

        panorama.current!.markers.push({
          yaw: yaw.toString(),
          pitch: pitch.toString(),
          place: {
            id,
            name: '',
            created_at: new Date(),
            sits: { min: 1, max: 1 },
            updated_at: new Date(),
            panorama_id: 1,
            venue_id: 1,
            type: place_types[0],
          },
          type: "place",
          panorama_id: panorama.current!.id,
          transition_panorama_id: null,
          place_id: id,
          id,
        });
      }
    }
  });

  viewer.container.addEventListener("mousemove", (e) => {
    if (!panorama.currentMarker || e.buttons !== 1 || panorama.moveEnd) {
      return;
    }

    const viewerRect = viewer.container!.getBoundingClientRect();
    const relativeX = e.clientX - viewerRect.left;
    const relativeY = e.clientY - viewerRect.top;

    const pos = { x: relativeX, y: relativeY };
    const vector = viewer.dataHelper.viewerCoordsToVector3(pos);

    const sphericalCoords = viewer.dataHelper.vector3ToSphericalCoords(vector);

    panorama.currentMarker.yaw = sphericalCoords.yaw.toString();
    panorama.currentMarker.pitch = sphericalCoords.pitch.toString();
  });

  // Функция для вызова клика по скрытому input
  function triggerFileInput() {
    dialogPanoramas!.showModal();
  }

  // Обработчик изменения файла
  function changePanorama(id: number) {
    panorama.currentMarker!.transition_panorama_id = id;
    dialogPanoramas!.close();
  }

  
  async function removePanorama(id: number) {
    const target = document.querySelector(
      `#panorama_block_${id}`
    ) as HTMLDivElement;
    target.style.opacity = "50%";

    const response = await s_fetch("?/removePanorama", {
      body: JSON.stringify({ id }),
    });

    if (response?.type == "success") {
      panorama.panoramas = panorama.panoramas.filter((panorama) => panorama.id !== id);
    } else {
      target.style.opacity = "100%";
    }
  }
</script>

{#if marker}
  <ElementSettings on:openPanoramasDialog={triggerFileInput} />
{/if}


<dialog class="mt-10 max-w-8xl px-10 py-5 rounded-lg bg-dark m-auto h-[calc(100dvh_-_5rem)]" bind:this={dialogPanoramas}>
  <p class="text-3xl text-white">Панорамы</p>
  <div class="grid grid-cols-3 gap-5 mt-5 auto-rows-fr">
    {#each panorama.panoramas as item (item.id)}
      {#if item.id != panorama.current?.id}
        <div
          class="bg-primary/50 rounded-lg overflow-hidden relative"
          id="panorama_block_{item.id}"
        >
          <button
            class="w-full h-full"
            onclick={() => changePanorama(item.id)}
          >
            <img
              src={item.image}
              alt="panorama_photo_{item.id}"
              class="h-full w-full"
            />
          </button>
          <button
            class="absolute top-2 right-2 rounded-full bg-primary/50 hover:bg-primary/75 p-2"
            onclick={() => removePanorama(item.id)}
            ><Trash class="text-black" size={20} color="currentColor" /></button
          >
        </div>
      {/if}
    {/each}

    <div class="bg-primary/50  hover:bg-primary/75 rounded-lg overflow-hidden relative">
      <Uploader on:uploaded={(event: CustomEvent) => {
        const newPanorama = event.detail?.data?.panorama as IPanorama | null;
        newPanorama && panorama.panoramas.push(newPanorama);
        dialogPanoramas!.close();
      }} />
    </div>
  </div>
</dialog>
