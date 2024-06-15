<script lang="ts">
   import { setContext } from "svelte";
   import { superForm, type ValidationResult } from "$lib/services/FormService";
   import { cn } from "$lib/utils";

   const { form, method, action, callback, ...props } = $props<{
      form: ValidationResult<any>;
      action?: string;
      method?: string;
      class?: string;
      callback?: () => void;
      children?: unknown;
   }>();

   const createWorkerForm = $state(form);
   const { errors, enhance } = $derived(superForm(createWorkerForm, callback));

   setContext("form", {
      get errors() {
         return errors;
      },
   });

   export { className as class };
</script>

<form
   {method}
   {action}
   use:enhance
   class={cn("flex flex-col gap-5", props['class'])}
>
   <slot />
</form>
