import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { FormattedMessage } from "react-intl";

import { productBulkDeleteDialogMessages as messages } from "./messages";

interface ProductBulkDeleteDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  count: number;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ProductBulkDeleteDialog = ({
  confirmButtonState,
  count,
  open,
  onClose,
  onConfirm,
}: ProductBulkDeleteDialogProps) => {
  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="xs">
        <DashboardModal.Header
          subtitle={
            <FormattedMessage
              {...messages.subtitle}
              values={{
                counter: count,
                displayQuantity: <strong>{count}</strong>,
              }}
            />
          }
        >
          <FormattedMessage {...messages.title} />
        </DashboardModal.Header>

        <DashboardModal.Actions>
          <BackButton onClick={onClose} />
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

ProductBulkDeleteDialog.displayName = "ProductBulkDeleteDialog";
