import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { buttonMessages } from "@dashboard/intl";
import { type DialogProps } from "@dashboard/types";
import { Box } from "@saleor/macaw-ui-next";
import type * as React from "react";
import { useIntl } from "react-intl";

import BackButton from "../BackButton";
import { DashboardModal, type DashboardModalContentSize } from "../Modal";
import { type ActionDialogVariant } from "./types";

export interface ActionDialogProps extends DialogProps {
  children?: React.ReactNode;
  confirmButtonLabel?: string;
  confirmButtonState: ConfirmButtonTransitionState;
  disabled?: boolean;
  title: string;
  subtitle?: React.ReactNode;
  variant?: ActionDialogVariant;
  backButtonText?: string;
  onConfirm: () => any;
  size?: DashboardModalContentSize;
}

const ActionDialog = ({
  children,
  open,
  title,
  subtitle,
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
        <DashboardModal.Header subtitle={subtitle}>{title}</DashboardModal.Header>
        {children ? (
          <DashboardModal.Body>
            <DashboardModal.Inset>
              <Box fontSize={3}>{children}</Box>
            </DashboardModal.Inset>
          </DashboardModal.Body>
        ) : null}
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
