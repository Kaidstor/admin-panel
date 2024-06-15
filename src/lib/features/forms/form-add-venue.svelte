<script lang="ts">
   import Button from "$lib/components/ui/button/button.svelte";
   import Form from "$lib/components/ui/form/Form.svelte";
   import FormInput from "$lib/components/ui/form/form-input.svelte";
   import { type ValidationResult } from "$lib/services/FormService";
   import { cn } from "$lib/utils";
  import type { ZodString } from "zod";


   let { action, form, callback, ...props } = $props<{
       action: string;
       class?: string;
       form: ValidationResult<{
            name: ZodString;
            address: ZodString;
        }>;
        callback?: () => void;
   }>();

   export { className as class };
</script>

<Form {action} {form} {callback} class={cn("flex flex-col gap-5", props['class'])}>
   <FormInput name="name" type="text" placeholder="Название" />
   <FormInput name="address" type="text" placeholder="Адресс" />
   <Button type="submit" class="bg-stone-300 hover:bg-stone-400">Создать</Button>
</Form>
