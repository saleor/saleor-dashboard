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
  isVideo: boolean;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ProductMediaDeleteDialog = ({
  confirmButtonState,
  isVideo,
  open,
  onClose,
  onConfirm,
}: ProductMediaDeleteDialogProps) => {
  const titleMessage = isVideo ? messages.deleteVideoTitle : messages.deleteImageTitle;
  const subtitleMessage = isVideo
    ? messages.deleteVideoConfirmation
    : messages.deleteImageConfirmation;

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="xs">
        <DashboardModal.Header subtitle={<FormattedMessage {...subtitleMessage} />}>
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
