import { type APIEvent, json } from "solid-start/api";
import { email, minLength, object, parse, string } from "valibot";
import { User } from "~/models/user.server";
import { createUserSession } from "~/services/session.service";
// import { Telegram } from "~/services/telegram.service";
// import { encryptEmail } from "~/utils/strings";

export async function POST({ request }: APIEvent) {
  const formData = await request.formData();

  const values = parse(
    object({
      email: string([email()]),
      password: string([minLength(8)]),
    }),
    Object.fromEntries(formData),
  );

  const exists = await User.findByEmail(values.email);

  if (exists) {
    return json(
      {
        errors: {
          email: "A user already exists with this email",
          password: null,
        },
      },
      { status: 422 },
    );
  }

  const user = await User.create(values.email, values.password);

  // await Telegram.notify(
  //   `👋 A new user has registered: ${encryptEmail(user.email)}`,
  // );

  const session = await createUserSession(user.id, "/dashboard");

  return new Response(JSON.stringify({ message: "Operation successful." }), {
    status: 201,
    headers: {
      "Set-Cookie": session,
    },
  });
}
