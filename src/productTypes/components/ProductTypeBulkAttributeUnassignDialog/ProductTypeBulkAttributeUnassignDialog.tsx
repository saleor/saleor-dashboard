import DialogContentText from "@material-ui/core/DialogContentText";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";

export interface ProductTypeBulkAttributeUnassignDialogProps {
  attributeQuantity: number;
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  productTypeName: string;
  onClose: () => void;
  onConfirm: () => void;
}

const ProductTypeBulkAttributeUnassignDialog: React.FC<
  ProductTypeBulkAttributeUnassignDialogProps
> = ({
  attributeQuantity,
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
        defaultMessage: "Unassign Attribute from Product Type",
        description: "dialog header"
      })}
    >
      <DialogContentText>
        <FormattedMessage
          defaultMessage="Are you sure you want to unassign {counter, plural,
            one {this attribute}
            other {{displayQuantity} attributes}
          } from {productTypeName}?"
          description="unassign multiple attributes from product type"
          values={{
            attributeQuantity: <strong>{attributeQuantity}</strong>,
            counter: attributeQuantity,
            productTypeName: <strong>{productTypeName}</strong>
          }}
        />
      </DialogContentText>
    </ActionDialog>
  );
};
ProductTypeBulkAttributeUnassignDialog.displayName =
  "ProductTypeBulkAttributeUnassignDialog";
export default ProductTypeBulkAttributeUnassignDialog;
