import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { EntityBackgroundImageDeleteDialog } from "@dashboard/components/EntityBackgroundImageField/EntityBackgroundImageDeleteDialog";
import { FormattedMessage } from "react-intl";

interface CollectionDeleteImageDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
}

export const CollectionDeleteImageDialog = ({
  confirmButtonState,
  onClose,
  onConfirm,
  open,
}: CollectionDeleteImageDialogProps) => (
  <EntityBackgroundImageDeleteDialog
    confirmButtonState={confirmButtonState}
    onClose={onClose}
    onConfirm={onConfirm}
    open={open}
    subtitle={
      <FormattedMessage
        id="MxhVZv"
        defaultMessage="Are you sure you want to delete collection's image?"
      />
    }
  />
);

CollectionDeleteImageDialog.displayName = "CollectionDeleteImageDialog";
