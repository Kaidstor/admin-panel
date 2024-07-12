<script lang="ts">
  import { setContext } from "svelte";
  import { cn } from "$lib/utils";

  const { form, errors, method = "POST", action, CLASS, enhance, children } = $props<{
    form: any;
    errors: any;
    enhance: any;
    method?: string;
    CLASS?: string;
    children?: unknown;
  }>();

  

  setContext("form", {
    get values() {
      return form;
    },
    get errors() {
      return errors;
    },
  });
</script>

<form {method} use:enhance class={cn("flex flex-col gap-5", CLASS)}>
  {@render children()}
</form>
