import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import { ControlledCheckbox } from "@saleor/components/ControlledCheckbox";
import Form from "@saleor/components/Form";
import { buttonMessages } from "@saleor/intl";

export interface FormData {
  restock: boolean;
}

const styles = (theme: Theme) =>
  createStyles({
    deleteButton: {
      "&:hover": {
        backgroundColor: theme.palette.error.main
      },
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText
    }
  });

interface OrderFulfillmentCancelDialogProps extends WithStyles<typeof styles> {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  onClose();
  onConfirm(data: FormData);
}

const OrderFulfillmentCancelDialog = withStyles(styles, {
  name: "OrderFulfillmentCancelDialog"
})(
  ({
    confirmButtonState,
    classes,
    open,
    onConfirm,
    onClose
  }: OrderFulfillmentCancelDialogProps) => {
    const intl = useIntl();

    return (
      <Dialog onClose={onClose} open={open}>
        <Form initial={{ restock: true }} onSubmit={onConfirm}>
          {({ change, data, submit }) => (
            <>
              <DialogTitle>
                <FormattedMessage
                  defaultMessage="Cancel Fulfillment"
                  description="dialog header"
                />
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  <FormattedMessage defaultMessage="Are you sure you want to cancel this fulfillment?" />
                </DialogContentText>
                <ControlledCheckbox
                  checked={data.restock}
                  label={intl.formatMessage({
                    defaultMessage: "Restock items?",
                    description: "switch button"
                  })}
                  name="restock"
                  onChange={change}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={onClose}>
                  <FormattedMessage {...buttonMessages.back} />
                </Button>
                <ConfirmButton
                  transitionState={confirmButtonState}
                  className={classes.deleteButton}
                  variant="contained"
                  onClick={submit}
                >
                  <FormattedMessage
                    defaultMessage="Cancel fulfillment"
                    description="button"
                  />
                </ConfirmButton>
              </DialogActions>
            </>
          )}
        </Form>
      </Dialog>
    );
  }
);
OrderFulfillmentCancelDialog.displayName = "OrderFulfillmentCancelDialog";
export default OrderFulfillmentCancelDialog;
