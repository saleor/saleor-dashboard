import ActionDialog from "@dashboard/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { FormattedMessage, useIntl } from "react-intl";

import messages from "./messages";

export interface AttributeUnassignDialogProps {
  title: string;
  attributeName: string;
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  itemTypeName: string;
  onClose: () => void;
  onConfirm: () => void;
}

const AttributeUnassignDialog = ({
  title,
  attributeName,
  confirmButtonState,
  open,
  itemTypeName,
  onClose,
  onConfirm,
}: AttributeUnassignDialogProps) => {
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
