import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { FormattedMessage, useIntl } from "react-intl";

interface UnassignDialogProps {
  open: boolean;
  confirmButtonState: ConfirmButtonTransitionState;
  idsLength: number;
  closeModal: () => void;
  onConfirm: () => void;
}

export const UnassignDialog = ({
  closeModal,
  confirmButtonState,
  idsLength,
  onConfirm,
  open,
}: UnassignDialogProps) => {
  const intl = useIntl();
  const isSubmitting = confirmButtonState === "loading";

  const handleClose = (): void => {
    if (isSubmitting) {
      return;
    }

    closeModal();
  };

  return (
    <DashboardModal onChange={handleClose} open={open}>
      <DashboardModal.Content size="xs">
        <DashboardModal.Header
          subtitle={
            <FormattedMessage
              id="AHK0K9"
              defaultMessage="{counter,plural,one{Are you sure you want to unassign this product?} other{Are you sure you want to unassign {displayQuantity} products?}}"
              description="dialog content"
              values={{
                counter: idsLength,
                displayQuantity: <strong>{idsLength}</strong>,
              }}
            />
          }
        >
          <FormattedMessage
            id="Gfbp36"
            defaultMessage="Unassign Products From Shipping"
            description="dialog header"
          />
        </DashboardModal.Header>

        <DashboardModal.Actions>
          <BackButton disabled={isSubmitting} onClick={handleClose} />
          <ConfirmButton
            data-test-id="submit"
            disabled={isSubmitting}
            onClick={onConfirm}
            transitionState={confirmButtonState}
          >
            {intl.formatMessage({
              id: "p/Fd7s",
              defaultMessage: "Unassign and save",
              description: "unassign products from shipping rate and save, button",
            })}
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

UnassignDialog.displayName = "UnassignDialog";
