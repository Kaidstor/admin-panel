<script lang="ts">
  import * as Select from "$lib/components/ui/select/index.js";
  import { onMount } from "svelte";

  let {
    items,
    value = $bindable(),
    defaultValue,
    placeholder,
    name
  }: {
    items: { value: string; label: string }[] | string[];
    defaultValue?: string;
    value: number | string | null | undefined;
    placeholder: string;
    name: string;
  } = $props();

  let selectItems = $state<{ value: string; label: string }[]>([]);

  onMount(() => {
    if (typeof items[0] != 'object'){
      selectItems = (items as string[]).map(item => ({value: item, label: item}))
    }
    else selectItems = items as { value: string; label: string }[]
  })
</script>

<Select.Root portal={null}>
  <Select.Trigger class="w-full text-white">
    <Select.Value {placeholder} />
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      {#if defaultValue}
        <Select.Label>{defaultValue}</Select.Label>
      {/if}
      {#each selectItems as item}
        <Select.Item value={item?.value} label={item?.label} class="text-white"
          >{item?.label}</Select.Item
        >
      {/each}
    </Select.Group>
  </Select.Content>
  <Select.Input {name} bind:value />
</Select.Root>
