// DEV-ONLY-PERMISSION-OVERRIDE: see ./store.ts header for removal instructions.
import { Box, Button, Input, Text } from "@saleor/macaw-ui-next";

import { DebugStaffPermissionsList } from "./DebugStaffPermissionsList";
import { type DebugStaffProfile } from "./debugStaffProfileStore";
import styles from "./DevPermissionOverride.module.css";

interface DevDebugSessionViewProps {
  activeDebugProfile: DebugStaffProfile | null;
  baseEmail: string;
  isWorking: boolean;
  message: string | null;
  onPasswordChange: (value: string) => void;
  onSwitchBack: () => void;
  password: string;
  realUserEmail: string;
  status: "idle" | "working" | "success" | "error";
}

export const DevDebugSessionView = ({
  activeDebugProfile,
  baseEmail,
  isWorking,
  message,
  onPasswordChange,
  onSwitchBack,
  password,
  realUserEmail,
  status,
}: DevDebugSessionViewProps): JSX.Element => (
  <Box display="flex" flexDirection="column" gap={3} className={styles.tabContent}>
    <Box display="flex" flexDirection="column" gap={1}>
      <Text size={2} fontWeight="medium" color="critical1">
        Logged in as debug user
      </Text>
      <Text size={1} fontFamily="Geist Mono" wordBreak="break-all">
        {realUserEmail}
      </Text>
      <Text size={1} color="default2">
        Real JWT — apps and API see this user&apos;s permissions.
      </Text>
      {activeDebugProfile && (
        <DebugStaffPermissionsList permissions={activeDebugProfile.permissions} />
      )}
    </Box>

    <Input
      size="small"
      type="password"
      name="password"
      autoComplete="current-password"
      placeholder="Your original account password"
      value={password}
      onChange={event => onPasswordChange(event.target.value)}
    />

    {message && (
      <Text size={1} color={status === "error" ? "critical1" : "default2"}>
        {message}
      </Text>
    )}

    <Button size="small" variant="secondary" disabled={isWorking} onClick={onSwitchBack}>
      {isWorking ? "Working…" : `Back to ${baseEmail || "my account"}`}
    </Button>
  </Box>
);
