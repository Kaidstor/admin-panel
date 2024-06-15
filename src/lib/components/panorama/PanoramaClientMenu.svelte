<script lang="ts">
  import { getContext } from "svelte";
  import { PanoramaController } from "./index.svelte";
  import Button from "../ui/button/button.svelte";
  import * as Select from "../ui/select";
  import { reservePlace } from "$lib/api/placeApi";
  import { datesToHoursString } from "$lib/utils";
  
  import * as Drawer from "$lib/components/ui/drawer";

  const panorama = getContext<PanoramaController>("panorama");
  const marker = $derived(panorama.currentMarker)!;

  let start_time = $state<Date>();

  const reserved_arr = marker?.place?.reservation_time && datesToHoursString(marker?.place?.reservation_time[Object.keys(marker?.place?.reservation_time!)[0]].map(d => new Date(d)))
  const time_arr = ["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00"]
  

  const free_arr = time_arr.filter(x =>!reserved_arr?.includes(x))
  
  console.log(reserved_arr, time_arr)
  console.log(free_arr)

  const reservation_time = free_arr.map(time => ({ value: time, label: time }));
</script>


<Drawer.Root open={!!marker && !marker?.transition_panorama_id} onClose={() => setTimeout(() => (panorama.currentMarker = null), 1000)}>
  <Drawer.Content>
    <div class="max-w-[500px] mx-auto flex flex-col items-center">

      <Drawer.Header>
        <Drawer.Title class="text-center text-2xl font-bold">Бронь: {marker?.place?.name}</Drawer.Title>
      </Drawer.Header>

      <Select.Root onSelectedChange={(v) => {
        const date = new Date();
        const [hours, minutes] = (v!.value as string).split(":");
        const time = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), +hours, +minutes));
    
        start_time = time;
      }}>
        <Select.Trigger class="w-[200px]">
          <Select.Value placeholder="Выберите время" />
        </Select.Trigger>
        <Select.Content>
          <Select.Group>
            <Select.Label>Доступное время</Select.Label>
            {#each reservation_time as time}
              <Select.Item value={time.value} label={time.label}
                >{time.label}</Select.Item
              >
            {/each}
          </Select.Group>
        </Select.Content>
        <Select.Input name="venueId" />
      </Select.Root>
    
      
      <Drawer.Footer>
        <Button class="w-[200px]" onclick={() => reservePlace(marker?.place?.id!, start_time!)}
          >Забронировать</Button
        >
        <Drawer.Close>Отмена</Drawer.Close>
      </Drawer.Footer>
      
    </div>
  </Drawer.Content>
</Drawer.Root>

<style>
  :global(.active) {
    background-color: black;
  }
</style>
