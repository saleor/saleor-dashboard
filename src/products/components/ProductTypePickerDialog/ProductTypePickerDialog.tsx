// @ts-strict-ignore
import ActionDialog from "@dashboard/components/ActionDialog";
import { Combobox } from "@dashboard/components/Combobox";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { FetchMoreProps } from "@dashboard/types";
import { Option } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { messages } from "./messages";

export interface ProductTypePickerDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  productTypes?: Option[];
  fetchProductTypes: (data: string) => void;
  fetchMoreProductTypes: FetchMoreProps;
  onClose: () => void;
  onConfirm: (choice: string) => void;
}

const ProductTypePickerDialog = ({
  confirmButtonState,
  open,
  productTypes,
  fetchProductTypes,
  fetchMoreProductTypes,
  onClose,
  onConfirm,
}: ProductTypePickerDialogProps) => {
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
      size="xs"
    >
      <Combobox
        data-test-id="dialog-product-type"
        label={intl.formatMessage(messages.productType)}
        options={productTypes}
        fetchOptions={fetchProductTypes}
        fetchMore={fetchMoreProductTypes}
        name="productType"
        value={{
          label: productTypeDisplayValue,
          value: choice,
        }}
        onChange={e => setChoice(e.target.value)}
      />
    </ActionDialog>
  );
};

ProductTypePickerDialog.displayName = "ProductTypePickerDialog";
export default ProductTypePickerDialog;
