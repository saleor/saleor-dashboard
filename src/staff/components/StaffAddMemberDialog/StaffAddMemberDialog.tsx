import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import FormSpacer from "@saleor/components/FormSpacer";
import { buttonMessages, commonMessages } from "@saleor/intl";
import useModalDialogErrors from "@saleor/hooks/useModalDialogErrors";
import { getFormErrors } from "@saleor/utils/errors";
import { StaffErrorFragment } from "@saleor/staff/types/StaffErrorFragment";
import getStaffErrorMessage from "@saleor/utils/errors/staff";

export interface FormData {
  email: string;
  firstName: string;
  fullAccess: boolean;
  lastName: string;
}

const initialForm: FormData = {
  email: "",
  firstName: "",
  fullAccess: false,
  lastName: ""
};

const useStyles = makeStyles(
  theme => ({
    hr: {
      backgroundColor: "#eaeaea",
      border: "none",
      height: 1,
      marginBottom: 0
    },
    sectionTitle: {
      fontWeight: 600 as 600,
      marginBottom: theme.spacing(),
      marginTop: theme.spacing(2)
    },
    textFieldGrid: {
      display: "grid",
      gridColumnGap: theme.spacing(2),
      gridTemplateColumns: "1fr 1fr"
    }
  }),
  { name: "StaffAddMemberDialog" }
);

interface StaffAddMemberDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: StaffErrorFragment[];
  open: boolean;
  onClose: () => void;
  onConfirm: (data: FormData) => void;
}

const StaffAddMemberDialog: React.FC<StaffAddMemberDialogProps> = props => {
  const { confirmButtonState, errors, open, onClose, onConfirm } = props;

  const classes = useStyles(props);
  const dialogErrors = useModalDialogErrors(errors, open);
  const intl = useIntl();

  const formErrors = getFormErrors(
    ["firstName", "lastName", "email"],
    dialogErrors
  );

  return (
    <Dialog onClose={onClose} open={open}>
      <Form initial={initialForm} onSubmit={onConfirm}>
        {({ change, data, hasChanged }) => (
          <>
            <DialogTitle>
              <FormattedMessage
                defaultMessage="Invite Staff Member"
                description="dialog header"
              />
            </DialogTitle>
            <DialogContent>
              <div className={classes.textFieldGrid}>
                <TextField
                  error={!!formErrors.firstName}
                  helperText={getStaffErrorMessage(formErrors.firstName, intl)}
                  label={intl.formatMessage(commonMessages.firstName)}
                  name="firstName"
                  type="text"
                  value={data.firstName}
                  onChange={change}
                />
                <TextField
                  error={!!formErrors.lastName}
                  helperText={getStaffErrorMessage(formErrors.lastName, intl)}
                  label={intl.formatMessage(commonMessages.lastName)}
                  name="lastName"
                  type="text"
                  value={data.lastName}
                  onChange={change}
                />
              </div>
              <FormSpacer />
              <TextField
                error={!!formErrors.email}
                fullWidth
                helperText={getStaffErrorMessage(formErrors.email, intl)}
                label={intl.formatMessage(commonMessages.email)}
                name="email"
                type="email"
                value={data.email}
                onChange={change}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>
                <FormattedMessage {...buttonMessages.back} />
              </Button>
              <ConfirmButton
                color="primary"
                disabled={!hasChanged}
                variant="contained"
                type="submit"
                transitionState={confirmButtonState}
              >
                <FormattedMessage
                  defaultMessage="Send invite"
                  description="button"
                />
              </ConfirmButton>
            </DialogActions>
          </>
        )}
      </Form>
    </Dialog>
  );
};
StaffAddMemberDialog.displayName = "StaffAddMemberDialog";
export default StaffAddMemberDialog;
