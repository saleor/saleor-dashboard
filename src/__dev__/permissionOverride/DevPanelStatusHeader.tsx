// DEV-ONLY-PERMISSION-OVERRIDE: see ./store.ts header for removal instructions.
import { Box, Text } from "@saleor/macaw-ui-next";

import { type DebugStaffProfile } from "./debugStaffProfileStore";

interface DevPanelStatusHeaderProps {
  activeDebugProfile: DebugStaffProfile | null;
  isDebugSession: boolean;
  isUiOverrideActive: boolean;
  overrideCount: number;
  userEmail: string | undefined;
}

export const DevPanelStatusHeader = ({
  activeDebugProfile,
  isDebugSession,
  isUiOverrideActive,
  overrideCount,
  userEmail,
}: DevPanelStatusHeaderProps): JSX.Element => {
  if (isDebugSession) {
    return (
      <Box display="flex" flexDirection="column" gap={0.5}>
        <Text size={2} fontWeight="medium" color="critical1">
          Logged in as debug user
        </Text>
        <Text size={1} fontFamily="Geist Mono" wordBreak="break-all">
          {userEmail}
        </Text>
        <Text size={1} color="default2">
          {activeDebugProfile
            ? `${activeDebugProfile.permissions.length} permissions · real JWT session`
            : "Real JWT — apps and API see this user's permissions."}
        </Text>
      </Box>
    );
  }

  if (isUiOverrideActive) {
    return (
      <Box display="flex" flexDirection="column" gap={0.5}>
        <Text size={2} fontWeight="medium" color="critical1">
          UI permission preview active
        </Text>
        <Text size={1} color="default2">
          {overrideCount} permissions · dashboard UI only, not API
          {userEmail ? ` · you: ${userEmail}` : ""}
        </Text>
      </Box>
    );
  }

  return (
    <Text size={1} color="default2">
      {userEmail ? `You: ${userEmail} · UI: real permissions` : "UI: real permissions"}
    </Text>
  );
};
