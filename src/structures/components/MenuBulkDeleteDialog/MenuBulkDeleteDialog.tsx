import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { Box } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

interface MenuBulkDeleteDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  count: number;
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
}

export const MenuBulkDeleteDialog = ({
  confirmButtonState,
  count,
  onClose,
  onConfirm,
  open,
}: MenuBulkDeleteDialogProps): JSX.Element => {
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
            <Box>
              <FormattedMessage
                id="aWzvoq"
                defaultMessage="{counter,plural,one{Are you sure you want to delete this structure?} other{Are you sure you want to delete {displayQuantity} structures?}}"
                values={{
                  counter: count,
                  displayQuantity: <strong>{count}</strong>,
                }}
              />
            </Box>
          }
        >
          <FormattedMessage
            description="dialog header"
            id="wAGThK"
            defaultMessage="Delete structures"
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

MenuBulkDeleteDialog.displayName = "MenuBulkDeleteDialog";
