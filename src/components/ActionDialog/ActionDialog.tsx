import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DialogProps } from "@dashboard/types";
import React from "react";

import BackButton from "../BackButton";
import { DASHBOARD_MODAL_WIDTH, DashboardModal } from "../Modal";
import { ActionDialogVariant } from "./types";

export interface ActionDialogProps extends DialogProps {
  children?: React.ReactNode;
  confirmButtonLabel?: string;
  confirmButtonState: ConfirmButtonTransitionState;
  disabled?: boolean;
  title: string;
  variant?: ActionDialogVariant;
  backButtonText?: string;
  onConfirm: () => any;
}

const ActionDialog = ({
  children,
  open,
  title,
  onClose,
  variant,
  confirmButtonState,
  backButtonText,
  disabled,
  onConfirm,
  confirmButtonLabel,
}: ActionDialogProps) => {
  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content __maxWidth={DASHBOARD_MODAL_WIDTH} width="100%">
        <DashboardModal.Title>{title}</DashboardModal.Title>

        {children}

        <DashboardModal.Actions>
          <BackButton onClick={onClose}>{backButtonText}</BackButton>
          <ConfirmButton
            transitionState={confirmButtonState}
            disabled={disabled}
            onClick={onConfirm}
            variant={variant === "delete" ? "error" : "primary"}
            data-test-id="submit"
          >
            {confirmButtonLabel}
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

ActionDialog.displayName = "ActionDialog";
export default ActionDialog;
