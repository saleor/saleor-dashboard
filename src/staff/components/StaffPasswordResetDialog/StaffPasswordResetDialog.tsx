import { ChangingPasswordWarning } from "@dashboard/auth/components/ChangingPasswordWarning";
import { useLastLoginMethod } from "@dashboard/auth/hooks/useLastLoginMethod";
import { getNewPasswordResetRedirectUrl } from "@dashboard/auth/utils";
import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { useRequestPasswordResetMutation } from "@dashboard/graphql";
import useNotifier from "@dashboard/hooks/useNotifier";
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
            defaultMessage: "Password reset link has been sent to the provided email address",
            id: "ABSQ9z",
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
          <Paragraph fontWeight="light" color="default2">
            {intl.formatMessage({
              defaultMessage:
                "Provide us with an email - if we find it in our database we will send you a link to reset your password. You should be able to find it in your inbox in the next couple of minutes.",
              id: "54M0Gu",
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
