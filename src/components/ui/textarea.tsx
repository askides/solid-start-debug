import { JSX, splitProps } from "solid-js";
import { cn } from "~/utils/classes";

export interface TextareaProps
  extends JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function Textarea(props: TextareaProps) {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <textarea
      class={cn(
        "block w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm shadow-sm focus:border-green-600 focus:ring-green-600",
        local.class,
      )}
      {...others}
    />
  );
}
