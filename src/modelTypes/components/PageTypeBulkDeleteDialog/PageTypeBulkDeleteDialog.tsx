import ActionDialog from "@dashboard/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface PageTypeBulkDeleteDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  quantity: number;
  hasPages: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const PageTypeBulkDeleteDialog: React.FC<PageTypeBulkDeleteDialogProps> = ({
  confirmButtonState,
  open,
  quantity,
  hasPages,
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
      title={intl.formatMessage({
        id: "/jU+sI",
        defaultMessage: "Delete model types",
        description: "dialog header",
      })}
      variant="delete"
    >
      {hasPages ? (
        <FormattedMessage
          id="45W13E"
          defaultMessage="{counter,plural,one{Model type you want to delete is used by some models. Deleting this model type will also delete those models. Are you sure you want to delete this model type? After doing so you won’t be able to revert changes.} other{Model types you want to delete are used by some models. Deleting these model types will also delete those models. Are you sure you want to delete {displayQuantity} model types? After doing so you won’t be able to revert changes.}}"
          description="delete model types with its models"
          values={{
            counter: quantity,
            displayQuantity: <strong>{quantity}</strong>,
          }}
        />
      ) : (
        <FormattedMessage
          id="KIsu7m"
          defaultMessage="{counter,plural,one{Are you sure you want to delete this model type? After doing so you won’t be able to revert changes.} other{Are you sure you want to delete {displayQuantity} model types? After doing so you won’t be able to revert changes.}}"
          description="delete model types"
          values={{
            counter: quantity,
            displayQuantity: <strong>{quantity}</strong>,
          }}
        />
      )}
    </ActionDialog>
  );
};

PageTypeBulkDeleteDialog.displayName = "PageTypeBulkDeleteDialog";
export default PageTypeBulkDeleteDialog;
