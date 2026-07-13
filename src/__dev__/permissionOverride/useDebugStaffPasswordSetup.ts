// DEV-ONLY-PERMISSION-OVERRIDE: see ./store.ts header for removal instructions.
import { useApolloClient } from "@apollo/client";
import { getNewPasswordResetRedirectUrl } from "@dashboard/auth/utils";
import { useCallback, useEffect, useMemo, useState } from "react";

import { buildNewPasswordPageUrl } from "./buildNewPasswordPageUrl";
import { requestPasswordResetDocument } from "./debugStaffGraphql";
import { debugStaffInviteTokenStore } from "./debugStaffInviteTokenStore";
import { parseStaffInviteInput } from "./parseStaffInviteInput";
import { type CapturedNewPasswordPageInvite } from "./useNewPasswordPageInvite";

interface RequestPasswordResetData {
  requestPasswordReset?: {
    errors: Array<{ message: string | null }>;
  } | null;
}

interface UseDebugStaffPasswordSetupOptions {
  debugEmail: string | undefined;
  pageInvite: CapturedNewPasswordPageInvite | null;
}

export const useDebugStaffPasswordSetup = ({
  debugEmail,
  pageInvite,
}: UseDebugStaffPasswordSetupOptions) => {
  const apolloClient = useApolloClient();
  const [inviteInput, setInviteInput] = useState("");
  const [resendStatus, setResendStatus] = useState<"idle" | "working" | "success" | "error">(
    "idle",
  );
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  useEffect(() => {
    if (pageInvite && (!debugEmail || pageInvite.email === debugEmail)) {
      setInviteInput(pageInvite.url);

      return;
    }

    if (!debugEmail) {
      setInviteInput("");

      return;
    }

    const savedToken = debugStaffInviteTokenStore.get(debugEmail);

    setInviteInput(savedToken ?? "");
  }, [debugEmail, pageInvite]);

  const parsedInvite = useMemo(() => {
    if (!debugEmail) {
      return null;
    }

    return parseStaffInviteInput(inviteInput, debugEmail);
  }, [debugEmail, inviteInput]);

  const setupUrl = useMemo(() => {
    if (!parsedInvite) {
      return null;
    }

    return buildNewPasswordPageUrl(parsedInvite.email, parsedInvite.token);
  }, [parsedInvite]);

  const handleInviteInputChange = useCallback(
    (value: string) => {
      setInviteInput(value);

      if (!debugEmail) {
        return;
      }

      const parsed = parseStaffInviteInput(value, debugEmail);

      if (parsed?.token) {
        debugStaffInviteTokenStore.set(debugEmail, parsed.token);
      }
    },
    [debugEmail],
  );

  const openSetPasswordPage = useCallback(() => {
    if (!setupUrl) {
      return;
    }

    window.open(setupUrl, "_blank", "noopener,noreferrer");
  }, [setupUrl]);

  const resendInviteEmail = useCallback(async () => {
    if (!debugEmail) {
      return;
    }

    setResendStatus("working");
    setResendMessage(null);

    try {
      const result = await apolloClient.mutate<RequestPasswordResetData>({
        mutation: requestPasswordResetDocument,
        variables: {
          email: debugEmail,
          redirectUrl: getNewPasswordResetRedirectUrl(),
        },
      });

      const errors = result.data?.requestPasswordReset?.errors ?? [];

      if (errors.length > 0) {
        setResendStatus("error");
        setResendMessage(
          errors.map((error: { message: string | null }) => error.message).join(" "),
        );

        return;
      }

      setResendStatus("success");
      setResendMessage("Invite email sent — paste the new link or token from Mailhog.");
    } catch (error) {
      setResendStatus("error");
      setResendMessage(error instanceof Error ? error.message : "Failed to resend invite email.");
    }
  }, [apolloClient, debugEmail]);

  const confirmedFromCurrentPage = Boolean(
    pageInvite && debugEmail && pageInvite.email === debugEmail,
  );

  return {
    confirmedFromCurrentPage,
    handleInviteInputChange,
    inviteInput,
    openSetPasswordPage,
    parsedInvite,
    resendInviteEmail,
    resendMessage,
    resendStatus,
  };
};
