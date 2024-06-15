<script lang="ts">
   import { createTable, Render, Subscribe } from "svelte-headless-table";
   import { readable } from "svelte/store";
   import * as Table from "$lib/components/ui/table";
  
   let {col_data}: {
      col_data: {
    id: number;
    user: {
        id: number;
        email: string;
        name: string;
    } | null;
    place: {
        id: number;
        type: "Стол" | "Стул";
    } | null;
    start_time: unknown;
}[]
   } = $props();

   type Payment = {
     id: string;
     amount: number;
     status: "pending" | "processing" | "success" | "failed";
     email: string;
   };
    
   const table = createTable(readable(col_data));

   const columns = table.createColumns([
     table.column({
       accessor: ({ place }) => place?.id,
       header: "ID стола",
     }),
     table.column({
       accessor: ({ place }) => place?.type,
       header: "Наименование",
     }),
     table.column({
       accessor: 'start_time',
       header: "Время",
     }),
     table.column({
       accessor: ({ user }) => user?.name,
       header: "Имя",
     }),
     table.column({
       accessor: ({ user }) => user?.email,
       header: "Email",
     }),
   ]);
  
   const { headerRows, pageRows, tableAttrs, tableBodyAttrs } =
     table.createViewModel(columns);
 </script>
  
 <div class="rounded-md border mt-10">
   <Table.Root {...$tableAttrs}>
     <Table.Header>
       {#each $headerRows as headerRow}
         <Subscribe rowAttrs={headerRow.attrs()}>
           <Table.Row>
             {#each headerRow.cells as cell (cell.id)}
               <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
                 <Table.Head {...attrs}>
                   <Render of={cell.render()} />
                 </Table.Head>
               </Subscribe>
             {/each}
           </Table.Row>
         </Subscribe>
       {/each}
     </Table.Header>
     <Table.Body {...$tableBodyAttrs}>
       {#each $pageRows as row (row.id)}
         <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
           <Table.Row {...rowAttrs}>
             {#each row.cells as cell (cell.id)}
               <Subscribe attrs={cell.attrs()} let:attrs>
                 <Table.Cell {...attrs}>
                   <Render of={cell.render()} />
                 </Table.Cell>
               </Subscribe>
             {/each}
           </Table.Row>
         </Subscribe>
       {/each}
     </Table.Body>
   </Table.Root>
 </div>