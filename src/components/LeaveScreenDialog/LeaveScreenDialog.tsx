import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { buttonMessages } from "@saleor/intl";
import React from "react";
import { FormattedMessage } from "react-intl";

import ConfirmButton, { ConfirmButtonTransitionState } from "../ConfirmButton";

export interface LeaveScreenDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  onClose: () => void;
  onSaveChanges: () => void;
  onRejectChanges: () => void;
}

const LeaveScreenDialog: React.FC<LeaveScreenDialogProps> = ({
  confirmButtonState,
  onClose,
  onSaveChanges,
  onRejectChanges,
  open
}) => (
  <Dialog onClose={onClose} open={open} fullWidth maxWidth="sm">
    <DialogTitle>
      <FormattedMessage
        defaultMessage="You're leaving this screen"
        description="leaving screen warning header"
      />
    </DialogTitle>
    <DialogContent>
      <FormattedMessage
        defaultMessage="Do you want to save previously made changes?"
        description="leaving screen warning message"
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onRejectChanges}>
        <FormattedMessage {...buttonMessages.no} />
      </Button>
      <ConfirmButton
        transitionState={confirmButtonState}
        color="primary"
        variant="contained"
        onClick={onSaveChanges}
      >
        <FormattedMessage {...buttonMessages.yes} />
      </ConfirmButton>
    </DialogActions>
  </Dialog>
);
LeaveScreenDialog.displayName = "LeaveScreenDialog";
export default LeaveScreenDialog;
