import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { buttonMessages } from "@saleor/intl";
import { DialogProps } from "@saleor/types";
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "../ConfirmButton/ConfirmButton";

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

interface ActionDialogProps extends DialogProps {
  children?: React.ReactNode;
  confirmButtonLabel?: string;
  confirmButtonState: ConfirmButtonTransitionState;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  title: string;
  variant?: "default" | "delete";
  onConfirm();
}

const ActionDialog: React.FC<ActionDialogProps> = props => {
  const {
    children,
    confirmButtonLabel,
    confirmButtonState,
    open,
    title,
    variant,
    onConfirm,
    onClose,
    ...rest
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <Dialog fullWidth onClose={onClose} open={open} {...rest}>
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
};

ActionDialog.defaultProps = {
  maxWidth: "xs",
  variant: "default"
};
ActionDialog.displayName = "ActionDialog";
export default ActionDialog;
