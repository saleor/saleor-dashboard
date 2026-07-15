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

import { orderDraftCancelDialogMessages as messages } from "./messages";

interface OrderDraftCancelDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderNumber: string;
}

export const OrderDraftCancelDialog = ({
  confirmButtonState,
  errors: apiErrors,
  onClose,
  onConfirm,
  open,
  orderNumber,
}: OrderDraftCancelDialogProps) => {
  const intl = useIntl();
  const errors = useModalDialogErrors(apiErrors, open);

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="xs">
        <DashboardModal.Header
          subtitle={
            <FormattedMessage
              {...messages.dialogContent}
              values={{
                orderNumber,
                b: (...chunks) => <b>{chunks}</b>,
              }}
            />
          }
        >
          <FormattedMessage {...messages.dialogTitle} />
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
          <BackButton onClick={onClose}>
            <FormattedMessage {...messages.buttonKeepDraft} />
          </BackButton>
          <ConfirmButton
            data-test-id="submit"
            onClick={onConfirm}
            transitionState={confirmButtonState}
            variant="error"
          >
            <FormattedMessage {...buttonMessages.delete} />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

OrderDraftCancelDialog.displayName = "OrderDraftCancelDialog";
