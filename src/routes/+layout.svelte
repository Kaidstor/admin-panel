<script>
   import { Toaster } from "$lib/components/ui/sonner";
   import "../app.css";

   const { children } = $props();
</script>

<Toaster />

{@render children()}
