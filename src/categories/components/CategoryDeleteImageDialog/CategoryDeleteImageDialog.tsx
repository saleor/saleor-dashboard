import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { EntityBackgroundImageDeleteDialog } from "@dashboard/components/EntityBackgroundImageField/EntityBackgroundImageDeleteDialog";
import { FormattedMessage } from "react-intl";

interface CategoryDeleteImageDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
}

export const CategoryDeleteImageDialog = ({
  confirmButtonState,
  onClose,
  onConfirm,
  open,
}: CategoryDeleteImageDialogProps) => (
  <EntityBackgroundImageDeleteDialog
    confirmButtonState={confirmButtonState}
    onClose={onClose}
    onConfirm={onConfirm}
    open={open}
    subtitle={
      <FormattedMessage
        id="9jXdkz"
        defaultMessage="Are you sure you want to delete this category's background image?"
      />
    }
  />
);
