import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { DialogProps } from "@saleor/types";
import React from "react";

import { ConfirmButtonTransitionState } from "../ConfirmButton/ConfirmButton";
import DialogButtons from "./DialogButtons";
import { ActionDialogVariant } from "./types";

interface ActionDialogProps extends DialogProps {
  children?: React.ReactNode;
  confirmButtonLabel?: string;
  confirmButtonState: ConfirmButtonTransitionState;
  disabled?: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  title: string;
  variant?: ActionDialogVariant;
  onConfirm();
}

const ActionDialog: React.FC<ActionDialogProps> = props => {
  const { children, open, title, onClose, variant, ...rest } = props;

  return (
    <Dialog fullWidth onClose={onClose} open={open} {...rest}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogButtons {...rest} onClose={onClose} variant={variant} />
    </Dialog>
  );
};

ActionDialog.defaultProps = {
  maxWidth: "xs"
};

ActionDialog.displayName = "ActionDialog";
export default ActionDialog;
