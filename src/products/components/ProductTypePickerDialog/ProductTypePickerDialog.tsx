// @ts-strict-ignore
import ActionDialog from "@dashboard/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import useDebounce from "@dashboard/hooks/useDebounce";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { FetchMoreProps } from "@dashboard/types";
import { DynamicCombobox, Option } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";

interface ProductTypePickerDialogProps {
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
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  const debouncedFetchProductTypes = useDebounce(fetchProductTypes, 500);

  useModalDialogOpen(open, {
    onClose: () => {
      setSelectedOption(null);
      fetchProductTypes("");
    },
  });

  const handleScrollEnd = () => {
    if (fetchMoreProductTypes?.hasMore) {
      fetchMoreProductTypes?.onFetchMore();
    }
  };

  return (
    <ActionDialog
      confirmButtonState={confirmButtonState}
      open={open}
      onClose={onClose}
      onConfirm={() => onConfirm(selectedOption?.value ?? "")}
      title={intl.formatMessage(messages.selectProductType)}
      disabled={!selectedOption}
      size="xs"
    >
      <DynamicCombobox
        data-test-id="dialog-product-type"
        label={intl.formatMessage(messages.productType)}
        options={productTypes ?? []}
        name="productType"
        size="small"
        value={selectedOption}
        onChange={setSelectedOption}
        onInputValueChange={debouncedFetchProductTypes}
        onFocus={() => fetchProductTypes("")}
        onScrollEnd={handleScrollEnd}
        loading={fetchMoreProductTypes?.loading}
      />
    </ActionDialog>
  );
};

ProductTypePickerDialog.displayName = "ProductTypePickerDialog";
export default ProductTypePickerDialog;
