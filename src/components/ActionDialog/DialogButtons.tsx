import { Button, DialogActions } from "@material-ui/core";
import { buttonMessages } from "@saleor/intl";
import { makeStyles } from "@saleor/theme";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ConfirmButton, {
  ConfirmButtonTransitionState
} from "../ConfirmButton/ConfirmButton";
import { ActionDialogVariant } from "./types";

const useStyles = makeStyles(
  theme => ({
    deleteButton: {
      "&:hover": {
        backgroundColor: theme.palette.error.main
      },
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText
    }
  }),
  { name: "ActionDialog" }
);

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

  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <DialogActions>
      {children}
      {showBackButton && (
        <Button data-test="back" onClick={onClose} color="secondary">
          <FormattedMessage {...buttonMessages.back} />
        </Button>
      )}
      {variant !== "info" && (
        <ConfirmButton
          disabled={disabled}
          transitionState={confirmButtonState}
          color="primary"
          variant="contained"
          onClick={onConfirm}
          className={classNames({
            [classes.deleteButton]: variant === "delete"
          })}
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
