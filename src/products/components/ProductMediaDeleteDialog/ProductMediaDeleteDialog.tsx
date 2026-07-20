import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { FormattedMessage } from "react-intl";

import { productMediaDeleteDialogMessages as messages } from "./messages";

interface ProductMediaDeleteDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  quantity: number;
  isVideo?: boolean;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ProductMediaDeleteDialog = ({
  confirmButtonState,
  quantity,
  isVideo = false,
  open,
  onClose,
  onConfirm,
}: ProductMediaDeleteDialogProps) => {
  const isBulk = quantity > 1;
  const titleMessage = isBulk
    ? messages.deleteMediaTitle
    : isVideo
      ? messages.deleteVideoTitle
      : messages.deleteImageTitle;
  const subtitle = isBulk ? (
    <FormattedMessage
      {...messages.deleteMediaConfirmation}
      values={{
        counter: quantity,
        displayQuantity: <strong>{quantity}</strong>,
      }}
    />
  ) : isVideo ? (
    <FormattedMessage {...messages.deleteVideoConfirmation} />
  ) : (
    <FormattedMessage {...messages.deleteImageConfirmation} />
  );

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="xs">
        <DashboardModal.Header subtitle={subtitle}>
          <FormattedMessage {...titleMessage} />
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

ProductMediaDeleteDialog.displayName = "ProductMediaDeleteDialog";
