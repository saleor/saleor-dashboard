import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { FormattedMessage } from "react-intl";

interface ProductVariantDeleteDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  name: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const ProductVariantDeleteDialog = ({
  confirmButtonState,
  name,
  open,
  onConfirm,
  onClose,
}: ProductVariantDeleteDialogProps) => {
  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="xs">
        <DashboardModal.Header
          subtitle={
            <FormattedMessage
              id="WwNtFn"
              defaultMessage="Are you sure you want to delete {name}?"
              description="delete product variant"
              values={{ name }}
            />
          }
        >
          <FormattedMessage
            id="GFJabu"
            defaultMessage="Delete Variant"
            description="dialog header"
          />
        </DashboardModal.Header>

        <DashboardModal.Actions>
          <BackButton onClick={onClose} />
          <ConfirmButton
            data-test-id="delete-variant-button"
            onClick={onConfirm}
            transitionState={confirmButtonState}
            variant="error"
          >
            <FormattedMessage id="rbkmfG" defaultMessage="Delete variant" description="button" />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

ProductVariantDeleteDialog.displayName = "ProductVariantDeleteDialog";
