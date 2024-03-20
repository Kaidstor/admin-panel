<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import Form from "$lib/components/ui/form/Form.svelte";
    import FormInput from "$lib/components/ui/form/form-input.svelte";
    import FormSelect from "$lib/components/ui/form/form-select.svelte";
    import { type ValidationResult } from "$lib/services/FormService";
    import { cn } from "$lib/utils";
    import type { ZodNumber, ZodString } from "zod";


    let { action, form, venues, ...props } = $props<{
        action: string;
        class?: string;
        venues: { value: string; label: string }[];
        form: ValidationResult<{
            name: ZodString;
            email: ZodString;
            venueId: ZodNumber;
        }>;
    }>();

    export { className as class };
</script>

<Form {action} {form} class={cn("flex flex-col gap-5", props['class'])}>
    <FormInput name="email" type="email" placeholder="Почта" />
    <FormInput name="name" type="text" placeholder="Имя" />
    {#if venues.length}
        <FormSelect
            defaultValue="Выбрать заведение"
            name="venueId"
            items={venues}
        />
    {/if}
    <Button type="submit">Создать</Button>
</Form>

<div class="flex justify-center mt-2"><small class="text-gray">Пароль по умолчанию: password</small></div>
