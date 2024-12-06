import ActionDialog from "@dashboard/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { FormattedMessage, useIntl } from "react-intl";

export interface AttributeDeleteDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
  name: string;
}

const AttributeDeleteDialog = ({
  name,
  confirmButtonState,
  onClose,
  onConfirm,
  open,
}: AttributeDeleteDialogProps) => {
  const intl = useIntl();

  return (
    <ActionDialog
      open={open}
      onClose={onClose}
      confirmButtonState={confirmButtonState}
      onConfirm={onConfirm}
      variant="delete"
      title={intl.formatMessage({
        id: "JI2Xwp",
        defaultMessage: "Delete attribute",
        description: "dialog title",
      })}
    >
      <FormattedMessage
        id="h1rPPg"
        defaultMessage="Are you sure you want to delete {attributeName}?"
        description="dialog content"
        data-test-id="delete-single-attr-dialog-text"
        values={{
          attributeName: <strong>{name}</strong>,
        }}
      />
    </ActionDialog>
  );
};

AttributeDeleteDialog.displayName = "AttributeDeleteDialog";
export default AttributeDeleteDialog;
