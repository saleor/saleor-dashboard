// DEV-ONLY-PERMISSION-OVERRIDE: see ./store.ts header for removal instructions.
import { getBaseStaffEmail, isDebugStaffEmail } from "./debugStaffEmail";

export const resolveOriginalUserEmail = (
  storedOriginalEmail: string | null,
  currentUserEmail: string | undefined,
): string | null => {
  if (storedOriginalEmail) {
    return storedOriginalEmail;
  }

  if (currentUserEmail && isDebugStaffEmail(currentUserEmail)) {
    return getBaseStaffEmail(currentUserEmail);
  }

  return currentUserEmail ?? null;
};
