<script lang="ts">
   import { page } from "$app/stores";
   import Button from "$lib/components/ui/button/button.svelte";
   import { Image } from "radix-icons-svelte";
   import type { PageData } from "./$types";
   const logoUrl = "/GIDCaf.svg";
   const notificationsUrl = "/notifications.png";

   const settingsUrl = "/settings.svg";

   const { data } = $props<{ data: PageData }>();
   const user = $derived(data.user);

   const pathname = $derived($page.url.pathname);
</script>

<main class="min-h-[100dvh] flex">
   <div class="w-[270px] h-[100dvh] bg-dark flex"></div>
   <div class="w-[270px] h-[100dvh] bg-dark px-4 py-8 flex flex-col fixed">
      <div>
         <a href="/" class="w-fit block"><img src={logoUrl} alt="logo" /></a>

         <a href="/notifications" class="absolute right-4 top-4">
            <img src={notificationsUrl} alt="notifications" />
            <span
               class="w-4 h-4 rounded-xl bg-primary absolute right-[-.25rem] top-[-.375rem] text-black font-bold text-[.75rem]/[1] flex justify-center items-center"
               >2</span
            >
         </a>
      </div>

      <ul class="flex flex-1 flex-col gap-3 mt-16 font-sofia">
         <li>
            <a class="menu-item" class:active={pathname == "/"} href="/"
               >Заведения</a
            >
         </li>
         <li>
            <a
               class="menu-item"
               class:active={pathname == "/tariff"}
               href="/tariff">Тариф</a
            >
         </li>
         <li>
            <a
               class="menu-item"
               class:active={pathname == "/payment"}
               href="/payment">Оплата</a
            >
         </li>
         <li>
            <a
               class="menu-item"
               class:active={pathname == "/worker"}
               href="/worker">Сотрудники</a
            >
         </li>
         <li>
            <a
               class="menu-item"
               class:active={pathname == "/stats"}
               href="/stats">Статистика</a
            >
         </li>
      </ul>

      <div class="flex gap-3 items-center relative">
         <Button class="h-12 w-12"><Image /></Button>

         <div class="overflow-hidden">
            <p
               class="text-lg font-bold text-ellipsis whitespace-nowrap overflow-hidden pr-6"
            >
               {user.name ?? user.email}
            </p>
            <a href="/profile" class="text-primary text-sm">Просмотр профиля</a>
         </div>

         <a href="/profile" class="absolute right-0 top-0">
            <img src={settingsUrl} alt="profile" />
         </a>
      </div>
   </div>

   <div class="mx-auto flex flex-1 px-16 py-8 justify-center">
      <div class="flex-1 max-w-8xl">
         <slot />
      </div>
   </div>
</main>

<style>
   .menu-item {
      position: relative;
      padding-left: 1rem;
      font-size: 1.5rem;
      height: 2.5rem;
      display: flex;
      align-items: center;
      transition: opacity 0.2s;
   }
   .menu-item:hover {
      opacity: 0.5;
   }
   .menu-item.active::before {
      content: "";
      width: 3px;
      border-radius: 10px;
      height: 100%;
      background-color: hsla(var(--primary) / 1);
      position: absolute;
      left: 0;
   }
</style>
