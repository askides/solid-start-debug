export function encryptEmail(email: string): string {
  const atIndex = email.indexOf("@");
  if (atIndex === -1) {
    throw new Error("Invalid email address");
  }

  const username = email.substring(0, atIndex);
  const domain = email.substring(atIndex);

  let encryptedUsername = "";

  for (let i = 0; i < username.length; i++) {
    // Encrypt only the first half of the username
    if (i < Math.floor(username.length / 2)) {
      encryptedUsername += "*";
    } else {
      encryptedUsername += username[i];
    }
  }

  return encryptedUsername + domain;
}
