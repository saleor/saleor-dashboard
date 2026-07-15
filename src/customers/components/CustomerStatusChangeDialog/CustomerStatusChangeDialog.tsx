import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

interface CustomerStatusChangeDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  email: ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
  variant: "activate" | "deactivate";
}

export const CustomerStatusChangeDialog = ({
  confirmButtonState,
  email,
  onClose,
  onConfirm,
  open,
  variant,
}: CustomerStatusChangeDialogProps) => {
  const isSubmitting = confirmButtonState === "loading";
  const isDeactivate = variant === "deactivate";

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
            isDeactivate ? (
              <FormattedMessage
                description="deactivate customer dialog, content"
                id="genRi+"
                defaultMessage="Are you sure you want to deactivate {email}? They will no longer be able to sign in or place new orders."
                values={{ email }}
              />
            ) : (
              <FormattedMessage
                description="activate customer dialog, content"
                id="6a075o"
                defaultMessage="Are you sure you want to activate {email}? They will be able to sign in and place new orders."
                values={{ email }}
              />
            )
          }
        >
          {isDeactivate ? (
            <FormattedMessage
              description="deactivate customer dialog, header"
              id="8maISA"
              defaultMessage="Deactivate customer"
            />
          ) : (
            <FormattedMessage
              description="activate customer dialog, header"
              id="Le6/M7"
              defaultMessage="Activate customer"
            />
          )}
        </DashboardModal.Header>

        <DashboardModal.Actions>
          <BackButton disabled={isSubmitting} onClick={handleClose} />
          <ConfirmButton
            data-test-id="submit"
            disabled={isSubmitting}
            onClick={onConfirm}
            transitionState={confirmButtonState}
            {...(isDeactivate ? { variant: "error" as const } : {})}
          >
            {isDeactivate ? (
              <FormattedMessage
                description="deactivate customer dialog, confirm button label"
                id="weguIe"
                defaultMessage="Deactivate"
              />
            ) : (
              <FormattedMessage
                description="activate customer dialog, confirm button label"
                id="Ruw3iJ"
                defaultMessage="Activate"
              />
            )}
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

CustomerStatusChangeDialog.displayName = "CustomerStatusChangeDialog";
