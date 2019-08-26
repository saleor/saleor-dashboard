import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import React from "react";
import { FormattedMessage } from "react-intl";

import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import Money from "@saleor/components/Money";
import { SingleSelectField } from "@saleor/components/SingleSelectField";
import { buttonMessages } from "@saleor/intl";
import { OrderDetails_order_availableShippingMethods } from "../../types/OrderDetails";

export interface FormData {
  shippingMethod: string;
}

const styles = (theme: Theme) =>
  createStyles({
    dialog: {
      overflowY: "visible"
    },
    menuItem: {
      display: "flex",
      width: "100%"
    },
    root: {
      overflowY: "visible",
      width: theme.breakpoints.values.sm
    },
    shippingMethodName: {
      flex: 1,
      overflowX: "hidden",
      textOverflow: "ellipsis"
    }
  });

interface OrderShippingMethodEditDialogProps extends WithStyles<typeof styles> {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  shippingMethod: string;
  shippingMethods?: OrderDetails_order_availableShippingMethods[];
  onClose();
  onSubmit?(data: FormData);
}

const OrderShippingMethodEditDialog = withStyles(styles, {
  name: "OrderShippingMethodEditDialog"
})(
  ({
    classes,
    confirmButtonState,
    open,
    shippingMethod,
    shippingMethods,
    onClose,
    onSubmit
  }: OrderShippingMethodEditDialogProps) => {
    const choices = shippingMethods
      ? shippingMethods.map(s => ({
          label: (
            <div className={classes.menuItem}>
              <span className={classes.shippingMethodName}>{s.name}</span>
              &nbsp;
              <span>
                <Money money={s.price} />
              </span>
            </div>
          ),
          value: s.id
        }))
      : [];
    const initialForm: FormData = {
      shippingMethod
    };
    return (
      <Dialog onClose={onClose} open={open} classes={{ paper: classes.dialog }}>
        <DialogTitle>
          <FormattedMessage
            defaultMessage="Edit Shipping Method"
            description="dialog header"
          />
        </DialogTitle>
        <Form initial={initialForm} onSubmit={onSubmit}>
          {({ change, data }) => (
            <>
              <DialogContent className={classes.root}>
                <SingleSelectField
                  choices={choices}
                  name="shippingMethod"
                  value={data.shippingMethod}
                  onChange={change}
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
                  type="submit"
                >
                  <FormattedMessage {...buttonMessages.confirm} />
                </ConfirmButton>
              </DialogActions>
            </>
          )}
        </Form>
      </Dialog>
    );
  }
);
OrderShippingMethodEditDialog.displayName = "OrderShippingMethodEditDialog";
export default OrderShippingMethodEditDialog;
