<script lang="ts">
  import RuCalendar from '$lib/components/calendars/ru-calendar.svelte';
  import type { DateValue } from '@internationalized/date';
  import DataTable from './data-table.svelte';

  const { data } = $props();

  let date: DateValue | undefined = $state();
  let time: string | undefined = $state();

  
  const place_reserves = {} as Record<number, typeof data.reserves>;

  // @ts-ignore
  data.reserves.forEach((el) => {
    const place_id = el.place!.id as number;

    if (!place_reserves?.[place_id]) place_reserves[place_id] = [];

    place_reserves[place_id].push({
      id: el.id,
      user: {
        id: el.user!.id,
        name: el.user!.name,
        email: el.user!.email,
      },
      place: {
        id: place_id,
        type: el.place!.type,
      },
      start_time: el.start_time,
    });
  });

    
  console.log($state.snapshot(data))
</script>

<h1>Брони</h1>

<svelte:head>
  <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-element-bundle.min.js"></script>
</svelte:head>


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

<DataTable col_data={data.reserves} />


<h2 class="text-3xl mt-10">Забронировать</h2>

<div class="flex gap-5 mt-5">
  <RuCalendar bind:value={date}/>
  <input bind:value={time} type="time" step="1800" class="text-black rounded-md p-1.5">
</div>

<p>{date} {time}</p>

{#if date && time}
  <div class="flex flex-col gap-4">
    {#each data.places as place (place.id)}
      {#if !place_reserves[place.id]?.some(r => r.start_time == `${date} ${time}`)}
        <div>Стол: {place.id}</div>
      {/if}
    {/each}
  </div>
{/if}

