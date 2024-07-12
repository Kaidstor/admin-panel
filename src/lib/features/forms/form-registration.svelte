<script lang="ts">
  import SuperInput from "$lib/components/form/super-input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Form from "$lib/components/ui/form";
  import { registrationFormSchema } from "$lib/zod/shemas";
  import { superForm } from "sveltekit-superforms";
  import { defaultFormOptions } from ".";
  import { s_fetch } from "$lib/api";

  let { isAuth = $bindable(), registrationForm } = $props();

  const { form, errors, enhance } = superForm(
    registrationForm as any,
    defaultFormOptions({ schema: registrationFormSchema, callback: () => (isSended = true) })
  );

  let isSended = $state(false);
  // let isSended = $state(true);
</script>

<Form.Root
  {enhance}
  {form}
  {errors}
  CLASS={`px-[3.5rem] py-10 flex flex-col gap-7 bg-[#2F3234] rounded-md shadow-sm w-[560px] ${!isAuth ? "" : "hidden"}`}
>
  <h1 class="text-center text-[2.5rem]/[3rem] font-sofia">Регистрация</h1>

  {#if !isSended}
    <div class="flex flex-col gap-5">
      <SuperInput type="text" name="email" placeholder="Почта" />
    </div>
  {:else}
    <div class="flex flex-col gap-5">
      <SuperInput type="text" name="code" placeholder="Код с почты" />
    </div>
  {/if}

  {#if !isSended}
    <div class="flex gap-4">
      <Button
        onclick={() => (isAuth = !isAuth)}
        class="flex-1 text-white bg-transparent border-primary border-solid border-[2px]"
        type="button"
        variant="secondary">Авторизация</Button
      >
      <Button
        formaction="?/registration"
        class="flex-1 font-normal text-[#2F3234]"
        type="submit">Зарегистрироваться</Button
      >
    </div>
  {:else}
    <Button
      onclick={() => {
        s_fetch("?/registration_code", {
          method: "POST",
          headers: {
            "x-email": $form.email as string
          },
          body: {
            code: $form.code,
          },
        });
      }}
      class="flex-1 font-normal text-[#2F3234]"
      type="button">Отправить код</Button
    >
  {/if}
</Form.Root>
