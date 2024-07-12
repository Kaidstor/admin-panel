<script lang="ts">
  import SuperInput from "$lib/components/form/super-input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Form from "$lib/components/ui/form";
  import { createVenueFormSchema } from "$lib/zod/shemas";
  import { superForm } from "sveltekit-superforms";
  import { defaultFormOptions } from ".";
  import { Image } from "lucide-svelte";

  let {
    updateWorkerForm,
    user,
  }: { updateWorkerForm: any; user: any } = $props();

  const { form, errors, enhance } = superForm(
    updateWorkerForm,
    defaultFormOptions({ schema: createVenueFormSchema })
  );
</script>

<Form.Root
  {enhance}
  {form}
  {errors}
  CLASS="flex flex-row justify-between items-center"
>
  <div class="flex gap-5">
    {#if user.avatar}
      <img src={user.avatar} alt="avatar" />
    {:else}
      <Button class="h-64 w-64 rounded-full"><Image size={48} /></Button>
    {/if}
    <div>
      <p class="text-4xl font-medium">{user.name}</p>
      <!-- <div class="flex gap-4 items-center">
            <Form.Input name="name" class="py-1 px-4 h-8 bg-slate-100" value={user.name}/>
         </div> -->
      <p class="text-lg">{user.email}</p>
      <!-- formaction="?/updateWorkerProfile" -->
      <button
        class="text-lg text-red-700/75 hover:text-red-700 mt-2"
        onclick={() => alert("Пока что не удаляется")}>Удалить профиль</button
      >
    </div>
  </div>
</Form.Root>
