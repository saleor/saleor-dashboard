import DialogContentText from "@material-ui/core/DialogContentText";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";

export interface ProductTypeAttributeUnassignDialogProps {
  attributeName: string;
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  productTypeName: string;
  onClose: () => void;
  onConfirm: () => void;
}

const ProductTypeAttributeUnassignDialog: React.FC<
  ProductTypeAttributeUnassignDialogProps
> = ({
  attributeName,
  confirmButtonState,
  open,
  productTypeName,
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
        defaultMessage: "Unassign Attribute From Product Type",
        description: "dialog header"
      })}
    >
      <DialogContentText>
        <FormattedMessage
          defaultMessage="Are you sure you want to unassign {attributeName} from {productTypeName}?"
          values={{
            attributeName: <strong>{attributeName}</strong>,
            productTypeName: <strong>{productTypeName}</strong>
          }}
        />
      </DialogContentText>
    </ActionDialog>
  );
};
ProductTypeAttributeUnassignDialog.displayName =
  "ProductTypeAttributeUnassignDialog";
export default ProductTypeAttributeUnassignDialog;
