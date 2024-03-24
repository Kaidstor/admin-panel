<script lang="ts">
  import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
  import { getContext } from "svelte";
  import { PanoramaController } from "./index.svelte";
  import FormSelect from "../ui/form/form-select.svelte";
  import Button from "../ui/button/button.svelte";

  import { cn } from "$lib/utils";
  import { inputVariants } from "$lib/components/ui/form/";

  const panorama = getContext<PanoramaController>("panorama");
  const place_types = getContext<string[]>("place_types");
  const { viewer } = panorama;

  const marker = $derived(panorama.currentMarker);
  let markerType = $state('');
  let markerFile = $state('');

  const markersPlugin = viewer.getPlugin<MarkersPlugin>(MarkersPlugin);

  viewer.addEventListener("click", ({ data }) => {
    console.log("ok")
    if (!data.rightclick) {
      if (panorama.currentMarker) {
        panorama.currentMarker = null;
      } else {
        const { yaw, pitch } = data;

        panorama.markers.push({
          yaw,
          pitch,
          id: Math.random().toString(36).substring(2, 15),
        });
      }
    }
  });

  $effect(() => {
    if (!marker) return;

    markerType = marker.data.type ?? 'place'
    markerFile = (marker.data.file && URL.createObjectURL(marker.data.file as Blob)) ?? ''
  })

  viewer.container.addEventListener("mousemove", (e) => {
    if (!panorama.currentMarker || e.buttons !== 1 || panorama.moveEnd) {
      // Если надо чтобы при движении закрывалось
      // if (e.buttons == 1){
      //   panorama.currentMarker = null;
      // }

      return;
    }

    const viewerRect = viewer.container!.getBoundingClientRect();
    const relativeX = e.clientX - viewerRect.left;
    const relativeY = e.clientY - viewerRect.top;

    const pos = { x: relativeX, y: relativeY };
    const vector = viewer.dataHelper.viewerCoordsToVector3(pos);

    const sphericalCoords = viewer.dataHelper.vector3ToSphericalCoords(vector);

    markersPlugin.updateMarker({
      ...panorama.currentMarker!.config,
      position: sphericalCoords,
    });
  });

  const onInput = (event: Event) => {
    (panorama.currentMarker!.definition as HTMLDivElement).innerText = (
      event.target as HTMLInputElement
    ).value;

    panorama.currentMarker!.data.value = (
      event.target as HTMLInputElement
    ).value;
  };

  const onSelect = (event: CustomEvent) => {
    panorama.currentMarker!.data.placeType = event.detail.value;
  };

  const onRemove = () => {
    panorama.markers = panorama.markers.filter(
      (marker) => marker.id !== panorama.currentMarker!.config.id
    );
    panorama.currentMarker = null;
  };

  const changeType = (type: "transition" | "place") => {
    if (!marker) return;

    switch (type) {
      case "transition":
        marker.definition.classList.remove("place");
        marker.definition.classList.add("transition");
        marker.data.type = "transition";
        marker.definition.style.fontSize = "0";
        break;
      case "place":
        marker.definition.classList.remove("transition");
        marker.definition.classList.add("place");
        marker.data.type = "place";
        marker.definition.style.removeProperty('font-size');
    }

    markerType = marker.data.type;

    markersPlugin.updateMarker({
      ...marker.config,
    });
  };

  let fileInput = $state<HTMLInputElement>();

  // Функция для вызова клика по скрытому input
  function triggerFileInput() {
    fileInput!.click();
  }

  // Обработчик изменения файла
  function handleChange(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const [file] = element.files!;

    if (!file) return;

    markerFile = URL.createObjectURL(file);

    (fileInput!.nextElementSibling as HTMLButtonElement).innerText =
      "Изменить файл";
    panorama.currentMarker!.data.file = file;
  }
</script>

{#if marker}
  <div
    class="absolute w-96 h-full bg-[#c0ff16a8] z-40 right-0 px-6 py-6 flex flex-col gap-4"
  >
    <p class="text-center">{marker.config.id}</p>

    <div class="inline-flex flex-col gap-2">
      <p class="text-xl text-black px-6 flex-1">Что это?</p>
      <div class="flex gap-4">
        <Button
          variant="dark"
          class={(markerType == "transition" ? "active" : "") + " flex-1"}
          onclick={() => changeType("transition")}>Переход</Button
        >
        <Button
          variant="dark"
          class={(markerType == "place" ? "active" : "") + " flex-1"}
          onclick={() => changeType("place")}>Место</Button
        >
      </div>
    </div>
    {#if !markerType || markerType == "place"}
      <div class="flex flex-col gap-2">
        <p class="text-xl text-black px-6">Название</p>
        <input
          type="text"
          oninput={onInput}
          value={marker.definition.innerText}
          name="name"
          placeholder="Стол 1"
          class={cn(inputVariants({ variant: "default", size: "default" }))}
        />
      </div>

      <div class="flex flex-col gap-2">
        <p class="text-xl text-black px-6">Тип места</p>
        <FormSelect
          name="type"
          items={[...place_types]}
          on:onSelect={onSelect}
        />
      </div>
    {:else}
      <div class="flex flex-col gap-2">
        <p class="text-xl text-black px-6">Загрузите панораму</p>
        <input
          bind:this={fileInput}
          type="file"
          oninput={handleChange}
          name="file"
          hidden
        />
        <!-- Стилизованная кнопка, которая будет имитировать input file -->
        <Button variant="green" onclick={triggerFileInput} class="truncate">
          Загрузить файл</Button
        >

        {#if markerFile}
          <img src={markerFile} class="rounded-lg mt-2" alt="preview" />
        {/if}
      </div>
    {/if}

    <Button variant="dark" type="button" onclick={onRemove}>Удалить</Button>
  </div>
{/if}

<style>
  :global(.active) {
    background-color: black;
  }
</style>
