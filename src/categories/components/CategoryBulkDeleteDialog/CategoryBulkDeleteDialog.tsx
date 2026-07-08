import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { Box } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

interface CategoryBulkDeleteDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  count: number;
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
}

export const CategoryBulkDeleteDialog = ({
  confirmButtonState,
  count,
  onClose,
  onConfirm,
  open,
}: CategoryBulkDeleteDialogProps) => {
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
            <Box display="grid" gap={2}>
              <Box>
                <FormattedMessage
                  id="Pp/7T7"
                  defaultMessage="{counter,plural,one{Are you sure you want to delete this category?} other{Are you sure you want to delete {displayQuantity} categories?}}"
                  values={{
                    counter: count,
                    displayQuantity: <strong>{count}</strong>,
                  }}
                />
              </Box>
              <Box>
                <FormattedMessage
                  id="e+L+q3"
                  defaultMessage="Remember this will also delete all products assigned to this category."
                />
              </Box>
            </Box>
          }
        >
          <FormattedMessage
            id="sG0w22"
            defaultMessage="Delete categories"
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

CategoryBulkDeleteDialog.displayName = "CategoryBulkDeleteDialog";
