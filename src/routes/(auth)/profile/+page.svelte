<script lang="ts">
   import * as Form from "$lib/components/ui/form/";
   import type { PageData } from "./$types";
   import Button from '$lib/components/ui/button/button.svelte';
   const { data } = $props<{ data: PageData }>();
   const { user } = data;
</script>

<svelte:head>
   <title>Профиль</title>
</svelte:head>

<h1>Профиль</h1>

<Form.Root form={data.updateProfileForm} action="?/updateProfile" class="mt-10">
   <p>Мое имя: {user?.name}</p>
   <Form.Input name="name" value={user?.name}></Form.Input>
   <Button type="submit">Сохранить</Button>
</Form.Root>
