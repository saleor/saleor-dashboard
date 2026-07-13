// DEV-ONLY-PERMISSION-OVERRIDE: see ./store.ts header for removal instructions.
import { useApolloClient } from "@apollo/client";
import { PermissionEnum } from "@dashboard/graphql";
import { useCallback, useMemo, useState, useSyncExternalStore } from "react";

import { debugSessionStore } from "./debugSessionStore";
import { isDebugStaffEmail } from "./debugStaffEmail";
import { type DebugStaffProfile, debugStaffProfileStore } from "./debugStaffProfileStore";
import { ensureDebugStaffUser } from "./ensureDebugStaffUser";
import { resolveOriginalUserEmail } from "./resolveOriginalUserEmail";
import { permissionOverrideStore } from "./store";
import { useDebugStaffPreview } from "./useDebugStaffPreview";
import { useRealUser } from "./useRealUser";

type DebugStaffSessionStatus = "idle" | "working" | "success" | "error";

export interface UseDebugStaffSessionResult {
  baseEmail: string;
  clearMessage: () => void;
  createDebugStaff: () => Promise<CreateDebugStaffResult>;
  findProfileByEmail: (debugEmail: string) => DebugStaffProfile | null;
  grantablePermissions: PermissionEnum[];
  handlePasswordChange: (value: string) => void;
  hasManageStaff: boolean;
  isDebugSession: boolean;
  isResolvingPreview: boolean;
  loginDebugStaff: (profile: DebugStaffProfile) => Promise<boolean>;
  markProfilePasswordReady: (profile: DebugStaffProfile) => DebugStaffProfile;
  message: string | null;
  password: string;
  preview: ReturnType<typeof useDebugStaffPreview>["preview"];
  realUserEmail: string;
  removeSavedProfile: (profile: DebugStaffProfile) => void;
  savedProfiles: DebugStaffProfile[];
  skippedPermissions: PermissionEnum[];
  status: DebugStaffSessionStatus;
  switchBackToOriginalUser: () => Promise<boolean>;
}

interface UseDebugStaffSessionOptions {
  selectedPermissions: PermissionEnum[];
}

export type CreateDebugStaffResult =
  | {
      status: "created";
      profile: DebugStaffProfile;
      needsPassword: true;
    }
  | {
      status: "exists";
      profile: DebugStaffProfile;
      needsPassword: false;
    }
  | {
      status: "error";
      message: string;
    };

