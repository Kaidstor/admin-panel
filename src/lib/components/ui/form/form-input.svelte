<script lang="ts">
  import { cn } from "$lib/utils";
  import { createEventDispatcher, getContext } from "svelte";
  import { inputVariants, type FormErrors, type Props } from ".";

  let {
    variant = "default",
    size = "default",
    class: classNme,
    ...props
  }: Props = $props();

  const { errors } = getContext<{ errors: FormErrors }>("form");
  const message = $derived(errors[props.name]);

  const dispatch = createEventDispatcher();

  function onInput(e: Event) {
    dispatch("input", { value: (e.target as HTMLInputElement)!.value });
  }

  export { className as class };
</script>

<div class="flex flex-col">
  <input
    {...props}
    class={cn(inputVariants({ variant, size, className: classNme }))}
    oninput={onInput}
  />

  {#if message}
    <small class="text-destructive px-6">{message}</small>
  {/if}
</div>
