<script>
	import { page } from '$app/stores';
</script>

<div class="flex justify-center items-center h-[100dvh] w-[100dvw]">
   <div class="flex gap-5 items-center">
      <h1>{$page.status}</h1>
      <span style="font-size: 1rem">
         {$page.error?.message}
      </span>
   </div>
</div>
