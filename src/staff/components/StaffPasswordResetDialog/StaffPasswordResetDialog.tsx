import { ChangingPasswordWarning } from "@dashboard/auth/components/ChangingPasswordWarning";
import { useLastLoginMethod } from "@dashboard/auth/hooks/useLastLoginMethod";
import { getNewPasswordResetRedirectUrl } from "@dashboard/auth/utils";
import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { useRequestPasswordResetMutation } from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { DialogProps } from "@dashboard/types";
import { Box, Input, Paragraph } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export const StaffPasswordResetDialog: React.FC<DialogProps> = ({ open, onClose }) => {
  const intl = useIntl();
  const [email, setEmail] = React.useState("");
  const notify = useNotifier();
  const { hasUserLoggedViaExternalMethod } = useLastLoginMethod();

  const [resetPassword, { status }] = useRequestPasswordResetMutation({
    onCompleted: data => {
      if (data?.requestPasswordReset?.errors.length === 0) {
        onClose();
        notify({
          status: "success",
          text: intl.formatMessage({
            defaultMessage: "Reset link sent",
            id: "E+nSVG",
          }),
        });

        setEmail("");
      } else {
        notify({
          status: "error",
          text: data.requestPasswordReset?.errors.join(", "),
          title: intl.formatMessage({
            defaultMessage: "Password reset failed",
            id: "ZLcjD2",
          }),
        });
      }
    },
  });

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="sm">
        <DashboardModal.Header>
          <FormattedMessage
            id="Fzky6q"
            defaultMessage="Reset password"
            description="dialog header"
          />
        </DashboardModal.Header>

        <Box
          as="form"
          onSubmit={event => {
            event.preventDefault();
            resetPassword({
              variables: {
                email,
                redirectUrl: getNewPasswordResetRedirectUrl(),
              },
            });
          }}
          display={"grid"}
          gap={4}
        >
          <Paragraph color="default2" size={2} fontWeight="bold">
            {intl.formatMessage({
              defaultMessage:
                "Enter your email. If it matches an account, we’ll send you a reset link within a few minutes.",
              id: "h7yWcT",
            })}
          </Paragraph>
          {hasUserLoggedViaExternalMethod && <ChangingPasswordWarning />}
          <Input
            name="email"
            type="email"
            label={intl.formatMessage({
              defaultMessage: "Email address",
              id: "hJZwTS",
            })}
            autoFocus
            required
            data-test-id="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
          />

          <DashboardModal.Actions>
            <BackButton onClick={onClose} />
            <ConfirmButton data-test-id="submit" transitionState={status} type="submit">
              {intl.formatMessage({
                defaultMessage: "Reset",
                id: "jm/spn",
              })}
            </ConfirmButton>
          </DashboardModal.Actions>
        </Box>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
