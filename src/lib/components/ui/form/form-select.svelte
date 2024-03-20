<script lang="ts">
   type Props = {
      name: string;
      defaultValue: string;
      items: {
         value: string;
         label: string;
      }[];
      error?: string;
   };

   function handleClick(event: MouseEvent) {
      const target = event.currentTarget as HTMLButtonElement;

      if (selectedItem)
         (selectedItem.parentElement as HTMLLIElement).ariaSelected! = 'false';

      (target!.parentElement as HTMLLIElement).ariaSelected! = 'true';

      selectedItem = target;
      selected = target.dataset.value!;
      showList();
   }

   const showList = () => (isActive = !isActive)

   let isActive = $state<boolean>(false);
   let selected = $state();
   let selectedItem = $state<HTMLButtonElement>();
   
   const { items, defaultValue, name, error } = $props<Props>();
</script>

<div class="bg-primary rounded-lg relative text-dark z-50">
   <button onclick={showList} type="button" class="w-full text-left px-6 h-10 rounded-lg">{selected ? selectedItem?.innerText : defaultValue}</button>

   <ul class="list absolute top-full left-0 w-full p-2 bg-[#a2d628] rounded-lg" class:active={isActive} role="listbox">
      <li role="option" aria-selected={false}>
         <button data-value={null} class="h-10 rounded-lg w-full hover:bg-primary text-left px-2" onclick={handleClick}>{defaultValue}</button>
      </li>

      {#each items as item}
         <li role="option" aria-selected={false} 
            ><button type="button" class="h-10 rounded-lg w-full hover:bg-primary text-left px-2" data-value={item.value} onclick={handleClick}>{item.label}</button></li
         >
      {/each}
   </ul>

   <input type="text" {name} bind:value={selected} class="hidden" />

   {#if error}
      <small class="text-destructive px-6">{error}</small>
   {/if}
</div>


<style>
   .list {
      display: none;
   }
   .list.active {
      display: flex;
      flex-direction: column;
   }
</style>