export const useDebugStaffSession = ({
  selectedPermissions,
}: UseDebugStaffSessionOptions): UseDebugStaffSessionResult => {
  const apolloClient = useApolloClient();
  const { user, login } = useRealUser();
  const [status, setStatus] = useState<DebugStaffSessionStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const realUserEmail = user?.email ?? "";
  const isDebugSession = isDebugStaffEmail(realUserEmail);
  const baseEmail =
    resolveOriginalUserEmail(
      isDebugSession ? debugSessionStore.getOriginalUserEmail() : null,
      realUserEmail || undefined,
    ) ?? "";

  const hasManageStaff = useMemo(
    () =>
      !!user?.userPermissions?.some(permission => permission.code === PermissionEnum.MANAGE_STAFF),
    [user?.userPermissions],
  );

  const grantablePermissions = useMemo(() => {
    const realCodes = new Set(user?.userPermissions?.map(permission => permission.code) ?? []);

    return selectedPermissions.filter(code => realCodes.has(code));
  }, [selectedPermissions, user?.userPermissions]);

  const skippedPermissions = useMemo(() => {
    const grantable = new Set(grantablePermissions);

    return selectedPermissions.filter(code => !grantable.has(code));
  }, [grantablePermissions, selectedPermissions]);

  const { preview, isResolving } = useDebugStaffPreview({
    baseEmail,
    grantablePermissions,
    selectedPermissions,
  });

  const allProfiles = useSyncExternalStore(
    debugStaffProfileStore.subscribe,
    debugStaffProfileStore.getSnapshot,
    () => [],
  );

  const savedProfiles = useMemo(() => {
    if (!baseEmail) {
      return [];
    }

    return allProfiles
      .filter(profile => profile.baseEmail === baseEmail)
      .sort((left, right) => right.lastUsedAt.localeCompare(left.lastUsedAt));
  }, [allProfiles, baseEmail]);

  const handlePasswordChange = useCallback((value: string) => {
    setPassword(value);
  }, []);

  const clearMessage = useCallback(() => {
    setMessage(null);
    setStatus("idle");
  }, []);

  const persistProfile = useCallback((profile: Omit<DebugStaffProfile, "lastUsedAt">) => {
    return debugStaffProfileStore.upsert({
      ...profile,
      lastUsedAt: new Date().toISOString(),
    });
  }, []);

  const loginAsUser = useCallback(
    async (email: string, userPassword: string) => {
      if (!login) {
        setStatus("error");
        setMessage("Login is not available in this context.");

        return false;
      }

      const result = await login(email, userPassword);

      if (!result?.token || result.errors?.length) {
        setStatus("error");
        setMessage("Login failed. Check the password and try again.");

        return false;
      }

      window.location.reload();

      return true;
    },
    [login],
  );

  const createDebugStaff = useCallback(async (): Promise<CreateDebugStaffResult> => {
    if (!hasManageStaff) {
      const errorMessage = "MANAGE_STAFF is required to create debug staff users.";

      setStatus("error");
      setMessage(errorMessage);

      return { status: "error", message: errorMessage };
    }

    if (!preview?.debugEmail) {
      const errorMessage = "Could not resolve the debug user email.";

      setStatus("error");
      setMessage(errorMessage);

      return { status: "error", message: errorMessage };
    }

    if (!baseEmail) {
      const errorMessage = "Could not determine your staff email.";

      setStatus("error");
      setMessage(errorMessage);

      return { status: "error", message: errorMessage };
    }

    setStatus("working");
    setMessage(null);

    const ensureResult = await ensureDebugStaffUser({
      apolloClient,
      baseEmail,
      permissions: grantablePermissions,
    });

    if (ensureResult.status === "error") {
      setStatus("error");
      setMessage(ensureResult.message);

      return { status: "error", message: ensureResult.message };
    }

    const profile = persistProfile({
      baseEmail,
      debugEmail: ensureResult.debugEmail,
      hash: ensureResult.hash,
      permissions: grantablePermissions,
      staffCreated: !ensureResult.staffCreated,
    });

    permissionOverrideStore.clearOverride();
    setStatus("success");
    setMessage(null);

    if (ensureResult.staffCreated) {
      return { status: "created", profile, needsPassword: true };
    }

    return { status: "exists", profile, needsPassword: false };
  }, [
    apolloClient,
    baseEmail,
    grantablePermissions,
    hasManageStaff,
    persistProfile,
    preview?.debugEmail,
  ]);

  const loginDebugStaff = useCallback(
    async (profile: DebugStaffProfile) => {
      if (!password.trim()) {
        setStatus("error");
        setMessage("Enter the debug user's password.");

        return false;
      }

      if (!baseEmail) {
        setStatus("error");
        setMessage("Could not determine your staff email.");

        return false;
      }

      setStatus("working");
      setMessage(null);

      persistProfile(profile);

      if (!isDebugSession) {
        debugSessionStore.setOriginalUserEmail(baseEmail);
      }

      permissionOverrideStore.clearOverride();

      return loginAsUser(profile.debugEmail, password.trim());
    },
    [baseEmail, isDebugSession, loginAsUser, password, persistProfile],
  );

  const markProfilePasswordReady = useCallback(
    (profile: DebugStaffProfile) => {
      const updated = persistProfile({
        ...profile,
        staffCreated: true,
      });

      setStatus("success");
      setMessage(null);

      return updated;
    },
    [persistProfile],
  );

  const removeSavedProfile = useCallback((profile: DebugStaffProfile): void => {
    debugStaffProfileStore.remove(profile.baseEmail, profile.hash);
  }, []);

  const switchBackToOriginalUser = useCallback(async (): Promise<boolean> => {
    const originalEmail = resolveOriginalUserEmail(
      debugSessionStore.getOriginalUserEmail(),
      realUserEmail || undefined,
    );

    if (!originalEmail) {
      setStatus("error");
      setMessage("Could not determine your original account email. Log in manually.");

      return false;
    }

    if (!password.trim()) {
      setStatus("error");
      setMessage("Enter your original account password.");

      return false;
    }

    setStatus("working");
    setMessage(null);

    const success = await loginAsUser(originalEmail, password.trim());

    if (success) {
      debugSessionStore.clearOriginalUserEmail();
    }

    return success;
  }, [loginAsUser, password, realUserEmail]);

  const findProfileByEmail = useCallback(
    (debugEmail: string): DebugStaffProfile | null =>
      savedProfiles.find(profile => profile.debugEmail === debugEmail) ?? null,
    [savedProfiles],
  );

  return {
    baseEmail,
    clearMessage,
    createDebugStaff,
    findProfileByEmail,
    grantablePermissions,
    handlePasswordChange,
    hasManageStaff,
    isDebugSession,
    isResolvingPreview: isResolving,
    loginDebugStaff,
    markProfilePasswordReady,
    message,
    password,
    preview,
    realUserEmail,
    removeSavedProfile,
    savedProfiles,
    skippedPermissions,
    status,
    switchBackToOriginalUser,
  };
};
