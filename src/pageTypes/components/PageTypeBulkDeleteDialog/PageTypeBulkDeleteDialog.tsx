import DialogContentText from "@material-ui/core/DialogContentText";
import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
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
  onConfirm
}) => {
  const intl = useIntl();

  return (
    <ActionDialog
      confirmButtonState={confirmButtonState}
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={intl.formatMessage({
        defaultMessage: "Delete Page Types",
        description: "dialog header"
      })}
      variant="delete"
    >
      <DialogContentText>
        {hasPages ? (
          <FormattedMessage
            defaultMessage="{counter,plural,one{Page Type you want to delete is used by some pages. Deleting this page type will also delete those pages. Are you sure you want to delete this page type? After doing so you won’t be able to revert changes.} other{Page Types you want to delete are used by some pages. Deleting these page types will also delete those pages. Are you sure you want to delete {displayQuantity} page types? After doing so you won’t be able to revert changes.}}"
            description="delete page types with its pages"
            values={{
              counter: quantity,
              displayQuantity: <strong>{quantity}</strong>
            }}
          />
        ) : (
          <FormattedMessage
            defaultMessage="{counter,plural,one{Are you sure you want to delete this page type? After doing so you won’t be able to revert changes.} other{Are you sure you want to delete {displayQuantity} page types? After doing so you won’t be able to revert changes.}}"
            description="delete page types"
            values={{
              counter: quantity,
              displayQuantity: <strong>{quantity}</strong>
            }}
          />
        )}
      </DialogContentText>
    </ActionDialog>
  );
};
PageTypeBulkDeleteDialog.displayName = "PageTypeBulkDeleteDialog";
export default PageTypeBulkDeleteDialog;
