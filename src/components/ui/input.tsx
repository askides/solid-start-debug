import { JSX, splitProps } from "solid-js";
import { cn } from "~/utils/classes";

export interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {}

export function Input(props: InputProps) {
  const [local, others] = splitProps(props, ["class", "type"]);

  return (
    <input
      type={local.type}
      class={cn(
        "block w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm shadow-sm focus:border-green-600 focus:ring-green-600",
        local.class,
      )}
      {...others}
    />
  );
}
