<script lang="ts">
  import type { PageData } from "./$types";
  import FormUpdateProfile from "$lib/features/forms/form-update-profile.svelte";
  const { data } = $props<{ data: PageData }>();
  const { user, updateProfileForm } = data;
</script>

<svelte:head>
  <title>Профиль</title>
</svelte:head>

<h1>Профиль</h1>

<FormUpdateProfile {user} {updateProfileForm} />
