import ActionDialog from "@dashboard/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import useDebounce from "@dashboard/hooks/useDebounce";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { commonMessages } from "@dashboard/intl";
import { FetchMoreProps } from "@dashboard/types";
import { DynamicCombobox, Option } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
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
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const debouncedFetch = useDebounce(fetchProductTypes, 500);

  useModalDialogOpen(open, {
    onClose: () => {
      setSelectedOption(null);
      fetchProductTypes("");
    },
  });

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
        value={selectedOption}
        onChange={setSelectedOption}
        onInputValueChange={debouncedFetch}
        onFocus={() => fetchProductTypes("")}
        onScrollEnd={() => {
          if (fetchMoreProductTypes?.hasMore) {
            fetchMoreProductTypes.onFetchMore();
          }
        }}
        loading={fetchMoreProductTypes?.loading || fetchMoreProductTypes?.hasMore}
        locale={{
          loadingText: intl.formatMessage(commonMessages.loading),
        }}
        size="small"
      />
    </ActionDialog>
  );
};

ProductTypePickerDialog.displayName = "ProductTypePickerDialog";
export default ProductTypePickerDialog;
