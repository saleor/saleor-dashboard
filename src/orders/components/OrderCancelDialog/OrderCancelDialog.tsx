import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { OrderErrorFragment } from "@dashboard/graphql";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { cancelOrderDialogMessages } from "./messages";

export interface OrderCancelDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  number: string;
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export const OrderCancelDialog: React.FC<OrderCancelDialogProps> = props => {
  const {
    confirmButtonState,
    errors: apiErrors,
    number: orderNumber,
    open,
    onSubmit,
    onClose,
  } = props;
  const intl = useIntl();
  const errors = useModalDialogErrors(apiErrors, open);

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="sm">
        <DashboardModal.Title data-test-id="dialog-title">
          <FormattedMessage {...cancelOrderDialogMessages.dialogTitle} values={{ orderNumber }} />
        </DashboardModal.Title>
        <Text>
          <FormattedMessage
            {...cancelOrderDialogMessages.dialogContent}
            values={{
              b: (...chunks) => <b>{chunks}</b>,
            }}
          />
        </Text>
        {errors.length > 0 &&
          errors.map((err, index) => (
            <Text display="block" color="critical1" key={index} data-test-id="dialog-error">
              {getOrderErrorMessage(err, intl)}
            </Text>
          ))}

        <DashboardModal.Actions>
          <BackButton onClick={onClose}>
            <FormattedMessage {...cancelOrderDialogMessages.buttonKeepOrder} />
          </BackButton>
          <ConfirmButton onClick={onSubmit} transitionState={confirmButtonState} type="submit">
            <FormattedMessage {...cancelOrderDialogMessages.buttonCancelOrder} />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
OrderCancelDialog.displayName = "OrderCancelDialog";
export default OrderCancelDialog;
