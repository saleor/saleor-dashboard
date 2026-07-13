// DEV-ONLY-PERMISSION-OVERRIDE: see ./store.ts header for removal instructions.
import { type PermissionEnum } from "@dashboard/graphql";
import { useCallback, useSyncExternalStore } from "react";

import { type PermissionPreset, permissionPresetStore } from "./permissionPresetStore";
import { hashPermissions } from "./permissionsHash";

type SavePresetResult =
  | { status: "saved" }
  | { status: "duplicate"; name: string }
  | { status: "error" };

export interface UsePermissionPresetsResult {
  findPresetByPermissions: (permissions: PermissionEnum[]) => Promise<PermissionPreset | null>;
  presets: PermissionPreset[];
  removePreset: (hash: string) => void;
  savePreset: (name: string, permissions: PermissionEnum[]) => Promise<SavePresetResult>;
}

export const usePermissionPresets = (): UsePermissionPresetsResult => {
  const presets = useSyncExternalStore(
    permissionPresetStore.subscribe,
    permissionPresetStore.getSnapshot,
    () => [],
  );

  const savePreset = useCallback(
    async (name: string, permissions: PermissionEnum[]): Promise<SavePresetResult> => {
      const trimmedName = name.trim();

      if (!trimmedName) {
        return { status: "error" };
      }

      const hash = await hashPermissions(permissions);
      const existing = permissionPresetStore.getByHash(hash);

      if (existing) {
        return { status: "duplicate", name: existing.name };
      }

      const saved = permissionPresetStore.upsert({
        hash,
        name: trimmedName,
        permissions,
        savedAt: new Date().toISOString(),
      });

      if (!saved) {
        const duplicate = permissionPresetStore.getByHash(hash);

        return duplicate ? { status: "duplicate", name: duplicate.name } : { status: "error" };
      }

      return { status: "saved" };
    },
    [],
  );

  const removePreset = useCallback((hash: string): void => {
    permissionPresetStore.remove(hash);
  }, []);

  const findPresetByPermissions = useCallback(
    async (permissions: PermissionEnum[]): Promise<PermissionPreset | null> => {
      const hash = await hashPermissions(permissions);

      return permissionPresetStore.getByHash(hash);
    },
    [],
  );

  return {
    findPresetByPermissions,
    presets,
    removePreset,
    savePreset,
  };
};
