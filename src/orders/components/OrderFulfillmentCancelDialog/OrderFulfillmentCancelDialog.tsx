import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core";
import BackButton from "@saleor/components/BackButton";
import ConfirmButton from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import FormSpacer from "@saleor/components/FormSpacer";
import SingleAutocompleteSelectField from "@saleor/components/SingleAutocompleteSelectField";
import { OrderErrorFragment } from "@saleor/fragments/types/OrderErrorFragment";
import { WarehouseFragment } from "@saleor/fragments/types/WarehouseFragment";
import { buttonMessages } from "@saleor/intl";
import { ConfirmButtonTransitionState, makeStyles } from "@saleor/macaw-ui";
import getOrderErrorMessage from "@saleor/utils/errors/order";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface OrderFulfillmentCancelDialogFormData {
  warehouseId: string;
}

const useStyles = makeStyles(
  theme => ({
    enableOverflow: {
      overflow: "visible"
    },
    paragraph: {
      marginBottom: theme.spacing(2)
    },
    selectCcontainer: {
      width: "60%"
    }
  }),
  { name: "OrderFulfillmentCancelDialog" }
);

export interface OrderFulfillmentCancelDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  open: boolean;
  warehouses: WarehouseFragment[];
  onClose();
  onConfirm(data: OrderFulfillmentCancelDialogFormData);
}

const OrderFulfillmentCancelDialog: React.FC<OrderFulfillmentCancelDialogProps> = props => {
  const {
    confirmButtonState,
    errors,
    open,
    warehouses,
    onConfirm,
    onClose
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();
  const [displayValue, setDisplayValue] = React.useState("");

  const choices = warehouses?.map(warehouse => ({
    label: warehouse.name,
    value: warehouse.id
  }));

  return (
    <Dialog
      classes={{
        paper: classes.enableOverflow
      }}
      onClose={onClose}
      open={open}
      fullWidth
      maxWidth="sm"
    >
      <Form initial={{ warehouseId: null }} onSubmit={onConfirm}>
        {({ change, data: formData, submit }) => {
          const handleChange = createSingleAutocompleteSelectHandler(
            change,
            setDisplayValue,
            choices
          );
          return (
            <>
              <DialogTitle>
                <FormattedMessage
                  defaultMessage="Cancel Fulfillment"
                  description="dialog header"
                />
              </DialogTitle>
              <DialogContent className={classes.enableOverflow}>
                <DialogContentText className={classes.paragraph}>
                  <FormattedMessage defaultMessage="Are you sure you want to cancel fulfillment? Canceling a fulfillment will restock products at a selected warehouse." />
                </DialogContentText>
                <div
                  className={classes.selectCcontainer}
                  data-test-id="cancelFulfillmentSelectField"
                >
                  <SingleAutocompleteSelectField
                    choices={choices}
                    displayValue={displayValue}
                    label={intl.formatMessage({
                      defaultMessage: "Select Warehouse",
                      description: "select warehouse to restock items"
                    })}
                    name="warehouseId"
                    value={formData.warehouseId}
                    onChange={handleChange}
                  />
                </div>
                {errors.length > 0 && (
                  <>
                    <FormSpacer />
                    {errors.map((err, index) => (
                      <DialogContentText color="error" key={index}>
                        {getOrderErrorMessage(err, intl)}
                      </DialogContentText>
                    ))}
                  </>
                )}
              </DialogContent>
              <DialogActions>
                <BackButton onClick={onClose} />
                <ConfirmButton
                  data-test="submit"
                  disabled={formData.warehouseId === null}
                  transitionState={confirmButtonState}
                  onClick={submit}
                >
                  <FormattedMessage {...buttonMessages.accept} />
                </ConfirmButton>
              </DialogActions>
            </>
          );
        }}
      </Form>
    </Dialog>
  );
};
OrderFulfillmentCancelDialog.displayName = "OrderFulfillmentCancelDialog";
export default OrderFulfillmentCancelDialog;
