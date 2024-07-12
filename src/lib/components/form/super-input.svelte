<script lang="ts">
  import { cn } from "$lib/utils";
  import { inputVariants, type SuperInputProps} from "$lib/variants/input-variants";
  import { getFormContext } from ".";

  const {
    name,
    placeholder,
    type = "text",
    variant = "default",
    size = "default",
    className,
  }: SuperInputProps = $props();

  const { values, errors } = getFormContext();
  let error = $derived($errors[name]);
</script>

<input
  {name}
  {type}
  {placeholder}
  class={cn(inputVariants({ variant, size, className }))}
  bind:value={$values[name]}
/>

{#if error}
  <small class="text-destructive px-6">{error}</small>
{/if}
