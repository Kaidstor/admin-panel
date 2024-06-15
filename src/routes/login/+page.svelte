<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Form from "$lib/components/ui/form";

  let { data } = $props();

  let isAuth = $state(true);
</script>

<div class="h-[100dvh] flex flex-center">
  <Form.Root
    form={data.loginForm}
    method="POST"
    class={`px-[3.5rem] py-10 flex flex-col gap-7 bg-[#2F3234] rounded-md shadow-sm w-[560px] ${isAuth ? "" : "hidden"}`}
  >
    <h1 class="text-center text-[2.5rem]/[3rem] font-sofia">Авторизация</h1>

    <div class="flex flex-col gap-5">
      <Form.Input type="email" name="email" placeholder="Почта" />

      <Form.Input type="password" name="password" placeholder="Пароль" />
    </div>

    <div class="flex gap-5 mt-1">
      <Button
        onclick={() => (isAuth = !isAuth)}
        class="flex-1 text-white bg-transparent border-primary border-solid border-[2px]"
        type="button"
        variant="secondary">{isAuth ? "Регистрация" : "Авторизация"}</Button
      >
      <Button
        formaction="?/login"
        class="flex-1 font-normal text-[#2F3234]"
        type="submit">Войти</Button
      >
    </div>
  </Form.Root>
  <Form.Root
    form={data.registrationForm}
    method="POST"
    class={`px-[3.5rem] py-10 flex flex-col gap-7 bg-[#2F3234] rounded-md shadow-sm w-[560px] ${isAuth ? "hidden" : ""}`}
  >
    <h1 class="text-center text-[2.5rem]/[3rem] font-sofia">Регистрация</h1>

    <div class="flex flex-col gap-5">
      <Form.Input type="email" name="email" placeholder="Почта" />

      <Form.Input type="password" name="password" placeholder="Пароль" />

      <Form.Input
        type="password"
        name="confirm_password"
        placeholder="Пароль"
      />
    </div>

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
  </Form.Root>
</div>
