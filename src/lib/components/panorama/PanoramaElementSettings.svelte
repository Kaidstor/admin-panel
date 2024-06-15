<script lang="ts">
  import { createEventDispatcher, getContext } from "svelte";
  import { PanoramaController } from "./index.svelte";
  import Button from "../ui/button/button.svelte";

  import { cn } from "$lib/utils";
  import { inputVariants } from "$lib/components/ui/form/";
  import type { place_types_values } from "$lib";
  import SelectDefault from "../select-default.svelte";

  const panorama = getContext<PanoramaController>("panorama");
  const marker = $derived(panorama.currentMarker!);

  const place_types = getContext(
    "place_types"
  ) as (typeof place_types_values)[number][];

  let markerFile = $derived(
    marker.transition_panorama_id && panorama.panoramas.find((p) => p.id == marker.transition_panorama_id)?.image
  );

  const dispatch = createEventDispatcher();

  const onInput = (event: Event) => {
    marker?.place && (marker.place.name = (event.target as HTMLInputElement).value);
  };

  const onRemove = () => {
    panorama.current?.markers.filter((m) => m.id!= panorama.currentMarker!.id);
    panorama.removeMarkerById(panorama.currentMarker!.id);
    panorama.currentMarker = null;
  };

  const changeType = (type: "transition" | "place") => {
    panorama.currentMarker && (panorama.currentMarker.type = type);
  };

  let markerType = $derived(marker.type)

  // Функция для вызова клика по скрытому input
  function triggerFileInput() {
    dispatch("openPanoramasDialog");
  }
</script>

<div
  class="absolute w-96 h-full bg-[#c0ff16a8] z-40 right-0 px-6 py-6 flex flex-col gap-4"
>
  <div class="inline-flex flex-col gap-2">
    <p class="text-xl text-black px-6 flex-1">Тип элемента</p>
    <div class="flex gap-4">
      <Button
        class={`flex-1 hover:text-stone-700 hover:bg-stone-300 ${markerType == "transition" && 'bg-black text-white'}`}
        onclick={() => changeType("transition")}>Переход</Button
      >
      <Button
        class={`flex-1 hover:text-stone-700 hover:bg-stone-300 ${markerType == "place" && 'bg-black text-white'}`}
        onclick={() => changeType("place")}>Место</Button
      >
    </div>
  </div>
  {#if !marker.type || marker.type == "place"}
    <div class="flex flex-col gap-2">
      <p class="text-xl text-black px-6">Название</p>
      <input
        type="text"
        oninput={onInput}
        value={marker?.place?.name}
        name="name"
        placeholder="Стол 1"
        class={cn(inputVariants({ variant: "default", size: "default" }))}
      />
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-xl text-black px-6">Тип места</p>
      <SelectDefault name="type" items={[...place_types]} value={marker.place?.type} placeholder="Выберите тип места"/>
    </div>
  {:else}
    <div class="flex flex-col gap-2">
      <p class="text-xl text-black px-6">Панорама</p>
      <Button onclick={triggerFileInput} class="truncate">
        {markerFile ? "Изменить файл" : "Выбрать файл"}</Button
      >

      {#if markerFile}
        <img src={markerFile} class="rounded-lg mt-2" alt="preview" />
      {/if}
    </div>
  {/if}

  <Button type="button" onclick={onRemove}>Удалить</Button>
</div>
