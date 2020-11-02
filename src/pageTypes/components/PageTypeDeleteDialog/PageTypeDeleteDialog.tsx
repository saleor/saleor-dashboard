import DialogContentText from "@material-ui/core/DialogContentText";
import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface PageTypeDeleteDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  name: string;
  hasPages: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const PageTypeDeleteDialog: React.FC<PageTypeDeleteDialogProps> = ({
  confirmButtonState,
  open,
  name,
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
        defaultMessage: "Delete Page Type",
        description: "dialog header"
      })}
      variant="delete"
    >
      <DialogContentText>
        {hasPages ? (
          <FormattedMessage
            defaultMessage="Page Type you want to delete is used by some pages. Deleting this page type will also delete those pages. Are you sure you want to delete {name}? After doing so you won’t be able to revert changes."
            description="delete page type with its pages"
            values={{
              name: <strong>{name}</strong>
            }}
          />
        ) : (
          <FormattedMessage
            defaultMessage="Are you sure you want to delete {name}? After doing so you won’t be able to revert changes."
            description="delete page type"
            values={{
              name: <strong>{name}</strong>
            }}
          />
        )}
      </DialogContentText>
    </ActionDialog>
  );
};
PageTypeDeleteDialog.displayName = "PageTypeDeleteDialog";
export default PageTypeDeleteDialog;
