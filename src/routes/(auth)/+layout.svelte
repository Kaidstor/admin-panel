<script lang="ts">
  import { page } from "$app/stores";
  import { Image } from "radix-icons-svelte";
  const logoUrl = "/GIDCaf.svg";
  // const notificationsUrl = "/notifications.png";

  const settingsUrl = "/settings.svg";

  const { data, children } = $props();
  const user = $derived(data.user);

  const pathname = $derived($page.url.pathname);

  const menu = [
    {
      href: "/",
      label: "Заведения",
    },
    // {
    //   href: "/tariff",
    //   label: "Тариф",
    // },
    // {
    //   href: "/payment",
    //   label: "Оплата",
    // },
    {
      href: "/worker",
      label: "Хостесы",
    },
    // {
    //   href: "/stats",
    //   label: "Статистика",
    // },
    {
      href: "/reserves",
      label: "Бронь",
    },
  ];
</script>

<main class="min-h-[100dvh] flex">
  <div class="min-w-[270px] h-[100dvh] bg-secondary flex max-md:hidden"></div>
  <div
    class="w-[270px] h-[100dvh] bg-secondary px-4 py-8 flex flex-col fixed max-md:hidden"
  >
    <div>
      <a href="/" class="w-fit block ml-4"><img src={logoUrl} alt="logo" /></a>

      <!-- <a href="/notifications" class="absolute right-4 top-4">
        <img src={notificationsUrl} alt="notifications" />
        <span
          class="w-4 h-4 rounded-xl bg-primary absolute right-[-.25rem] top-[-.375rem] text-black font-bold text-[.75rem]/[1] flex justify-center items-center"
          >2</span
        >
      </a> -->
    </div>

    <ul class="flex flex-1 flex-col gap-3 mt-16 font-sofia">
      {#each menu as el}
        <li>
          <a
            class="menu-item"
            class:active={pathname.startsWith(el.href) && pathname.length == el.href.length}
            href={el.href}>{el.label}</a
          >
        </li>
      {/each}
    </ul>

    <div class="flex gap-3 items-center relative">
      <a class="h-12 w-12 bg-white rounded-md text-black flex justify-center items-center" href="/profile"><Image /></a>

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

  <div class="mx-auto flex flex-1 px-16 max-md:px-5 py-8 justify-center">
    <div class="flex-1 max-w-screen-2xl">
      {@render children()}
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
