import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { Box } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

interface CategoryDeleteDialogProps {
  categoryName: ReactNode;
  confirmButtonState: ConfirmButtonTransitionState;
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
}

export const CategoryDeleteDialog = ({
  categoryName,
  confirmButtonState,
  onClose,
  onConfirm,
  open,
}: CategoryDeleteDialogProps) => {
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
                  id="xRkj2h"
                  defaultMessage="Are you sure you want to delete {categoryName}?"
                  values={{ categoryName }}
                />
              </Box>
              <Box>
                <FormattedMessage
                  id="3DGvA/"
                  defaultMessage="Remember this will also unpin all products assigned to this category, making them unavailable in storefront."
                />
              </Box>
            </Box>
          }
        >
          <FormattedMessage
            id="xo5UIb"
            defaultMessage="Delete category"
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

CategoryDeleteDialog.displayName = "CategoryDeleteDialog";
