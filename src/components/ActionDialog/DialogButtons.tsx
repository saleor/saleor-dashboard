import { buttonMessages } from "@dashboard/intl";
import { DialogActions } from "@material-ui/core";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import BackButton from "../BackButton";
import ConfirmButton from "../ConfirmButton";
import { ActionDialogVariant } from "./types";

interface DialogButtonsProps {
  onClose: () => void;
  confirmButtonLabel?: string;
  confirmButtonState?: ConfirmButtonTransitionState;
  disabled?: boolean;
  variant?: ActionDialogVariant;
  children?: React.ReactNode;
  showBackButton?: boolean;
  backButtonText?: string;
  onConfirm();
}

const DialogButtons: React.FC<DialogButtonsProps> = props => {
  const {
    confirmButtonLabel,
    confirmButtonState,
    disabled,
    variant,
    onConfirm,
    onClose,
    children,
    showBackButton = true,
    backButtonText,
  } = props;

  const intl = useIntl();

  return (
    <DialogActions>
      {children}
      {showBackButton && (
        <BackButton onClick={onClose}>{backButtonText}</BackButton>
      )}
      {variant !== "info" && (
        <ConfirmButton
          disabled={disabled}
          transitionState={confirmButtonState}
          onClick={onConfirm}
          error={variant === "delete"}
          data-test-id="submit"
        >
          {confirmButtonLabel ||
            (variant === "delete"
              ? intl.formatMessage(buttonMessages.delete)
              : intl.formatMessage(buttonMessages.confirm))}
        </ConfirmButton>
      )}
    </DialogActions>
  );
};

DialogButtons.defaultProps = {
  confirmButtonState: "default",
  variant: "default",
};

export default DialogButtons;
