export const extractEmailDomain = (email: string | undefined) =>
  email?.split("@")[1] ?? "internal-no-domain";
