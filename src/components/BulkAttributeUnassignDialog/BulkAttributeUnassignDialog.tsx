import ActionDialog from "@dashboard/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
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

const BulkAttributeUnassignDialog = ({
  title,
  attributeQuantity,
  confirmButtonState,
  open,
  itemTypeName,
  onClose,
  onConfirm,
}: BulkAttributeUnassignDialogProps) => {
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
      <FormattedMessage
        {...messages.content}
        values={{
          attributeQuantity: <strong>{attributeQuantity}</strong>,
          counter: attributeQuantity,
          itemTypeName: <strong>{itemTypeName}</strong>,
        }}
      />
    </ActionDialog>
  );
};

BulkAttributeUnassignDialog.displayName = "BulkAttributeUnassignDialog";
export default BulkAttributeUnassignDialog;
