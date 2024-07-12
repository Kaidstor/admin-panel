<script lang="ts">
  import FormUpdateUser from "$lib/features/forms/form-update-user.svelte";

  const { data } = $props();

  const { user, updateWorkerForm } = data;
</script>

<svelte:head>
  <title>{user.name}</title>
</svelte:head>

<FormUpdateUser {updateWorkerForm} {user} />
