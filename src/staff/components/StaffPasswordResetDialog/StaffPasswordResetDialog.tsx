import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogTitle from "@material-ui/core/DialogTitle";
import { FormattedMessage, useIntl } from "react-intl";

import { DialogProps, UserError } from "@saleor/types";
import { buttonMessages } from "@saleor/intl";
import Form from "@saleor/components/Form";
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import FormSpacer from "@saleor/components/FormSpacer";
import useModalDialogErrors from "@saleor/hooks/useModalDialogErrors";

interface StaffPasswordResetDialogFormData {
  newPassword: string;
  oldPassword: string;
}
export interface StaffPasswordResetDialogProps extends DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: UserError[];
  onSubmit: (data: StaffPasswordResetDialogFormData) => void;
}

const initialForm: StaffPasswordResetDialogFormData = {
  newPassword: "",
  oldPassword: ""
};

const StaffPasswordResetDialog: React.FC<StaffPasswordResetDialogProps> = ({
  confirmButtonState,
  errors: apiErrors,
  open,
  onClose,
  onSubmit
}) => {
  const intl = useIntl();
  const dialogErrors = useModalDialogErrors(apiErrors, open);

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="sm">
      <DialogTitle>
        <FormattedMessage
          defaultMessage="Change Password"
          description="dialog header"
        />
      </DialogTitle>
      <Form errors={dialogErrors} initial={initialForm} onSubmit={onSubmit}>
        {({ change, data, errors, submit }) => (
          <>
            <DialogContent>
              <TextField
                error={!!errors.oldPassword}
                fullWidth
                helperText={errors.oldPassword}
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
                error={!!errors.newPassword}
                fullWidth
                helperText={
                  errors.newPassword ||
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
              <Button onClick={onClose}>
                <FormattedMessage {...buttonMessages.back} />
              </Button>
              <ConfirmButton
                disabled={data.newPassword.length < 8}
                transitionState={confirmButtonState}
                color="primary"
                variant="contained"
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
