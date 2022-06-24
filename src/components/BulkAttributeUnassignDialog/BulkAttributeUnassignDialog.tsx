import { DialogContentText } from "@material-ui/core";
import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import messages from "./messages";

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
  onConfirm,
}) => {
  const intl = useIntl();

  return (
    <ActionDialog
      confirmButtonState={confirmButtonState}
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      confirmButtonLabel={intl.formatMessage(messages.confirmBtn)}
    >
      <DialogContentText>
        <FormattedMessage
          {...messages.content}
          values={{
            attributeQuantity: <strong>{attributeQuantity}</strong>,
            counter: attributeQuantity,
            itemTypeName: <strong>{itemTypeName}</strong>,
          }}
        />
      </DialogContentText>
    </ActionDialog>
  );
};
BulkAttributeUnassignDialog.displayName = "BulkAttributeUnassignDialog";
export default BulkAttributeUnassignDialog;
