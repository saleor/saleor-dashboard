import { ChangingPasswordWarning } from "@dashboard/auth/components/ChangingPasswordWarning";
import { useLastLoginMethod } from "@dashboard/auth/hooks/useLastLoginMethod";
import { useUser } from "@dashboard/auth/useUser";
import { getNewPasswordResetRedirectUrl } from "@dashboard/auth/utils";
import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { useRequestPasswordResetMutation } from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { type DialogProps } from "@dashboard/types";
import getAccountErrorMessage from "@dashboard/utils/errors/account";
import commonErrorMessages from "@dashboard/utils/errors/common";
import { Box, Input } from "@saleor/macaw-ui-next";
import { type FormEvent, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

const FORM_ID = "staff-password-reset";

const normalizeEmail = (value: string): string => value.trim().toLowerCase();

export const StaffPasswordResetDialog = ({ open, onClose }: DialogProps): JSX.Element => {
  const intl = useIntl();
  const [email, setEmail] = useState("");
  const notify = useNotifier();
  const { user } = useUser();
  const { hasUserLoggedViaExternalMethod } = useLastLoginMethod();
  const currentEmail = user?.email ?? "";
  const canSubmit =
    currentEmail.length > 0 && normalizeEmail(email) === normalizeEmail(currentEmail);

  const [resetPassword, { status }] = useRequestPasswordResetMutation({
    onCompleted: data => {
      const errors = data?.requestPasswordReset?.errors ?? [];

      if (errors.length === 0) {
        onClose();
        notify({
          status: "success",
          text: intl.formatMessage({
            defaultMessage: "Reset link sent",
            id: "E+nSVG",
          }),
        });
        setEmail("");

        return;
      }

      const text =
        errors
          .map(error => getAccountErrorMessage(error, intl) ?? error.message)
          .filter((message): message is string => Boolean(message))
          .join(", ") || intl.formatMessage(commonErrorMessages.unknownError);

      notify({
        status: "error",
        text,
        title: intl.formatMessage({
          defaultMessage: "Password reset failed",
          id: "ZLcjD2",
        }),
      });
    },
  });

  const isSubmitting = status === "loading";

  const handleClose = (): void => {
    if (isSubmitting) {
      return;
    }

    onClose();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!canSubmit || isSubmitting) {
      return;
    }

    resetPassword({
      variables: {
        email: currentEmail,
        redirectUrl: getNewPasswordResetRedirectUrl(),
      },
    });
  };

  return (
    <DashboardModal onChange={handleClose} open={open}>
      <DashboardModal.Content size="sm">
        <DashboardModal.Header
          subtitle={
            <FormattedMessage
              id="rghexf"
              defaultMessage="Enter your current email to confirm. We’ll send a reset link shortly."
            />
          }
        >
          <FormattedMessage
            id="Fzky6q"
            defaultMessage="Reset password"
            description="dialog header"
          />
        </DashboardModal.Header>

        <DashboardModal.Body>
          <DashboardModal.Inset>
            <Box as="form" id={FORM_ID} display="grid" gap={4} onSubmit={handleSubmit}>
              {hasUserLoggedViaExternalMethod ? <ChangingPasswordWarning /> : null}
              <Input
                name="email"
                type="email"
                label={intl.formatMessage({
                  defaultMessage: "Email address",
                  id: "hJZwTS",
                })}
                autoFocus
                required
                disabled={isSubmitting}
                data-test-id="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
              />
            </Box>
          </DashboardModal.Inset>
        </DashboardModal.Body>

        <DashboardModal.Actions>
          <BackButton disabled={isSubmitting} onClick={handleClose} />
          <ConfirmButton
            data-test-id="submit"
            disabled={isSubmitting || !canSubmit}
            form={FORM_ID}
            transitionState={status}
            type="submit"
          >
            {intl.formatMessage({
              defaultMessage: "Reset",
              id: "jm/spn",
            })}
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
