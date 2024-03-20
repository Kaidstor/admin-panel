<script lang="ts">
  import FormSelect from "$lib/components/ui/form/form-select.svelte";
  import { setContext } from "svelte";
  import type { PageData } from "./$types";
  import * as Panorama from "$lib/components/panorama";

  const { data } = $props<{ data: PageData }>();

  setContext("place_types", data.placeTypes);
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

  <Panorama.Root class="mt-4">
    <Panorama.Constructor />
  </Panorama.Root>
</div>
