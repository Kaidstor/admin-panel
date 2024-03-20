import { tv, type VariantProps } from "tailwind-variants";
import Root from "./button.svelte";
import type { ClassNameValue } from "tailwind-merge";
import type { HTMLButtonAttributes } from "svelte/elements";

const buttonVariants = tv({
	base: "inline-flex items-center justify-center rounded-md text-sm font-normal whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-lg/[1.5rem] hover:shadow-[0px_2px_8px_4px] hover:shadow-primary/50 hover:text-primary",
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary-hover",
			secondary: "bg-tranparent  text-secondary-foreground shadow-sm",
		},
		size: {
			default: "h-10 px-4 py-2",
			md: "h-12 px-8 py-4",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "default",
	},
});

//   text-white bg-transparent border-[#C1FF15] border-solid border-[2px]


type Variant = VariantProps<typeof buttonVariants>["variant"];
type Size = VariantProps<typeof buttonVariants>["size"];

type OmitTypeProp<T> = Omit<T, 'type'>;

type Props = OmitTypeProp<HTMLButtonAttributes> & {
  class?: ClassNameValue;
  variant?: Variant;
  type?: "button" | "submit" | "reset" | "link" | undefined;
  href?: string;
  size?: Size;  
  children?: unknown;
};

export {
	Root,
	type Props,
	//
	Root as Button,
	type Props as ButtonProps,
	buttonVariants,
};
