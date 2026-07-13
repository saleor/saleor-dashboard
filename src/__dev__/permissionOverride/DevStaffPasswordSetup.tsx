// DEV-ONLY-PERMISSION-OVERRIDE: see ./store.ts header for removal instructions.
import { Box, Button, Input, Text } from "@saleor/macaw-ui-next";

import { useDebugStaffPasswordSetup } from "./useDebugStaffPasswordSetup";
import { type CapturedNewPasswordPageInvite } from "./useNewPasswordPageInvite";

interface DevStaffPasswordSetupProps {
  debugEmail: string;
  onContinue: () => void;
  pageInvite: CapturedNewPasswordPageInvite | null;
}

export const DevStaffPasswordSetup = ({
  debugEmail,
  onContinue,
  pageInvite,
}: DevStaffPasswordSetupProps): JSX.Element => {
  const {
    confirmedFromCurrentPage,
    handleInviteInputChange,
    inviteInput,
    openSetPasswordPage,
    parsedInvite,
    resendInviteEmail,
    resendMessage,
    resendStatus,
  } = useDebugStaffPasswordSetup({ debugEmail, pageInvite });

  const isResending = resendStatus === "working";

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {confirmedFromCurrentPage ? (
        <Text size={1} color="default1">
          Invite link confirmed on this page. Set the password in the form behind this panel, then
          continue.
        </Text>
      ) : (
        <Text size={1} color="default2">
          Open the invite link from Mailhog, set a password, then continue to log in.
        </Text>
      )}

      {!confirmedFromCurrentPage && (
        <Input
          size="small"
          placeholder="Paste /new-password/ link or token…"
          value={inviteInput}
          onChange={event => handleInviteInputChange(event.target.value)}
        />
      )}

      {parsedInvite && parsedInvite.email !== debugEmail && (
        <Text size={1} color="critical1">
          Email in link ({parsedInvite.email}) does not match this debug user.
        </Text>
      )}

      <Box display="flex" flexWrap="wrap" gap={1}>
        {!confirmedFromCurrentPage && (
          <Button
            size="small"
            variant="secondary"
            disabled={!parsedInvite || parsedInvite.email !== debugEmail}
            onClick={openSetPasswordPage}
          >
            Open set-password page
          </Button>
        )}
        <Button
          size="small"
          variant="tertiary"
          disabled={isResending}
          onClick={() => void resendInviteEmail()}
        >
          {isResending ? "Sending…" : "Resend invite"}
        </Button>
        <Button size="small" variant="secondary" onClick={onContinue}>
          Continue to log in
        </Button>
      </Box>

      {resendMessage && (
        <Text size={1} color={resendStatus === "error" ? "critical1" : "default2"}>
          {resendMessage}
        </Text>
      )}
    </Box>
  );
};
