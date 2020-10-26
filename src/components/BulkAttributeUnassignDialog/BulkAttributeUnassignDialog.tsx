import DialogContentText from "@material-ui/core/DialogContentText";
import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import React from "react";
import { FormattedMessage } from "react-intl";

export interface BulkAttributeUnassignDialogProps {
  title: string;
  attributeQuantity: number;
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  itemTypeName: string;
  onClose: () => void;
  onConfirm: () => void;
}

const BulkAttributeUnassignDialog: React.FC<BulkAttributeUnassignDialogProps> = ({
  title,
  attributeQuantity,
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
        defaultMessage="{counter,plural,one{Are you sure you want to unassign this attribute from {itemTypeName}?} other{Are you sure you want to unassign {attributeQuantity} attributes from {itemTypeName}?}}"
        description="unassign multiple attributes from item"
        values={{
          attributeQuantity: <strong>{attributeQuantity}</strong>,
          counter: attributeQuantity,
          itemTypeName: <strong>{itemTypeName}</strong>
        }}
      />
    </DialogContentText>
  </ActionDialog>
);
BulkAttributeUnassignDialog.displayName = "BulkAttributeUnassignDialog";
export default BulkAttributeUnassignDialog;
