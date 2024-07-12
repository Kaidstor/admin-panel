<script lang="ts">
   import SuperInput from "$lib/components/form/super-input.svelte";
   import Button from "$lib/components/ui/button/button.svelte";
   import * as Form from "$lib/components/ui/form";
   import { superForm } from "sveltekit-superforms";
   import { defaultFormOptions } from ".";
  import { updateProfileSchema } from "$lib/zod/shemas";
 
   let {
     updateProfileForm,
     user,
   }: { updateProfileForm: any; user: any } = $props();
 
   const { form, errors, enhance } = superForm(
     updateProfileForm,
     defaultFormOptions({ schema: updateProfileSchema })
   );
 </script>
 
 <Form.Root
   {enhance}
   {form}
   {errors}
   CLASS="mt-10 w-[450px]"
 >
    <p>Мое имя: {user?.name}</p>
    <SuperInput name="name" placeholder="Ваше имя"></SuperInput>
    <Button type="submit" formaction="?/updateProfile">Сохранить</Button>
 </Form.Root>
 