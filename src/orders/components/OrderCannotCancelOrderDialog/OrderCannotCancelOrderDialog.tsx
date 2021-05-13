import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core";
import { buttonMessages } from "@saleor/intl";
import { makeStyles } from "@saleor/theme";
import { DialogProps } from "@saleor/types";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    button: {
      backgroundColor: theme.palette.error.main
    }
  }),
  {
    name: "OrderCannotCancelOrderDialog"
  }
);

const OrderCannotCancelOrderDialog: React.FC<DialogProps> = ({
  open,
  onClose
}) => {
  const classes = useStyles({});

  return (
    <Dialog onClose={onClose} open={open} maxWidth="sm">
      <DialogTitle>
        <FormattedMessage
          defaultMessage="Saleor couldn’t cancel order"
          description="dialog header"
        />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <FormattedMessage defaultMessage="There are still fulfillments created for this order. Cancel the fulfillments first before you cancel the order." />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          className={classes.button}
          onClick={onClose}
        >
          <FormattedMessage {...buttonMessages.ok} />
        </Button>
      </DialogActions>
    </Dialog>
  );
};
OrderCannotCancelOrderDialog.displayName = "OrderCannotCancelOrderDialog";
export default OrderCannotCancelOrderDialog;
