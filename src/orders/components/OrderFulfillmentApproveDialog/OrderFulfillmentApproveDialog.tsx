import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core";
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import Form from "@saleor/components/Form";
import FormSpacer from "@saleor/components/FormSpacer";
import { OrderErrorFragment } from "@saleor/fragments/types/OrderErrorFragment";
import { buttonMessages } from "@saleor/intl";
import getOrderErrorMessage from "@saleor/utils/errors/order";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

export interface OrderFulfillmentAcceptDialogFormData {
  notifyCustomer: boolean;
}

export interface OrderFulfillmentAcceptDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  open: boolean;
  onClose();
  onConfirm(data: OrderFulfillmentAcceptDialogFormData);
}

const OrderFulfillmentAcceptDialog: React.FC<OrderFulfillmentAcceptDialogProps> = props => {
  const { confirmButtonState, errors, open, onConfirm, onClose } = props;

  const intl = useIntl();

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="sm">
      <Form initial={{ notifyCustomer: true }} onSubmit={onConfirm}>
        {({ change, data, submit }) => (
          <>
            <DialogTitle>
              <FormattedMessage {...messages.title} />
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                <FormattedMessage {...messages.description} />
              </DialogContentText>
              <ControlledCheckbox
                data-test="notify-customer"
                name={
                  "notifyCustomer" as keyof OrderFulfillmentAcceptDialogFormData
                }
                label={intl.formatMessage(messages.notifyCustomer)}
                checked={data.notifyCustomer}
                onChange={change}
              />
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
              <Button onClick={onClose}>
                <FormattedMessage {...buttonMessages.cancel} />
              </Button>
              <ConfirmButton
                data-test="submit"
                transitionState={confirmButtonState}
                variant="contained"
                onClick={submit}
              >
                <FormattedMessage {...buttonMessages.approve} />
              </ConfirmButton>
            </DialogActions>
          </>
        )}
      </Form>
    </Dialog>
  );
};
OrderFulfillmentAcceptDialog.displayName = "OrderFulfillmentAcceptDialog";
export default OrderFulfillmentAcceptDialog;
