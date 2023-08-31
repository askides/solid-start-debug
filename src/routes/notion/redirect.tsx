import { redirect } from "solid-start/server";
import { config } from "~/services/environment.service";

export function GET() {
  return redirect(config("NOTION_OAUTH_REDIRECT_URL"));
}
