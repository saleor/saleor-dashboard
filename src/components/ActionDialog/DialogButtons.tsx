import { DialogActions } from "@material-ui/core";
import { buttonMessages } from "@saleor/intl";
import { Button } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ConfirmButton, { ConfirmButtonTransitionState } from "../ConfirmButton";
import { ActionDialogVariant } from "./types";

interface DialogButtonsProps {
  onClose: () => void;
  confirmButtonLabel?: string;
  confirmButtonState?: ConfirmButtonTransitionState;
  disabled?: boolean;
  variant?: ActionDialogVariant;
  children?: React.ReactNode;
  showBackButton?: boolean;
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
    showBackButton = true
  } = props;

  const intl = useIntl();

  return (
    <DialogActions>
      {children}
      {showBackButton && (
        <Button
          data-test="back"
          color="text"
          onClick={onClose}
          variant="secondary"
        >
          <FormattedMessage {...buttonMessages.back} />
        </Button>
      )}
      {variant !== "info" && (
        <ConfirmButton
          disabled={disabled}
          transitionState={confirmButtonState}
          onClick={onConfirm}
          error={variant === "delete"}
          data-test-id="submit"
          data-test="submit"
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
  variant: "default"
};

export default DialogButtons;
