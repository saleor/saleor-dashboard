import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

export interface ProductVariantDeleteDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  name: string;
  onClose: () => any;
  onConfirm?: () => any;
}

const ProductVariantDeleteDialog = (props: ProductVariantDeleteDialogProps) => {
  const { confirmButtonState, name, open, onConfirm, onClose } = props;

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="sm">
        <DashboardModal.Header>
          <FormattedMessage
            id="GFJabu"
            defaultMessage="Delete Variant"
            description="dialog header"
          />
        </DashboardModal.Header>

        <Text>
          <FormattedMessage
            id="WwNtFn"
            defaultMessage="Are you sure you want to delete {name}?"
            description="delete product variant"
            values={{
              name,
            }}
          />
        </Text>

        <DashboardModal.Actions>
          <BackButton onClick={onClose} />
          <ConfirmButton
            transitionState={confirmButtonState}
            variant="error"
            onClick={onConfirm}
            data-test-id="delete-variant-button"
          >
            <FormattedMessage id="rbkmfG" defaultMessage="Delete variant" description="button" />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

ProductVariantDeleteDialog.displayName = "ProductVariantDeleteDialog";
export default ProductVariantDeleteDialog;
