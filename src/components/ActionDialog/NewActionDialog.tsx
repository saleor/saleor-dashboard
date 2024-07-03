import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DialogProps } from "@dashboard/types";
import React from "react";

import BackButton from "../BackButton";
import { DashboardModal } from "../Modal";
import { ActionDialogVariant, Size } from "./types";

export interface NewActionDialogProps extends DialogProps {
  children?: React.ReactNode;
  confirmButtonLabel?: string;
  confirmButtonState: ConfirmButtonTransitionState;
  disabled?: boolean;
  maxWidth?: Size | false;
  title: string;
  variant?: ActionDialogVariant;
  backButtonText?: string;
  onConfirm: () => any;
}

// This is a temporary workaround to avoid migrating and changing all the places where old dialog is used
const NewActionDialog: React.FC<NewActionDialogProps> = props => {
  const { children, open, title, onClose, variant, maxWidth, ...rest } = props;

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content __maxWidth={600} __width="calc(100% - 64px)">
        <DashboardModal.Title>{title}</DashboardModal.Title>

        {children}

        <DashboardModal.Actions>
          <BackButton onClick={onClose}>{rest?.backButtonText}</BackButton>
          <ConfirmButton
            transitionState={rest?.confirmButtonState}
            disabled={rest?.disabled}
            onClick={rest?.onConfirm}
            variant={variant === "delete" ? "error" : "primary"}
            data-test-id="submit"
          >
            {rest?.confirmButtonLabel}
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

NewActionDialog.defaultProps = {
  maxWidth: "xs",
};
NewActionDialog.displayName = "ActionDialog";
export default NewActionDialog;
