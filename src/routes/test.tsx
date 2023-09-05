import { createEffect } from "solid-js";
import { DatabaseZapIcon } from "lucide-solid";
import { Alert } from "~/components/ui/alert";

export default function Page() {
  createEffect(() => {
    console.log("Running Effect!");
  });

  return (
    <main class="max-w-lg mx-auto">
      <form method="post" class="space-y-5">
        <Alert class="rounded-lg border-2 border-emerald-500">
          <DatabaseZapIcon class="shrink-0" />
        </Alert>

        <button type="button" onClick={() => console.log("Clicked!")}>
          Submit
        </button>

        <input type="text" onInput={() => console.log("Typed!")} />
      </form>
    </main>
  );
}
