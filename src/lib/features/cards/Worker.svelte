<script lang="ts">
   import type { IUser } from "$lib/db/schema";

   const { worker } = $props<{
      worker: IUser;
   }>();
</script>

<a href={`/worker/${worker.id}`} class="rounded-lg px-8 py-6 shadow-[0px_2px_8px_4px] shadow-primary/10">
   <div class="flex justify-between items-center">
      <p class="text-xl font-bold">{worker.name}</p>
      <span class="text-gray">#ID{worker.id}</span>
   </div>
</a>
