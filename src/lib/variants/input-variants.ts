import { tv, type VariantProps } from "tailwind-variants";

export const inputVariants = tv({
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

export type SuperInputProps = {
  name: string;
  placeholder: string;
  type?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
};

export type Variant = VariantProps<typeof inputVariants>["variant"];
export type Size = VariantProps<typeof inputVariants>["size"];
