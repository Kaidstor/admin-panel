<script lang="ts">
  import SuperInput from "$lib/components/form/super-input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Form from "$lib/components/ui/form";
  import { createWorkerFormSchema } from "$lib/zod/shemas";
  import { superForm } from "sveltekit-superforms";
  import { defaultFormOptions } from ".";
  import SelectDefault from "$lib/components/select-default.svelte";

  let {
    addWorkerForm,
    callback,
    venues,
  }: { addWorkerForm: any; callback: () => void; venues: any[] } = $props();

  const { form, errors, enhance } = superForm(
      addWorkerForm,
    defaultFormOptions({ schema: createWorkerFormSchema, callback, invalidateAll: true })
  );
</script>

<Form.Root {enhance} {form} {errors} CLASS="mt-5 flex flex-col gap-3">
  <div class="flex flex-col">
    <SuperInput name="email" type="email" placeholder="Почта" />
  </div>

  <div class="flex flex-col">
    <SuperInput name="name" type="text" placeholder="Имя" />
  </div>

  {#if venues.length}
    <SelectDefault
      placeholder="Выбрать заведение"
      value={$form.venueId as any}
      name="venueId"
      items={venues}
    />
  {/if}

  <Button formaction="?/createWorker" type="submit" class="bg-stone-300 hover:bg-stone-400">Создать</Button>
</Form.Root>
