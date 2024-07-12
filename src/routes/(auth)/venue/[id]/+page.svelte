<script lang="ts">
  import {
    type DateValue,
  } from "@internationalized/date";

  import { Settings } from "lucide-svelte";
  import RuCalendar from "$lib/components/calendars/ru-calendar.svelte";
  import { toast } from "svelte-sonner";
  import Button from "$lib/components/ui/button/button.svelte";

  const isTimeInRange = (reserveTime: string, checkTime: string): boolean => {
    const parseTime = (time: string): Date => {
      const [hours, minutes] = time.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date;
    };

    const reserveDate = parseTime(reserveTime);
    const checkDate = parseTime(checkTime);

    // На час раньше и на два часа позже
    const oneHourBefore = new Date(reserveDate);
    oneHourBefore.setHours(reserveDate.getHours() - 1);

    const twoHoursAfter = new Date(reserveDate);
    twoHoursAfter.setHours(reserveDate.getHours() + 2);

    console.log({reserveTime, checkTime, checkDate, oneHourBefore, twoHoursAfter});

    return checkDate >= oneHourBefore && checkDate <= twoHoursAfter;
  };

  
  const { data } = $props();

  let {places} = data;

  let date: DateValue | undefined = $state();
  let time: string | undefined = $state();

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
    <p class="text-gray mt-2">{data.venue.meta.address}</p>
  </div>
  <a
    href="/venue/{data.venue.id}/edit"
    class="inline-flex font-medium gap-2 items-center justify-center whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-lg/[1.5rem] hover:shadow-[0px_2px_8px_4px] hover:shadow-primary/50 duration-300 transition bg-primary text-primary-foreground hover:bg-primary-hover rounded-full h-12 p-2 pl-3"
  >
      3д модель
      <Settings />
  </a>
</div>

<div class="mt-10">
  <!-- <p class="text-2xl">Привязать хостес</p>
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
            <Select.Item value={worker.value} label={worker.label!}
              >{worker.label}</Select.Item
            >
          {/each}
        </Select.Group>
      </Select.Content>
      <Select.Input name="venueId" />
    </Select.Root>
  </form> -->

  <p class="text-2xl mt-10">Проверить возможность брони</p>
  
  <div class="flex gap-5 mt-5">
    <RuCalendar bind:value={date}/>
    <input bind:value={time} type="time" step="1800" class="text-white rounded-md p-1.5">
  </div>
  {#if date}
    <div class="mt-5">
      {#each places as item (item.id)}
        {#if !data.reserves.find(r => {
            const isSameDate = r.start_time.toLocaleDateString('sv-SE') == date!.toString();

            const reserve_time = r.start_time.toLocaleTimeString('ru-RU', { timeZone: "Europe/Moscow", hour: '2-digit', minute: '2-digit' });

            const isNotValidTime = time && isTimeInRange(reserve_time, time);
            console.log({isNotValidTime, reserve_time})

            return r.place_id == item.id && isSameDate && isNotValidTime
        })}
          <button class="py-2 px-4 rounded-md bg-stone-800 w-fit hover:bg-stone-700 cursor-pointer" onclick={() => toast.info('Кнопка ничего не делает')}>
            {item.name}
          </button>
        {/if}
      {/each}
    </div>  
  {/if}
</div>
