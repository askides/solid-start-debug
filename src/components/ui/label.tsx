import { JSX, splitProps } from "solid-js";
import { cn } from "~/utils/classes";

export interface LabelProps extends JSX.LabelHTMLAttributes<HTMLLabelElement> {}

export function Label(props: LabelProps) {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <label
      class={cn("text-sm font-medium text-zinc-800", local.class)}
      {...others}
    />
  );
}
