import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DialogProps } from "@dashboard/types";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";

import BackButton from "../BackButton";
import { DASHBOARD_MODAL_WIDTH, DashboardModal } from "../Modal";
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

// TODO: migrate alle old components to new dialog MERX-649
const NewActionDialog: React.FC<NewActionDialogProps> = props => {
  const { children, open, title, onClose, variant, maxWidth, ...rest } = props;

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content __maxWidth={DASHBOARD_MODAL_WIDTH} width="100%">
        <DashboardModal.Title>{title}</DashboardModal.Title>

        <Text>{children}</Text>

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
