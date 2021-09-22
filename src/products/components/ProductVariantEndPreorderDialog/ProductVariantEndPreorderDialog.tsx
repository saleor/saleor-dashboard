import { DialogContentText } from "@material-ui/core";
import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import React from "react";
import { useIntl } from "react-intl";

export interface ProductVariantEndPreorderDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  variantGlobalSoldUnits?: number;
}

const ProductVariantEndPreorderDialog: React.FC<ProductVariantEndPreorderDialogProps> = ({
  confirmButtonState,
  open,
  onClose,
  onConfirm,
  variantGlobalSoldUnits
}) => {
  const intl = useIntl();

  return (
    <ActionDialog
      confirmButtonLabel={intl.formatMessage({
        defaultMessage: "ACCEPT",
        description: "button label"
      })}
      confirmButtonState={confirmButtonState}
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={intl.formatMessage({
        defaultMessage: "Ending Preorder",
        description: "dialog header"
      })}
      variant="default"
    >
      <DialogContentText>
        {intl.formatMessage(
          {
            defaultMessage:
              "You are about to end your products preorder. You have sold {variantGlobalSoldUnits} units of this variant. Sold units will be allocated at appropriate warehouses. Remember to add remaining threshold stock to warehouses."
          },
          {
            variantGlobalSoldUnits
          }
        )}
      </DialogContentText>
    </ActionDialog>
  );
};
ProductVariantEndPreorderDialog.displayName = "ProductVariantEndPreorderDialog";
export default ProductVariantEndPreorderDialog;
