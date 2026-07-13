// DEV-ONLY-PERMISSION-OVERRIDE: see ./store.ts header for removal instructions.

interface ParsedStaffInvite {
  email: string;
  token: string;
}

export const parseStaffInviteInput = (
  input: string,
  expectedEmail: string,
): ParsedStaffInvite | null => {
  const trimmed = input.trim();

  if (!trimmed) {
    return null;
  }

  const fromUrl = tryParseInviteUrl(trimmed);

  if (fromUrl) {
    return fromUrl;
  }

  if (!trimmed.includes("@") && !trimmed.includes(" ")) {
    return { email: expectedEmail, token: trimmed };
  }

  return null;
};

const tryParseInviteUrl = (value: string): ParsedStaffInvite | null => {
  try {
    const url = value.startsWith("/") ? new URL(value, window.location.origin) : new URL(value);
    const email = url.searchParams.get("email");
    const token = url.searchParams.get("token");

    if (!email || !token) {
      return null;
    }

    return { email, token };
  } catch {
    return null;
  }
};
