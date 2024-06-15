import { tv, type VariantProps } from "tailwind-variants";
import FormInput from "./form-input.svelte";
import type { HTMLInputAttributes } from "svelte/elements";
import Root from "./Form.svelte";

const inputVariants = tv({
  base: "inline-flex items-center justify-center w-full rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-base",
  variants: {
    variant: {
      default: "bg-white text-primary-foreground shadow",
    },
    size: {
      default: "h-10 px-6 py-2",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export type FormErrors = {
  [key: string]: string;
};
type Variant = VariantProps<typeof inputVariants>["variant"];
type Size = VariantProps<typeof inputVariants>["size"];

interface Props extends Omit<HTMLInputAttributes, "size"> {
  error?: string;
  class?: string;
  variant?: Variant;
  size?: Size;
  name: string;
  placeholder?: string;
}

export {
  Root,
  FormInput,
  type Props,
  //
  Root as Form,
  FormInput as Input,
  type Props as ButtonProps,
  inputVariants,
};
