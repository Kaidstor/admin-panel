<script lang="ts">
  import { goto } from "$app/navigation";
  import { cn } from "$lib/utils";
  import { buttonVariants, type ButtonProps } from ".";

  const {
    size = "default",
    variant = "default",
    type,
	 href,
    ...props
  } = $props<ButtonProps>();
  const buttonClass = cn(
    buttonVariants({ variant, size, className: props["class"] })
  );

  const onclick = (type == "link" && href)
    ? () => goto(href)
    : props.onclick;

  
  export { className as class };
</script>

<button type={(type && type != "link") ? type : "button"} {...props} {onclick} class={buttonClass}>
  <slot />
</button>
