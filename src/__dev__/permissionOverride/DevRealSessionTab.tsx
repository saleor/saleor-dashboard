// DEV-ONLY-PERMISSION-OVERRIDE: see ./store.ts header for removal instructions.
import { type PermissionEnum } from "@dashboard/graphql";
import { Box, Button, Input, Text } from "@saleor/macaw-ui-next";
import { useCallback, useMemo, useState } from "react";

import { DebugStaffPermissionsList } from "./DebugStaffPermissionsList";
import {
  getDebugStaffProfileStatus,
  getDebugStaffProfileStatusLabel,
} from "./debugStaffProfileStatus";
import { type DebugStaffProfile } from "./debugStaffProfileStore";
import { DevDebugSessionView } from "./DevDebugSessionView";
import { type DebugStaffFlowStep, DevDebugStaffStepIndicator } from "./DevDebugStaffStepIndicator";
import styles from "./DevPermissionOverride.module.css";
import { DevStaffPasswordSetup } from "./DevStaffPasswordSetup";
import { useDebugStaffSession } from "./useDebugStaffSession";
import { type DevPanelTab } from "./useDevPermissionPanel";
import { type CapturedNewPasswordPageInvite } from "./useNewPasswordPageInvite";

type FlowView = "home" | "flow";

interface DevRealSessionTabProps {
  onSwitchTab: (tab: DevPanelTab) => void;
  pageInvite: CapturedNewPasswordPageInvite | null;
  selectedPermissions: PermissionEnum[];
}

interface InviteFlowTarget {
  profile: DebugStaffProfile | null;
  step: DebugStaffFlowStep;
}

