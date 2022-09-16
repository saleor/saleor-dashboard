import ActionDialog from "@saleor/components/ActionDialog";
import SingleAutocompleteSelectField, {
  SingleAutocompleteChoiceType,
} from "@saleor/components/SingleAutocompleteSelectField";
import useModalDialogOpen from "@saleor/hooks/useModalDialogOpen";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { FetchMoreProps } from "@saleor/types";
import React from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";

export interface ProductTypePickerDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  productTypes?: SingleAutocompleteChoiceType[];
  fetchProductTypes: (data: string) => void;
  fetchMoreProductTypes: FetchMoreProps;
  onClose: () => void;
  onConfirm: (choice: string) => void;
}

const ProductTypePickerDialog: React.FC<ProductTypePickerDialogProps> = ({
  confirmButtonState,
  open,
  productTypes,
  fetchProductTypes,
  fetchMoreProductTypes,
  onClose,
  onConfirm,
}) => {
  const intl = useIntl();
  const [choice, setChoice] = useStateFromProps("");
  const productTypeDisplayValue = productTypes.find(
    productType => productType.value === choice,
  )?.label;

  useModalDialogOpen(open, {
    onClose: () => {
      setChoice("");
      fetchProductTypes("");
    },
  });

  return (
    <ActionDialog
      confirmButtonState={confirmButtonState}
      open={open}
      onClose={onClose}
      onConfirm={() => onConfirm(choice)}
      title={intl.formatMessage(messages.selectProductType)}
      disabled={!choice}
    >
      <SingleAutocompleteSelectField
        displayValue={productTypeDisplayValue}
        name="productType"
        label={intl.formatMessage(messages.productType)}
        choices={productTypes}
        value={choice}
        onChange={e => setChoice(e.target.value)}
        fetchChoices={fetchProductTypes}
        data-test-id="dialog-product-type"
        {...fetchMoreProductTypes}
      />
    </ActionDialog>
  );
};
ProductTypePickerDialog.displayName = "ProductTypePickerDialog";
export default ProductTypePickerDialog;
