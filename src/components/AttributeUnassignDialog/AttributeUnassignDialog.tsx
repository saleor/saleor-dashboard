import ActionDialog from "@dashboard/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import messages from "./messages";

interface AttributeUnassignDialogProps {
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
      <FormattedMessage
        {...messages.content}
        values={{
          attributeName: <strong>{attributeName}</strong>,
          itemTypeName: <strong>{itemTypeName}</strong>,
        }}
      />
    </ActionDialog>
  );
};

AttributeUnassignDialog.displayName = "AttributeUnassignDialog";
export default AttributeUnassignDialog;
