import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { createServerData$ } from "solid-start/server";
import { db } from "~/drizzle/client";
import { users } from "~/drizzle/schema";
import { useRouteData } from "@solidjs/router";

export function routeData() {
  return createServerData$(() => db.select().from(users));
}

export default function Page() {
  const students = useRouteData<typeof routeData>();

  return (
    <main class="max-w-lg">
      <pre>{JSON.stringify(students(), null, 2)}</pre>
      <form method="post" action="/sites/update" class="space-y-5">
        <div>
          <h3 class="text-lg font-semibold text-zinc-800">Blog Settings</h3>
          <p class="text-sm leading-relaxed text-zinc-500">
            Here's where you can change your blog settings.
          </p>
        </div>

        <div class="grid gap-5">
          <div class="flex flex-col space-y-1.5">
            <Label>Meta Title</Label>
            <Input type="text" name="title" />
            <p class="text-xs text-zinc-500">
              This will be the SEO title for the homepage.
            </p>
          </div>

          <div class="flex flex-col space-y-1.5">
            <Label>Meta Description</Label>
            <Textarea name="description" rows={5} />
            <p class="text-xs text-zinc-500">
              This will be the SEO description for the homepage.
            </p>
          </div>
        </div>

        <Button type="button">Update data</Button>
      </form>
    </main>
  );
}
