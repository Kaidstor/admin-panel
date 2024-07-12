<script lang="ts">
  import * as Popover from "$lib/components/ui/popover/index.js";
  import {
    CalendarDate,
    DateFormatter,
    getLocalTimeZone,
    type DateValue,
  } from "@internationalized/date";
  import DataTable from "./data-table.svelte";
  import type { DateRange } from "bits-ui";
  import Button from "$lib/components/ui/button/button.svelte";
  import { cn } from "$lib/utils";
  import { CalendarIcon } from "lucide-svelte";
  import RangeCalendar from "$lib/components/ui/range-calendar/range-calendar.svelte";

  const { data } = $props();

  const df = new DateFormatter("ru-RU", {
    dateStyle: "medium",
  });

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();

  let value: DateRange | undefined = $state({
    start: new CalendarDate(year, month, date),
    end: new CalendarDate(year, month, date).add({ days: 7 }),
  });

  let startValue: DateValue | undefined = $state();

  let filtered_reserved = $state(
    data.reserves.filter(
      (item) =>
        new Date(item.start_time) > value?.start?.toDate("Europe/Moscow")! &&
        new Date(item.start_time) < value?.end?.toDate("Europe/Moscow")!
    )
  );
  $effect(() => {

    console.log(value?.start?.toDate("Europe/Moscow"))
    console.log(value?.end?.toDate("Europe/Moscow"))

    filtered_reserved = data.reserves.filter(
      (item) =>
        new Date(item.start_time) > value?.start?.toDate("Europe/Moscow")! &&
        new Date(item.start_time) < value?.end?.toDate("Europe/Moscow")!
    );
  });
</script>

<h1>Бронь</h1>

<svelte:head>
  <script
    src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-element-bundle.min.js"
  ></script>
</svelte:head>

<div class="grid gap-2 mt-10">
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

<DataTable bind:filtered_reserved />

<!-- <div class="slider-container">
  <div class="mt-10 max-w-full">
    <swiper-container slides-per-view="20" loop="true" class="cursor-pointer">
      {#each [...Array(24).keys()] as item}
        <swiper-slide class="text-center">{item < 8 ? '|' : item}</swiper-slide>
        <swiper-slide class="text-center">.</swiper-slide>
        <swiper-slide class="text-center">.</swiper-slide>
        <swiper-slide class="text-center">.</swiper-slide>
        <swiper-slide class="text-center">.</swiper-slide>
      {/each}
    </swiper-container>
  </div>
</div> -->

<!-- <style>
  .slider-container {
    container: swiper / inline-size;
  }
</style> -->
