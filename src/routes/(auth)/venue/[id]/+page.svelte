<script lang="ts">
  import CalendarIcon from "lucide-svelte/icons/calendar";
  import {
    DateFormatter,
    type DateValue,
    getLocalTimeZone,
    CalendarDate,
  } from "@internationalized/date";
  import { cn } from "$lib/utils.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";

  import { setContext } from "svelte";
  import * as Select from "$lib/components/ui/select";
  import { Settings } from "lucide-svelte";
  import type { DateRange } from "bits-ui";
  import { RangeCalendar } from "$lib/components/ui/range-calendar/index.js";

  const df = new DateFormatter("ru-RU", {
    dateStyle: "medium",
  });

  
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();


  let value: DateRange | undefined = $state({
    start: new CalendarDate(year, month, date),
    end: new CalendarDate(year, month, date).add({ days: 20 }),
  });

  let startValue: DateValue | undefined = $state();

  const { data } = $props();


  setContext("place_types", data.placeTypes);
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

<div class="flex justify-between items-center">
  <div>
    <h1 class="text-white">
      {data.venue.name}
    </h1>
    <p class="text-gray mt-2">г. Тюмень, ул. Республики, 26</p>
  </div>
  <a
    href="/venue/{data.venue.id}/edit"
    class="inline-flex items-center justify-center font-normal whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-lg/[1.5rem] hover:shadow-[0px_2px_8px_4px] hover:shadow-primary/50 duration-300 transition bg-primary text-primary-foreground hover:bg-primary-hover rounded-full h-12 w-12 p-2"
  >
    <Settings />
  </a>
</div>

<div class="mt-10">
  <p class="text-2xl">Привязать хостес</p>
  <form action="" class="mt-5">
    <Select.Root>
      <Select.Trigger class="w-[180px]">
        <Select.Value placeholder="Выберите хостес" />
      </Select.Trigger>
      <Select.Content>
        <Select.Group>
          {#if !data.workers.length}
            <Select.Label>У вас нет хостесов</Select.Label>
          {:else}
            <Select.Label>Хостесы</Select.Label>
          {/if}

          {#each data.workers as worker}
            <Select.Item value={worker.value} label={worker.label}
              >{worker.label}</Select.Item
            >
          {/each}
        </Select.Group>
      </Select.Content>
      <Select.Input name="venueId" />
    </Select.Root>
  </form>

  <p class="text-2xl mt-10">Информация о бронях</p>

  <div class="grid gap-2 mt-5">
    <Popover.Root openFocus>
      <Popover.Trigger asChild let:builder>
        <Button
          variant="outline"
          class={cn(
            "w-[300px] justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
          builders={[builder]}
        >
          <CalendarIcon class="mr-2 h-4 w-4" />
          {#if value && value.start}
            {#if value.end}
              {df.format(value.start.toDate(getLocalTimeZone()))} - {df.format(
                value.end.toDate(getLocalTimeZone())
              )}
            {:else}
              {df.format(value.start.toDate(getLocalTimeZone()))}
            {/if}
          {:else if startValue}
            {df.format(startValue.toDate(getLocalTimeZone()))}
          {:else}
            Выбрать дату
          {/if}
        </Button>
      </Popover.Trigger>
      <Popover.Content class="w-auto p-0" align="start">
        <RangeCalendar
          bind:value
          bind:startValue
          minValue={new CalendarDate(year, month, date)}
          initialFocus
          numberOfMonths={2}
          placeholder={value?.start}
        />
      </Popover.Content>
    </Popover.Root>
  </div>
</div>
