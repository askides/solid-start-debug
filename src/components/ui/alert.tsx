import { JSX, splitProps } from "solid-js";
import { cn } from "~/utils/classes";

export interface AlertProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export function Alert(props: AlertProps) {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <div
      role="alert"
      class={cn(
        "border-zinc-200 inline-flex w-full items-center gap-5 rounded-xl border bg-white px-5 py-4 shadow-sm",
        local.class,
      )}
      {...others}
    />
  );
}

export interface AlertContentProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export function AlertContent(props: AlertContentProps) {
  const [local, others] = splitProps(props, ["class"]);

  return <div class={cn("flex flex-col gap-1", local.class)} {...others} />;
}

export interface AlertHeadProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export function AlertHead(props: AlertHeadProps) {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <div
      class={cn("font-semibold leading-tight text-zinc-800", local.class)}
      {...others}
    />
  );
}

export interface AlertBodyProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export function AlertBody(props: AlertBodyProps) {
  const [local, others] = splitProps(props, ["class"]);

  return <div class={cn("text-sm text-zinc-5000", local.class)} {...others} />;
}
