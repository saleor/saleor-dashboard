import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { FormattedMessage } from "react-intl";

interface AttributeValueDeleteDialogProps {
  attributeName: string;
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  name: string;
  useName?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const AttributeValueDeleteDialog = ({
  attributeName,
  name,
  confirmButtonState,
  useName,
  onClose,
  onConfirm,
  open,
}: AttributeValueDeleteDialogProps) => {
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
            useName ? (
              <FormattedMessage
                data-test-id="delete-attribute-value-dialog-text"
                defaultMessage='Are you sure you want to delete "{name}" value? If you delete it you won’t be able to assign it to any of the products with "{attributeName}" attribute.'
                id="no3Ygn"
                values={{
                  attributeName,
                  name,
                }}
              />
            ) : (
              <FormattedMessage
                id="JyQoES"
                defaultMessage='Are you sure you want to delete "{name}" value?'
                description="delete attribute value"
                values={{
                  name,
                }}
              />
            )
          }
        >
          <FormattedMessage
            id="WWV8aZ"
            defaultMessage="Delete attribute value"
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

AttributeValueDeleteDialog.displayName = "AttributeValueDeleteDialog";
