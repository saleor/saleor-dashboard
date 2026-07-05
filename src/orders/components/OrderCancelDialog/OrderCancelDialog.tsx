import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { type OrderErrorFragment } from "@dashboard/graphql";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { cancelOrderDialogMessages } from "./messages";

interface OrderCancelDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  number: string;
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export const OrderCancelDialog = ({
  confirmButtonState,
  errors: apiErrors,
  number: orderNumber,
  open,
  onSubmit,
  onClose,
}: OrderCancelDialogProps) => {
  const intl = useIntl();
  const errors = useModalDialogErrors(apiErrors, open);

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="xs">
        <DashboardModal.Header
          data-test-id="dialog-title"
          subtitle={
            <FormattedMessage
              {...cancelOrderDialogMessages.dialogContent}
              values={{
                b: (...chunks) => <b>{chunks}</b>,
              }}
            />
          }
        >
          <FormattedMessage {...cancelOrderDialogMessages.dialogTitle} values={{ orderNumber }} />
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
            <FormattedMessage {...cancelOrderDialogMessages.buttonKeepOrder} />
          </BackButton>
          <ConfirmButton
            data-test-id="submit"
            onClick={onSubmit}
            transitionState={confirmButtonState}
            variant="error"
          >
            <FormattedMessage {...cancelOrderDialogMessages.buttonCancelOrder} />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

OrderCancelDialog.displayName = "OrderCancelDialog";
