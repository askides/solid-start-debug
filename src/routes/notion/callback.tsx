import { redirect } from "solid-start/server";
import { APIEvent } from "solid-start/api";
import { auth } from "~/services/session.service";
import { config } from "~/services/environment.service";
import { Workspace } from "~/models/workspace.server";

export async function GET({ request }: APIEvent) {
  const user = await auth(request);

  if (!user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) throw new Error("Code is missing.");

  const client = config("NOTION_OAUTH_CLIENT_ID");
  const secret = config("NOTION_OAUTH_CLIENT_SECRET");

  const response = await fetch("https://api.notion.com/v1/oauth/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(client + ":" + secret)}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: config("NOTION_OAUTH_REDIRECT_URL"),
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err);
  }

  const data = await response.json();

  await Workspace.createOrUpdate({
    id: data.bot_id,
    name: data.workspace_name,
    accessToken: data.access_token,
    tokenType: data.token_type,
    userId: user.id,
  });

  return redirect("/dashboard");
}
