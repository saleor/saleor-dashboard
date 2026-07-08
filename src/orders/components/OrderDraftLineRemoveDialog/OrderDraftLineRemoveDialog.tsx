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

import { orderDraftLineRemoveDialogMessages as messages } from "./messages";

interface OrderDraftLineRemoveDialogProps {
  confirmButtonState?: ConfirmButtonTransitionState;
  errors?: OrderErrorFragment[];
  open: boolean;
  productName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const OrderDraftLineRemoveDialog = ({
  confirmButtonState = "default",
  errors: apiErrors = [],
  open,
  productName,
  onClose,
  onConfirm,
}: OrderDraftLineRemoveDialogProps) => {
  const intl = useIntl();
  const errors = useModalDialogErrors(apiErrors, open);
  const isSubmitting = confirmButtonState === "loading";

  const handleClose = (): void => {
    if (isSubmitting) {
      return;
    }

    onClose();
  };

  return (
    <DashboardModal onChange={handleClose} open={open}>
      <DashboardModal.Content size="xs">
        <DashboardModal.Header
          subtitle={
            <FormattedMessage
              {...messages.subtitle}
              values={{
                productName,
              }}
            />
          }
        >
          <FormattedMessage {...messages.title} />
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
          <BackButton disabled={isSubmitting} onClick={handleClose}>
            <FormattedMessage {...messages.keepProductButton} />
          </BackButton>
          <ConfirmButton
            data-test-id="submit"
            disabled={isSubmitting}
            onClick={onConfirm}
            transitionState={confirmButtonState}
            variant="error"
          >
            <FormattedMessage {...messages.removeProductButton} />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

OrderDraftLineRemoveDialog.displayName = "OrderDraftLineRemoveDialog";
