import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { buttonMessages } from "@dashboard/intl";
import { DialogProps } from "@dashboard/types";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import BackButton from "../BackButton";
import { DashboardModal, DashboardModalContentSize } from "../Modal";
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
  size?: DashboardModalContentSize;
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
  size = "sm",
}: ActionDialogProps) => {
  const intl = useIntl();

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size={size}>
        <DashboardModal.Header>{title}</DashboardModal.Header>
        <Box fontSize={3}>{children}</Box>
        <DashboardModal.Actions>
          <BackButton onClick={onClose}>{backButtonText}</BackButton>
          {variant !== "info" && (
            <ConfirmButton
              transitionState={confirmButtonState}
              disabled={disabled}
              onClick={onConfirm}
              variant={variant === "delete" ? "error" : "primary"}
              data-test-id="submit"
            >
              {confirmButtonLabel ||
                (variant === "delete"
                  ? intl.formatMessage(buttonMessages.delete)
                  : intl.formatMessage(buttonMessages.confirm))}
            </ConfirmButton>
          )}
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

ActionDialog.displayName = "ActionDialog";
export default ActionDialog;
