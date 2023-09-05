import { cn } from "~/utils/classes";
import { JSX, splitProps } from "solid-js";

export interface SelectProps
  extends JSX.SelectHTMLAttributes<HTMLSelectElement> {}

export function Select(props: SelectProps) {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <select
      class={cn(
        "block w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm shadow-sm focus:border-green-600 focus:ring-green-600",
        local.class,
      )}
      {...others}
    />
  );
}
