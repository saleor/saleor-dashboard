// DEV-ONLY-PERMISSION-OVERRIDE: see ./store.ts header for removal instructions.
//
// Floating widget that lets a developer impersonate a subset of permissions
// without re-logging in. It writes through to localStorage and triggers
// re-renders for every consumer of `useUser` / `useUserPermissions` /
// `RequirePermissions` / `SectionRoute`, because the override is applied at
// the `useUser` layer.
//
// Mounted from `src/index.tsx` when VITE_ENABLE_PERMISSIONS_DEBUGGER=true
// (dev server only). Production builds alias to a stub and do not bundle this.
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { useMemo } from "react";

import { isDebugStaffEmail } from "./debugStaffEmail";
import { debugStaffProfileStore } from "./debugStaffProfileStore";
import { DevPanelStatusHeader } from "./DevPanelStatusHeader";
import styles from "./DevPermissionOverride.module.css";
import { DevRealSessionTab } from "./DevRealSessionTab";
import { DevUiPreviewTab } from "./DevUiPreviewTab";
import { type DevPanelTab, useDevPermissionPanel } from "./useDevPermissionPanel";
import { usePermissionOverride } from "./usePermissionOverride";
import { useRealUser } from "./useRealUser";

const TAB_LABELS: Record<DevPanelTab, string> = {
  "ui-preview": "UI preview",
  "real-session": "Real session",
};

export const DevPermissionOverride = (): JSX.Element => {
  const override = usePermissionOverride();
  const realUser = useRealUser().user;
  const { open, pageInvite, setOpen, setTab, tab } = useDevPermissionPanel();

  const realPermissionCodes = useMemo(
    () => realUser?.userPermissions?.map(permission => permission.code) ?? [],
    [realUser?.userPermissions],
  );

  const selectedPermissions = override ?? realPermissionCodes;
  const isUiOverrideActive = override !== null;
  const isDebugSession = isDebugStaffEmail(realUser?.email);
  const onDebugSetPasswordPage = pageInvite !== null && isDebugStaffEmail(pageInvite.email);

  const fabLabel = useMemo(() => {
    if (onDebugSetPasswordPage) {
      return "dev · set-password";
    }

    if (isDebugSession) {
      return "dev · debug session";
    }

    if (isUiOverrideActive) {
      return `dev · UI: ${override?.length ?? 0}`;
    }

    return "dev tools";
  }, [isDebugSession, isUiOverrideActive, onDebugSetPasswordPage, override?.length]);

  const activeDebugProfile = useMemo(() => {
    const email = realUser?.email;

    if (!isDebugSession || !email) {
      return null;
    }

    return debugStaffProfileStore.getByDebugEmail(email);
  }, [isDebugSession, realUser?.email]);

  return (
    <Box
      position="fixed"
      __bottom="12px"
      __right="12px"
      __zIndex="9999"
      display="flex"
      flexDirection="column"
      alignItems="flex-end"
      gap={2}
    >
      {open && (
        <Box
          backgroundColor="default1"
          borderColor={isUiOverrideActive || isDebugSession ? "critical1" : "default1"}
          borderStyle="solid"
          borderWidth={1}
          borderRadius={4}
          padding={4}
          display="flex"
          flexDirection="column"
          gap={3}
          className={styles.panel}
          __boxShadow="0 8px 24px rgba(0,0,0,0.18)"
        >
          <Box display="flex" flexDirection="column" gap={1}>
            <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
              <Text size={3} fontWeight="bold">
                Dev tools
              </Text>
              <Button size="small" variant="tertiary" onClick={() => setOpen(false)}>
                Close
              </Button>
            </Box>
            <DevPanelStatusHeader
              activeDebugProfile={activeDebugProfile}
              isDebugSession={isDebugSession}
              isUiOverrideActive={isUiOverrideActive}
              overrideCount={override?.length ?? 0}
              userEmail={realUser?.email}
            />
          </Box>

          <Box className={styles.tabPanel}>
            <div className={styles.tabList} role="tablist" aria-label="Dev tools sections">
              {(Object.keys(TAB_LABELS) as DevPanelTab[]).map(tabId => (
                <button
                  key={tabId}
                  type="button"
                  role="tab"
                  aria-selected={tab === tabId}
                  className={styles.tab}
                  onClick={() => setTab(tabId)}
                >
                  {TAB_LABELS[tabId]}
                </button>
              ))}
            </div>

            <Box className={styles.panelBody} role="tabpanel" aria-label={TAB_LABELS[tab]}>
              {tab === "ui-preview" ? (
                <DevUiPreviewTab
                  onSwitchTab={setTab}
                  override={override}
                  realPermissionCodes={realPermissionCodes}
                />
              ) : (
                <DevRealSessionTab
                  onSwitchTab={setTab}
                  pageInvite={pageInvite}
                  selectedPermissions={selectedPermissions}
                />
              )}
            </Box>
          </Box>

          <Text size={1} color="default2">
            Dev builds only · metadata in localStorage · passwords in browser
          </Text>
        </Box>
      )}

      <Button
        size="small"
        variant={
          isUiOverrideActive || isDebugSession || onDebugSetPasswordPage ? "error" : "secondary"
        }
        onClick={() => setOpen(prev => !prev)}
      >
        {fabLabel}
      </Button>
    </Box>
  );
};
