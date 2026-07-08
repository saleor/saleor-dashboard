import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

interface CollectionDeleteDialogProps {
  collectionName: ReactNode;
  confirmButtonState: ConfirmButtonTransitionState;
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
}

export const CollectionDeleteDialog = ({
  collectionName,
  confirmButtonState,
  onClose,
  onConfirm,
  open,
}: CollectionDeleteDialogProps) => {
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
              id="pVFoOk"
              defaultMessage="Are you sure you want to delete {collectionName}?"
              values={{ collectionName }}
            />
          }
        >
          <FormattedMessage
            id="+wpvnk"
            defaultMessage="Delete Collection"
            description="dialog title"
          />
        </DashboardModal.Header>

        <DashboardModal.Actions>
          <BackButton disabled={isSubmitting} onClick={handleClose} />
          <ConfirmButton
            data-test-id="submit"
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

CollectionDeleteDialog.displayName = "CollectionDeleteDialog";
