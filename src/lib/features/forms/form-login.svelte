<script lang="ts">
  import SuperInput from "$lib/components/form/super-input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Form from "$lib/components/ui/form";
  import { loginFormSchema } from "$lib/zod/shemas";
  import { superForm } from "sveltekit-superforms";
  import { defaultFormOptions } from ".";

  let { isAuth = $bindable(), loginForm } = $props();

  const { form, errors, enhance } = superForm(
    loginForm as any,
    defaultFormOptions({ schema: loginFormSchema })
  );
</script>

<Form.Root
  {enhance}
  {form}
  {errors}
  CLASS={`px-[3.5rem] py-10 flex flex-col gap-7 bg-[#2F3234] rounded-md shadow-sm w-[560px] ${isAuth ? "" : "hidden"}`}
>
  <h1 class="text-center text-[2.5rem]/[3rem] font-sofia">Авторизация</h1>

  <div class="flex flex-col gap-5">
    <SuperInput type="email" name="email" placeholder="Почта" />
    <SuperInput type="password" name="password" placeholder="Пароль" />
  </div>

  <div class="flex gap-5 mt-1">
    <Button
      onclick={() => (isAuth = !isAuth)}
      class="flex-1 text-white bg-transparent border-primary border-solid border-[2px]"
      variant="secondary">{isAuth ? "Регистрация" : "Авторизация"}</Button
    >
    <Button
      class="flex-1 font-normal text-[#2F3234]"
      formaction="?/login"
      onclick={() => {
        console.log("click");
      }}
      type="submit">Войти</Button
    >
  </div>
</Form.Root>
