// DEV-ONLY-PERMISSION-OVERRIDE: see ./store.ts header for removal instructions.
const ORIGINAL_USER_EMAIL_KEY = "dev:debugStaff:originalUserEmail";

export const debugSessionStore = {
  getOriginalUserEmail: (): string | null => {
    if (typeof window === "undefined") {
      return null;
    }

    return window.sessionStorage.getItem(ORIGINAL_USER_EMAIL_KEY);
  },
  setOriginalUserEmail: (email: string): void => {
    window.sessionStorage.setItem(ORIGINAL_USER_EMAIL_KEY, email);
  },
  clearOriginalUserEmail: (): void => {
    window.sessionStorage.removeItem(ORIGINAL_USER_EMAIL_KEY);
  },
};
