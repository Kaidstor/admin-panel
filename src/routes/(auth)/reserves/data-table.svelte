<script lang="ts">
   import { createTable, Render, Subscribe } from "svelte-headless-table";
   import { readable } from "svelte/store";
   import * as Table from "$lib/components/ui/table";
  
   let {filtered_reserved = $bindable()}: {
      filtered_reserved: {
    id: number;
    user: {
        email: string | null;
        id: number;
        name: string | null;
    } | null;
    place: {
        name: string | null;
        type: "Стол" | "Стул";
        id: number;
    } | null;
    start_time: string;
}[]
   } = $props();

 </script>

 <div class="rounded-md border mt-5">
  <Table.Root>
    <Table.Header>
      <Table.Row>
        <Table.Head>Наименование</Table.Head>
        <Table.Head>Время</Table.Head>
        <Table.Head>Имя</Table.Head>
        <Table.Head>Email</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each filtered_reserved as reserve, i (i)}
        <Table.Row>
          <Table.Cell>{reserve.place?.name}</Table.Cell>
          <Table.Cell>{reserve.start_time}</Table.Cell>
          <Table.Cell>{reserve.user?.name}</Table.Cell>
          <Table.Cell>{reserve.user?.email}</Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
 </div>