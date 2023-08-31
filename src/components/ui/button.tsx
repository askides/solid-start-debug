import { JSX, splitProps } from "solid-js";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { cn } from "~/utils/classes";

export const createButtonVariants = cva(
  "inline-flex font-semibold shadow-sm border transition-colors focus:outline-none rounded-xl focus:ring",
  {
    variants: {
      variant: {
        primary:
          "border-zinc-900 bg-zinc-800 text-white hover:bg-zinc-900 focus:ring-zinc-400 disabled:bg-zinc-600 disabled:border-zinc-600 disabled:cursor-wait",
        secondary:
          "border-zinc-150 bg-white text-zinc-800 hover:bg-zinc-50 hover:text-zinc-900 focus:ring-zinc-100",
      },
      size: {
        lg: "py-3 px-6 text-base",
        base: "py-2 px-4 text-sm",
        sm: "py-1 px-2 text-xs",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "base",
    },
  },
);

export interface ButtonProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof createButtonVariants> {}

export function Button(props: ButtonProps) {
  const [local, others] = splitProps(props, ["class", "variant", "size"]);

  return (
    <button
      class={cn(
        createButtonVariants({
          variant: local.variant,
          size: local.size,
          class: local.class,
        }),
      )}
      {...others}
    />
  );
}
