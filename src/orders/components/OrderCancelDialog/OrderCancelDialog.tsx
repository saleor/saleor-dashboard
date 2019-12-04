import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import Form from "@saleor/components/Form";
import { buttonMessages } from "@saleor/intl";

export interface FormData {
  restock: boolean;
}

const useStyles = makeStyles(
  theme => ({
    deleteButton: {
      "&:hover": {
        backgroundColor: theme.palette.error.main
      },
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText
    }
  }),
  { name: "OrderCancelDialog" }
);

interface OrderCancelDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  number: string;
  open: boolean;
  onClose?();
  onSubmit(data: FormData);
}

const OrderCancelDialog: React.FC<OrderCancelDialogProps> = props => {
  const {
    confirmButtonState,
    number: orderNumber,
    open,
    onSubmit,
    onClose
  } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  return (
    <Dialog onClose={onClose} open={open}>
      <Form
        initial={{
          restock: true
        }}
        onSubmit={onSubmit}
      >
        {({ data, change }) => (
          <>
            <DialogTitle>
              <FormattedMessage
                defaultMessage="Cancel Order"
                description="dialog header"
                id="OrderCancelDialogHeader"
              />
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                <FormattedMessage
                  defaultMessage="Are you sure you want to cancel order #{orderNumber}?"
                  values={{
                    orderNumber
                  }}
                />
                <ControlledCheckbox
                  checked={data.restock}
                  label={intl.formatMessage({
                    defaultMessage: "Release all stock allocated to this order",
                    description: "switch button"
                  })}
                  name="restock"
                  onChange={change}
                />
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>
                <FormattedMessage {...buttonMessages.back} />
              </Button>
              <ConfirmButton
                transitionState={confirmButtonState}
                className={classes.deleteButton}
                variant="contained"
                type="submit"
              >
                <FormattedMessage
                  defaultMessage="Cancel Order"
                  description="button"
                  id="OrderCancelDialogButton"
                />
              </ConfirmButton>
            </DialogActions>
          </>
        )}
      </Form>
    </Dialog>
  );
};
OrderCancelDialog.displayName = "OrderCancelDialog";
export default OrderCancelDialog;
