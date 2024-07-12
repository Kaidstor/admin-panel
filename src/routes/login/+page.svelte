<script lang="ts">
  import FormLogin from "$lib/features/forms/form-login.svelte";
  import FormRegistration from "$lib/features/forms/form-registration.svelte";

  let { data } = $props();
  let isAuth = $state(true);
  const { loginForm, registrationForm } = data;
</script>

<div class="h-[100dvh] flex flex-center">
  <FormLogin bind:isAuth {loginForm} />
  <FormRegistration bind:isAuth {registrationForm} />
</div>
