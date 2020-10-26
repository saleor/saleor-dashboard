import DialogContentText from "@material-ui/core/DialogContentText";
import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import React from "react";
import { FormattedMessage } from "react-intl";

export interface AttributeUnassignDialogProps {
  title: string;
  attributeName: string;
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  itemTypeName: string;
  onClose: () => void;
  onConfirm: () => void;
}

const AttributeUnassignDialog: React.FC<AttributeUnassignDialogProps> = ({
  title,
  attributeName,
  confirmButtonState,
  open,
  itemTypeName,
  onClose,
  onConfirm
}) => (
  <ActionDialog
    confirmButtonState={confirmButtonState}
    open={open}
    onClose={onClose}
    onConfirm={onConfirm}
    title={title}
  >
    <DialogContentText>
      <FormattedMessage
        defaultMessage="Are you sure you want to unassign {attributeName} from {itemTypeName}?"
        values={{
          attributeName: <strong>{attributeName}</strong>,
          itemTypeName: <strong>{itemTypeName}</strong>
        }}
      />
    </DialogContentText>
  </ActionDialog>
);
AttributeUnassignDialog.displayName = "AttributeUnassignDialog";
export default AttributeUnassignDialog;
