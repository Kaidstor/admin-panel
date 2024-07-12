<script lang="ts">
  import SuperInput from "$lib/components/form/super-input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Form from "$lib/components/ui/form";
  import { createVenueFormSchema } from "$lib/zod/shemas";
  import { superForm } from "sveltekit-superforms";
  import { defaultFormOptions } from ".";

  let { addVenueForm, callback }: { addVenueForm: any; callback: () => void } =
    $props();

  const { form, errors, enhance } = superForm(
    addVenueForm as any,
    defaultFormOptions({ schema: createVenueFormSchema, callback })
  );
</script>

<Form.Root {enhance} {form} {errors} CLASS="flex flex-col gap-5 mt-8">
  <SuperInput name="name" type="text" placeholder="Название" />
  <SuperInput name="address" type="text" placeholder="Адресс" />
  <Button
    formaction="?/addVenue"
    type="submit"
    class="bg-stone-300 hover:bg-stone-400">Создать</Button
  >
</Form.Root>

