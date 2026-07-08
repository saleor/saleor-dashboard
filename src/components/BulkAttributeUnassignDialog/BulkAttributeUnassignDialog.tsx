import ActionDialog from "@dashboard/components/ActionDialog";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { Text } from "@saleor/macaw-ui-next";
import type * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import messages from "./messages";

interface BulkAttributeUnassignDialogProps {
  title: string;
  attributeQuantity: number;
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  itemTypeName: string;
  description?: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
}

const BulkAttributeUnassignDialog = ({
  title,
  attributeQuantity,
  confirmButtonState,
  open,
  itemTypeName,
  description,
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
      {description ? (
        <Text fontSize={3} color="default2" marginTop={4} display="block">
          {description}
        </Text>
      ) : null}
    </ActionDialog>
  );
};

BulkAttributeUnassignDialog.displayName = "BulkAttributeUnassignDialog";
export default BulkAttributeUnassignDialog;
