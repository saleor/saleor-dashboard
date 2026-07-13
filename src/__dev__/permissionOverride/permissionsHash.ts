// DEV-ONLY-PERMISSION-OVERRIDE: see ./store.ts header for removal instructions.
import { type PermissionEnum } from "@dashboard/graphql";

export const buildPermissionGroupName = (hash: string): string => `[dev] perms ${hash}`;

export const hashPermissions = async (permissions: PermissionEnum[]): Promise<string> => {
  const payload = [...permissions].sort().join(",");
  const data = new TextEncoder().encode(payload);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");

  return hashHex.slice(0, 8);
};
