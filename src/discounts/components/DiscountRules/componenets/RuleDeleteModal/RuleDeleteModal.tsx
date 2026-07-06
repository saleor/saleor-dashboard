import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { FormattedMessage } from "react-intl";

import { messages } from "../../messages";

interface RuleDeleteModalProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const RuleDeleteModal = ({
  confirmButtonState,
  open,
  onClose,
  onConfirm,
}: RuleDeleteModalProps) => {
  const isSubmitting = confirmButtonState === "loading";

  const handleClose = (): void => {
    if (isSubmitting) {
      return;
    }

    onClose();
  };

  return (
    <DashboardModal onChange={handleClose} open={open}>
      <DashboardModal.Content size="xs" data-test-id="delete-rule-dialog">
        <DashboardModal.Header subtitle={<FormattedMessage {...messages.deleteRuleDescription} />}>
          <FormattedMessage {...messages.deleteRule} />
        </DashboardModal.Header>

        <DashboardModal.Actions>
          <BackButton
            disabled={isSubmitting}
            onClick={handleClose}
            data-test-id="cancel-delete-rule-button"
          />
          <ConfirmButton
            data-test-id="delete-rule-button"
            disabled={isSubmitting}
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

RuleDeleteModal.displayName = "RuleDeleteModal";
