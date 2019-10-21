import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { buttonMessages } from "@saleor/intl";
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "../ConfirmButton/ConfirmButton";

const styles = (theme: Theme) =>
  createStyles({
    deleteButton: {
      "&:hover": {
        backgroundColor: theme.palette.error.main
      },
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText
    }
  });

interface ActionDialogProps extends WithStyles<typeof styles> {
  children?: React.ReactNode;
  confirmButtonLabel?: string;
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  title: string;
  variant?: "default" | "delete";
  onClose?();
  onConfirm();
}

const ActionDialog = withStyles(styles, { name: "ActionDialog" })(
  ({
    children,
    classes,
    confirmButtonLabel,
    confirmButtonState,
    open,
    title,
    variant,
    onConfirm,
    onClose
  }: ActionDialogProps) => {
    const intl = useIntl();

    return (
      <Dialog onClose={onClose} open={open}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button onClick={onClose}>
            <FormattedMessage {...buttonMessages.back} />
          </Button>
          <ConfirmButton
            transitionState={confirmButtonState}
            color="primary"
            variant="contained"
            onClick={onConfirm}
            className={classNames({
              [classes.deleteButton]: variant === "delete"
            })}
          >
            {confirmButtonLabel ||
              (variant === "delete"
                ? intl.formatMessage(buttonMessages.delete)
                : intl.formatMessage(buttonMessages.confirm))}
          </ConfirmButton>
        </DialogActions>
      </Dialog>
    );
  }
);
ActionDialog.displayName = "ActionDialog";
export default ActionDialog;
