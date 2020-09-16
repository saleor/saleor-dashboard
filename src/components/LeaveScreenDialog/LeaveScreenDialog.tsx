import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { buttonMessages } from "@saleor/intl";
import React from "react";
import { FormattedMessage } from "react-intl";

import ConfirmButton, { ConfirmButtonTransitionState } from "../ConfirmButton";
import Form from "../Form";

export interface LeaveScreenDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const LeaveScreenDialog: React.FC<LeaveScreenDialogProps> = ({
  confirmButtonState,
  onClose,
  onSubmit,
  open
}) => (
  <Dialog onClose={onClose} open={open} fullWidth maxWidth="sm">
    <Form onSubmit={onSubmit}>
      {({ submit }) => (
        <>
          <DialogContent>
            <FormattedMessage
              defaultMessage="You're leaving this screen. Do you want to save previously made changes?"
              description="leaving screen warning message"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>
              <FormattedMessage {...buttonMessages.cancel} />
            </Button>
            <ConfirmButton
              transitionState={confirmButtonState}
              color="primary"
              variant="contained"
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
LeaveScreenDialog.displayName = "LeaveScreenDialog";
export default LeaveScreenDialog;