export const DevRealSessionTab = ({
  onSwitchTab,
  pageInvite,
  selectedPermissions,
}: DevRealSessionTabProps): JSX.Element => {
  const session = useDebugStaffSession({ selectedPermissions });
  const [flowView, setFlowView] = useState<FlowView>("home");
  const [flowStep, setFlowStep] = useState<DebugStaffFlowStep>(1);
  const [activeProfile, setActiveProfile] = useState<DebugStaffProfile | null>(null);
  const [dismissedInviteEmail, setDismissedInviteEmail] = useState<string | null>(null);

  const isWorking = session.status === "working";

  const inviteFlowTarget = useMemo((): InviteFlowTarget | null => {
    if (!pageInvite || session.isDebugSession || pageInvite.email === dismissedInviteEmail) {
      return null;
    }

    const profile =
      session.findProfileByEmail(pageInvite.email) ??
      (session.preview?.debugEmail === pageInvite.email && session.preview.savedProfile
        ? session.preview.savedProfile
        : null);

    if (profile) {
      return { profile, step: 3 };
    }

    if (session.preview?.debugEmail === pageInvite.email) {
      return { profile: null, step: 3 };
    }

    return null;
  }, [dismissedInviteEmail, pageInvite, session]);

  const isFlowView = !session.isDebugSession && (flowView === "flow" || inviteFlowTarget !== null);
  const effectiveFlowStep = inviteFlowTarget?.step ?? flowStep;
  const effectiveActiveProfile = inviteFlowTarget?.profile ?? activeProfile;

  const startNewUserFlow = useCallback(() => {
    session.clearMessage();
    setActiveProfile(null);
    setFlowStep(1);
    setFlowView("flow");
  }, [session]);

  const openProfileFlow = useCallback(
    (profile: DebugStaffProfile, step: DebugStaffFlowStep) => {
      session.clearMessage();
      setActiveProfile(profile);
      setFlowStep(step);
      setFlowView("flow");
    },
    [session],
  );

  const cancelFlow = useCallback(() => {
    if (pageInvite) {
      setDismissedInviteEmail(pageInvite.email);
    }

    setFlowView("home");
  }, [pageInvite]);

  const resolveFlowProfile = (): DebugStaffProfile | null => {
    const debugEmail = effectiveActiveProfile?.debugEmail ?? session.preview?.debugEmail;

    if (!debugEmail) {
      return null;
    }

    return (
      effectiveActiveProfile ??
      session.findProfileByEmail(debugEmail) ??
      session.preview?.savedProfile ??
      null
    );
  };

  const handleCreate = async (): Promise<void> => {
    const result = await session.createDebugStaff();

    if (result.status === "error") {
      return;
    }

    setActiveProfile(result.profile);
    setFlowStep(result.needsPassword ? 3 : 4);
    setFlowView("flow");
  };

  const handleContinueFromPassword = (): void => {
    const profile = resolveFlowProfile();

    if (!profile) {
      return;
    }

    const updated = session.markProfilePasswordReady(profile);

    setActiveProfile(updated);
    setFlowStep(4);
    setFlowView("flow");
  };

  const handleLogin = async (): Promise<void> => {
    const profile = resolveFlowProfile();

    if (!profile) {
      return;
    }

    setActiveProfile(profile);
    await session.loginDebugStaff(profile);
  };

  if (session.isDebugSession) {
    const activeDebugProfile = session.savedProfiles.find(
      profile => profile.debugEmail === session.realUserEmail,
    );

    return (
      <DevDebugSessionView
        activeDebugProfile={activeDebugProfile ?? null}
        baseEmail={session.baseEmail}
        isWorking={isWorking}
        message={session.message}
        onPasswordChange={session.handlePasswordChange}
        onSwitchBack={() => void session.switchBackToOriginalUser()}
        password={session.password}
        realUserEmail={session.realUserEmail}
        status={session.status}
      />
    );
  }

  if (isFlowView) {
    const debugEmail = effectiveActiveProfile?.debugEmail ?? session.preview?.debugEmail;
    const passwordUsername =
      effectiveActiveProfile?.debugEmail ?? session.preview?.debugEmail ?? "";

    return (
      <Box display="flex" flexDirection="column" gap={3} className={styles.tabContent}>
        <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
          <DevDebugStaffStepIndicator currentStep={effectiveFlowStep} />
          <Button size="small" variant="tertiary" onClick={cancelFlow}>
            Cancel
          </Button>
        </Box>

        <Box display="flex" flexDirection="column" gap={3} className={styles.tabBodyScroll}>
          {effectiveFlowStep === 1 && (
            <Box display="flex" flexDirection="column" gap={2}>
              <Text size={1} color="default2">
                From UI preview: {selectedPermissions.length} selected
              </Text>
              <Text size={1} color="default2">
                Will grant {session.grantablePermissions.length} permission
                {session.grantablePermissions.length === 1 ? "" : "s"}
                {session.skippedPermissions.length > 0
                  ? ` (${session.skippedPermissions.length} skipped — not held by your account)`
                  : ""}
                .
              </Text>
              <Button size="small" variant="tertiary" onClick={() => onSwitchTab("ui-preview")}>
                Edit permissions in UI preview
              </Button>
              {!session.hasManageStaff && (
                <Text size={1} color="critical1">
                  MANAGE_STAFF is required.
                </Text>
              )}
              <Button
                size="small"
                variant="secondary"
                disabled={!session.hasManageStaff || session.grantablePermissions.length === 0}
                onClick={() => {
                  if (session.preview?.savedProfile) {
                    setActiveProfile(session.preview.savedProfile);
                  }

                  setFlowStep(2);
                  setFlowView("flow");
                }}
              >
                Continue
              </Button>
            </Box>
          )}

          {effectiveFlowStep === 2 && (
            <Box display="flex" flexDirection="column" gap={2}>
              <Text size={1} color="default2" fontWeight="medium">
                Debug user
              </Text>
              <Text size={2} fontFamily="Geist Mono" wordBreak="break-all">
                {session.isResolvingPreview ? "Resolving…" : (debugEmail ?? "—")}
              </Text>
              {effectiveActiveProfile &&
              getDebugStaffProfileStatus(effectiveActiveProfile) === "ready-to-login" ? (
                <Text size={1} color="default2">
                  Staff already exists for this permission set.
                </Text>
              ) : (
                <Text size={1} color="default2">
                  Creates a staff account and sends an invite email (Mailhog locally).
                </Text>
              )}
              {session.message && (
                <Text size={1} color={session.status === "error" ? "critical1" : "default2"}>
                  {session.message}
                </Text>
              )}
              <Box display="flex" flexWrap="wrap" gap={1}>
                <Button
                  size="small"
                  variant="secondary"
                  disabled={isWorking || !session.hasManageStaff || !debugEmail}
                  onClick={() => void handleCreate()}
                >
                  {isWorking ? "Working…" : "Create & send invite"}
                </Button>
                {effectiveActiveProfile &&
                  getDebugStaffProfileStatus(effectiveActiveProfile) === "ready-to-login" && (
                    <Button
                      size="small"
                      variant="tertiary"
                      onClick={() => {
                        setFlowStep(4);
                        setFlowView("flow");
                      }}
                    >
                      Skip to log in
                    </Button>
                  )}
                {effectiveActiveProfile &&
                  getDebugStaffProfileStatus(effectiveActiveProfile) === "needs-password" && (
                    <Button
                      size="small"
                      variant="tertiary"
                      onClick={() => {
                        setFlowStep(3);
                        setFlowView("flow");
                      }}
                    >
                      Continue to password
                    </Button>
                  )}
              </Box>
            </Box>
          )}

          {effectiveFlowStep === 3 && debugEmail && (
            <DevStaffPasswordSetup
              debugEmail={debugEmail}
              pageInvite={pageInvite?.email === debugEmail ? pageInvite : null}
              onContinue={handleContinueFromPassword}
            />
          )}

          {effectiveFlowStep === 4 && resolveFlowProfile() && (
            <Box display="flex" flexDirection="column" gap={2}>
              <Text size={1} color="default2">
                Log in with the password you set for this debug user.
              </Text>
              <Input
                size="small"
                type="email"
                name="username"
                autoComplete="username"
                readOnly
                value={passwordUsername}
                aria-label="Login email"
              />
              <Input
                size="small"
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="Debug user password"
                value={session.password}
                onChange={event => session.handlePasswordChange(event.target.value)}
              />
              {session.message && (
                <Text size={1} color={session.status === "error" ? "critical1" : "default2"}>
                  {session.message}
                </Text>
              )}
              <Button
                size="small"
                variant="secondary"
                disabled={isWorking}
                onClick={() => void handleLogin()}
              >
                {isWorking ? "Working…" : "Log in as debug user"}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={3} className={styles.tabContent}>
      <Box display="flex" flexDirection="column" gap={1}>
        <Text size={2} fontWeight="medium">
          Real session
        </Text>
        <Text size={1} color="default2">
          Creates a staff account and logs you in so app JWTs match the selected permissions.
        </Text>
      </Box>

      {!session.hasManageStaff && (
        <Text size={1} color="critical1">
          MANAGE_STAFF is required.
        </Text>
      )}

      {session.savedProfiles.length > 0 ? (
        <Box display="flex" flexDirection="column" gap={2} className={styles.tabBodyScroll}>
          <Text size={1} color="default2" fontWeight="medium">
            Saved debug users
          </Text>
          {session.savedProfiles.map(profile => {
            const profileStatus = getDebugStaffProfileStatus(profile);

            return (
              <Box
                key={profile.hash}
                padding={2}
                borderWidth={1}
                borderStyle="solid"
                borderColor="default1"
                borderRadius={3}
                display="flex"
                flexDirection="column"
                gap={2}
              >
                <Box display="flex" flexDirection="column" gap={0.5}>
                  <Text size={1} fontFamily="Geist Mono" wordBreak="break-all">
                    {profile.debugEmail}
                  </Text>
                  <Text size={1} color="default2">
                    {getDebugStaffProfileStatusLabel(profileStatus)}
                  </Text>
                  <DebugStaffPermissionsList permissions={profile.permissions} />
                </Box>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {profileStatus === "needs-password" ? (
                    <Button
                      size="small"
                      variant="secondary"
                      onClick={() => openProfileFlow(profile, 3)}
                    >
                      Set password
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      variant="secondary"
                      disabled={isWorking || !session.hasManageStaff}
                      onClick={() => openProfileFlow(profile, 4)}
                    >
                      Log in
                    </Button>
                  )}
                  <Button
                    size="small"
                    variant="tertiary"
                    onClick={() => session.removeSavedProfile(profile)}
                  >
                    Forget
                  </Button>
                </Box>
              </Box>
            );
          })}
        </Box>
      ) : (
        <Box className={styles.tabBodyScroll}>
          <Text size={1} color="default2">
            No saved debug users yet.
          </Text>
        </Box>
      )}

      <Button
        size="small"
        variant="secondary"
        disabled={!session.hasManageStaff}
        onClick={startNewUserFlow}
      >
        + New debug user
      </Button>
    </Box>
  );
};
