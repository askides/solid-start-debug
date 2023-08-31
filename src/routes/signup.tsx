import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { redirect } from "solid-start/server";
import { A, createRouteAction } from "solid-start";
import { createEffect } from "solid-js";

export default function Page() {
  const [action, { Form }] = createRouteAction(async (formData: FormData) => {
    const response = await fetch("/api/signup", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      return response.json();
    }

    return redirect("/dashboard");
  });

  createEffect(() => {
    if (action.result && action.result?.errors) {
      alert("Error while signin up.");
    }
  }, action);

  return (
    <main class="flex flex-col items-center justify-center min-h-screen p-6 text-[#241c14]">
      <h1 class="mx-auto max-w-4xl text-center text-5xl tracking-tight font-bold leading-tight font-serif">
        Sign Up
      </h1>

      <Form method="post" class="space-y-5 w-full max-w-md mt-10">
        <div class="grid gap-5">
          <div class="flex flex-col space-y-1.5">
            <Label>Your Email</Label>
            <Input
              type="email"
              name="email"
              required={true}
              placeholder="steve@apple.com"
              class="px-6 py-5 text-base"
            />
            <p class="text-xs text-zinc-500">Will be used for the sign in.</p>
          </div>

          <div class="flex flex-col space-y-1.5">
            <Label>Your Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              required={true}
              class="px-6 py-5 text-base"
            />
            <p class="text-xs text-zinc-500">At least 8 characters.</p>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          class="w-full justify-center"
          disabled={action.pending}
        >
          {action.pending ? "Loading..." : "Sign Up"}
        </Button>

        <hr class="mx-6" />

        <p class="text-sm text-zinc-500 text-center">
          Already have an account?{" "}
          <A class="text-blue-500" href="/signin">
            Sign In
          </A>
        </p>
      </Form>
    </main>
  );
}
