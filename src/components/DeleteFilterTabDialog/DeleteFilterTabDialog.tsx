import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { FormattedMessage } from "react-intl";

interface DeleteFilterTabDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  tabName: string;
  onClose: () => void;
  onSubmit: () => void;
}

export const DeleteFilterTabDialog = ({
  confirmButtonState,
  onClose,
  onSubmit,
  open,
  tabName,
}: DeleteFilterTabDialogProps) => {
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
              id="U5CH0u"
              defaultMessage="Are you sure you want to delete {name} preset?"
              values={{
                name: <strong>{tabName}</strong>,
              }}
            />
          }
        >
          <FormattedMessage
            id="xy66ru"
            defaultMessage="Delete preset"
            description="custom preset delete, dialog header"
          />
        </DashboardModal.Header>

        <DashboardModal.Actions>
          <BackButton disabled={isSubmitting} onClick={handleClose} />
          <ConfirmButton
            data-test-id="submit"
            disabled={isSubmitting}
            onClick={onSubmit}
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

DeleteFilterTabDialog.displayName = "DeleteFilterTabDialog";
