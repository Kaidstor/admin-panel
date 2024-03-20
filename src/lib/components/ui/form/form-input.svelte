<script lang="ts">
   import { cn } from "$lib/utils";
   import { getContext } from "svelte";
   import { inputVariants, type FormErrors, type Props } from ".";

   let {
      variant = "default",
      size = "default",
      class: classNme,
      ...props
   } = $props<Props>();

   const { errors } = getContext<{ errors: FormErrors }>("form");
   const message = $derived(errors[props.name]);

   export {className as class}
</script>

<div class="flex flex-col">
   <input {...props} class={cn(inputVariants({ variant, size, className: classNme }))} />
   
   {#if message}
      <small class="text-destructive px-6">{message}</small>
   {/if}
</div>
