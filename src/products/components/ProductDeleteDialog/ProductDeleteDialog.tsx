import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { FormattedMessage } from "react-intl";

import { productDeleteDialogMessages as messages } from "./messages";

interface ProductDeleteDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  name: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ProductDeleteDialog = ({
  confirmButtonState,
  name,
  open,
  onClose,
  onConfirm,
}: ProductDeleteDialogProps) => {
  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="xs">
        <DashboardModal.Header
          subtitle={<FormattedMessage {...messages.subtitle} values={{ name }} />}
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

ProductDeleteDialog.displayName = "ProductDeleteDialog";
