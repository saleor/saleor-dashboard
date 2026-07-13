// DEV-ONLY-PERMISSION-OVERRIDE: see ./store.ts header for removal instructions.
const DEBUG_EMAIL_TAG_PATTERN = /\+debugdev-[a-f0-9]{8}$/i;

export const isDebugStaffEmail = (email: string | undefined): boolean =>
  !!email && /\+debugdev-[a-f0-9]{8}@/i.test(email);

export const buildDebugStaffEmail = (baseEmail: string, hash: string): string => {
  const atIndex = baseEmail.lastIndexOf("@");

  if (atIndex <= 0) {
    throw new Error("Cannot build debug staff email: invalid base email.");
  }

  const localPart = baseEmail.slice(0, atIndex).replace(DEBUG_EMAIL_TAG_PATTERN, "");
  const domain = baseEmail.slice(atIndex + 1);

  return `${localPart}+debugdev-${hash}@${domain}`;
};

export const getBaseStaffEmail = (email: string): string => {
  const atIndex = email.lastIndexOf("@");

  if (atIndex <= 0) {
    return email;
  }

  const localPart = email.slice(0, atIndex).replace(DEBUG_EMAIL_TAG_PATTERN, "");
  const domain = email.slice(atIndex + 1);

  return `${localPart}@${domain}`;
};
