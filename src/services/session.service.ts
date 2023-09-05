import { createCookieSessionStorage } from "solid-start/session";
import { redirect } from "solid-start/server";
import { User } from "~/models/user.server";

const storage = createCookieSessionStorage({
  cookie: {
    name: "HaikuSession",
    secure: process.env.NODE_ENV! === "production",
    secrets: [process.env.SESSION_SECRET!],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);

  return storage.commitSession(session);
}

// TODO: Check behavior in createServerData
export async function auth(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  const uid = session.get("userId");

  if (!uid) {
    return null;
  }

  const user = await User.find(uid);

  if (!user) {
    return null;
  }

  return user;
}

export async function logout(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"));

  return redirect("/", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}
