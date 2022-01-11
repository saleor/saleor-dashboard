import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from "@material-ui/core";
import BackButton from "@saleor/components/BackButton";
import ConfirmButton from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import FormSpacer from "@saleor/components/FormSpacer";
import { AccountErrorFragment } from "@saleor/fragments/types/AccountErrorFragment";
import useModalDialogErrors from "@saleor/hooks/useModalDialogErrors";
import { buttonMessages } from "@saleor/intl";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { DialogProps } from "@saleor/types";
import { getFormErrors } from "@saleor/utils/errors";
import getAccountErrorMessage from "@saleor/utils/errors/account";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface StaffPasswordResetDialogFormData {
  newPassword: string;
  oldPassword: string;
}
export interface StaffPasswordResetDialogProps extends DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: AccountErrorFragment[];
  onSubmit: (data: StaffPasswordResetDialogFormData) => void;
}

const initialForm: StaffPasswordResetDialogFormData = {
  newPassword: "",
  oldPassword: ""
};

const StaffPasswordResetDialog: React.FC<StaffPasswordResetDialogProps> = ({
  confirmButtonState,
  errors,
  open,
  onClose,
  onSubmit
}) => {
  const intl = useIntl();
  const dialogErrors = useModalDialogErrors(errors, open);

  const formErrors = getFormErrors(
    ["oldPassword", "newPassword"],
    dialogErrors
  );

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="sm">
      <DialogTitle>
        <FormattedMessage
          defaultMessage="Change Password"
          description="dialog header"
        />
      </DialogTitle>
      <Form initial={initialForm} onSubmit={onSubmit}>
        {({ change, data, submit }) => (
          <>
            <DialogContent>
              <TextField
                error={!!formErrors.oldPassword}
                fullWidth
                helperText={getAccountErrorMessage(
                  formErrors.oldPassword,
                  intl
                )}
                label={intl.formatMessage({
                  defaultMessage: "Previous Password",
                  description: "input label"
                })}
                name="oldPassword"
                type="password"
                onChange={change}
              />
              <FormSpacer />
              <TextField
                error={!!formErrors.newPassword}
                fullWidth
                helperText={
                  getAccountErrorMessage(formErrors.newPassword, intl) ||
                  intl.formatMessage({
                    defaultMessage:
                      "New password must be at least 8 characters long"
                  })
                }
                label={intl.formatMessage({
                  defaultMessage: "New Password",
                  description: "input label"
                })}
                name="newPassword"
                type="password"
                onChange={change}
              />
            </DialogContent>
            <DialogActions>
              <BackButton onClick={onClose} />
              <ConfirmButton
                disabled={data.newPassword.length < 8}
                transitionState={confirmButtonState}
                type="submit"
                onClick={submit}
              >
                <FormattedMessage {...buttonMessages.save} />
              </ConfirmButton>
            </DialogActions>
          </>
        )}
      </Form>
    </Dialog>
  );
};

StaffPasswordResetDialog.displayName = "StaffPasswordResetDialog";
export default StaffPasswordResetDialog;
