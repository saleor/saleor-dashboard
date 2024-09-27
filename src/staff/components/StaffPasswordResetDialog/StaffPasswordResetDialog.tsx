// @ts-strict-ignore
import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DashboardModal } from "@dashboard/components/Modal";
import { AccountErrorFragment } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import { buttonMessages } from "@dashboard/intl";
import { DialogProps } from "@dashboard/types";
import { getFormErrors } from "@dashboard/utils/errors";
import getAccountErrorMessage from "@dashboard/utils/errors/account";
import { TextField } from "@material-ui/core";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface StaffPasswordResetDialogFormData {
  newPassword: string;
  oldPassword: string;
}
export interface StaffPasswordResetDialogProps extends DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: AccountErrorFragment[];
  onSubmit: (data: StaffPasswordResetDialogFormData) => SubmitPromise;
}

const initialForm: StaffPasswordResetDialogFormData = {
  newPassword: "",
  oldPassword: "",
};
const StaffPasswordResetDialog: React.FC<StaffPasswordResetDialogProps> = ({
  confirmButtonState,
  errors,
  open,
  onClose,
  onSubmit,
}) => {
  const intl = useIntl();
  const dialogErrors = useModalDialogErrors(errors, open);
  const formErrors = getFormErrors(["oldPassword", "newPassword"], dialogErrors);

  return (
    <DashboardModal onChange={onClose} open={open}>
      <Form initial={initialForm} onSubmit={onSubmit}>
        {({ change, data }) => (
          <DashboardModal.Content size="sm">
            <DashboardModal.Header onClose={onClose}>
              <FormattedMessage
                id="+kb2lM"
                defaultMessage="Change Password"
                description="dialog header"
              />
            </DashboardModal.Header>

            <TextField
              error={!!formErrors.oldPassword}
              fullWidth
              helperText={getAccountErrorMessage(formErrors.oldPassword, intl)}
              label={intl.formatMessage({
                id: "GXdwyR",
                defaultMessage: "Previous Password",
                description: "input label",
              })}
              name="oldPassword"
              data-test-id="old-password-input"
              type="password"
              onChange={change}
              inputProps={{
                spellCheck: false,
              }}
            />

            <TextField
              error={!!formErrors.newPassword}
              fullWidth
              helperText={
                getAccountErrorMessage(formErrors.newPassword, intl) ||
                intl.formatMessage({
                  id: "qEJT8e",
                  defaultMessage: "New password must be at least 8 characters long",
                })
              }
              label={intl.formatMessage({
                id: "cMFlOp",
                defaultMessage: "New Password",
                description: "input label",
              })}
              name="newPassword"
              data-test-id="new-password-input"
              type="password"
              onChange={change}
              inputProps={{
                spellCheck: false,
              }}
            />

            <DashboardModal.Actions>
              <BackButton onClick={onClose} />
              <ConfirmButton
                data-test-id="submit"
                disabled={data.newPassword.length < 8}
                transitionState={confirmButtonState}
                type="submit"
              >
                <FormattedMessage {...buttonMessages.save} />
              </ConfirmButton>
            </DashboardModal.Actions>
          </DashboardModal.Content>
        )}
      </Form>
    </DashboardModal>
  );
};

StaffPasswordResetDialog.displayName = "StaffPasswordResetDialog";
export default StaffPasswordResetDialog;
