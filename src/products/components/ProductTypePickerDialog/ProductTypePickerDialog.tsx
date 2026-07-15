// @ts-strict-ignore
import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import useDebounce from "@dashboard/hooks/useDebounce";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { buttonMessages } from "@dashboard/intl";
import { type FetchMoreProps } from "@dashboard/types";
import { DynamicCombobox, type Option } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

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

export const ProductTypePickerDialog = ({
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
    <DashboardModal open={open} onChange={onClose}>
      <DashboardModal.Content size="xs">
        <DashboardModal.Header>
          <FormattedMessage {...messages.selectProductType} />
        </DashboardModal.Header>

        <DashboardModal.Body>
          <DashboardModal.Inset>
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
          </DashboardModal.Inset>
        </DashboardModal.Body>

        <DashboardModal.Actions>
          <BackButton onClick={onClose} />
          <ConfirmButton
            data-test-id="submit"
            transitionState={confirmButtonState}
            onClick={() => onConfirm(selectedOption?.value ?? "")}
            disabled={!selectedOption}
          >
            <FormattedMessage {...buttonMessages.confirm} />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

ProductTypePickerDialog.displayName = "ProductTypePickerDialog";
