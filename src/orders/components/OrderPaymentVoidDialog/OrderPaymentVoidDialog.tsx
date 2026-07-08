// @ts-strict-ignore
import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { type OrderErrorFragment } from "@dashboard/graphql";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import { buttonMessages } from "@dashboard/intl";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { orderPaymentVoidDialogMessages } from "./messages";

interface OrderPaymentVoidDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  open: boolean;
  onClose?: () => any;
  onConfirm?: () => any;
}

const OrderPaymentVoidDialog = ({
  confirmButtonState,
  errors: apiErrors,
  open,
  onConfirm,
  onClose,
}: OrderPaymentVoidDialogProps) => {
  const intl = useIntl();
  const errors = useModalDialogErrors(apiErrors, open);

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="xs">
        <DashboardModal.Header
          subtitle={<FormattedMessage {...orderPaymentVoidDialogMessages.description} />}
        >
          <FormattedMessage {...orderPaymentVoidDialogMessages.title} />
        </DashboardModal.Header>

        {errors.length > 0 && (
          <DashboardModal.Body>
            <DashboardModal.Inset>
              {errors.map((err, index) => (
                <Text display="block" color="critical1" key={index} data-test-id="dialog-error">
                  {getOrderErrorMessage(err, intl)}
                </Text>
              ))}
            </DashboardModal.Inset>
          </DashboardModal.Body>
        )}

        <DashboardModal.Actions>
          <BackButton onClick={onClose} />
          <ConfirmButton transitionState={confirmButtonState} onClick={onConfirm} variant="error">
            <FormattedMessage {...buttonMessages.confirm} />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

OrderPaymentVoidDialog.displayName = "OrderPaymentVoidDialog";
export default OrderPaymentVoidDialog;
