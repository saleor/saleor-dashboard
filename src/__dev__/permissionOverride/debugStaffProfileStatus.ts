// DEV-ONLY-PERMISSION-OVERRIDE: see ./store.ts header for removal instructions.
import { type DebugStaffProfile } from "./debugStaffProfileStore";

export type DebugStaffProfileStatus = "needs-password" | "ready-to-login";

export const getDebugStaffProfileStatus = (profile: DebugStaffProfile): DebugStaffProfileStatus =>
  profile.staffCreated ? "ready-to-login" : "needs-password";

export const getDebugStaffProfileStatusLabel = (status: DebugStaffProfileStatus): string => {
  switch (status) {
    case "needs-password":
      return "Needs password";
    case "ready-to-login":
      return "Ready to log in";
  }
};
