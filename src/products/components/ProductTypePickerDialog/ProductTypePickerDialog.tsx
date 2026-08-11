import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import useDebounce from "@dashboard/hooks/useDebounce";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import useNavigator from "@dashboard/hooks/useNavigator";
import { buttonMessages } from "@dashboard/intl";
import { productTypeAddUrl } from "@dashboard/productTypes/urls";
import { type FetchMoreProps } from "@dashboard/types";
import { Box, Button, DynamicCombobox, type Option, Text } from "@saleor/macaw-ui-next";
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
  const navigate = useNavigator();
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [query, setQuery] = useState("");

  const debouncedFetchProductTypes = useDebounce(fetchProductTypes, 500);

  useModalDialogOpen(open, {
    onClose: () => {
      setSelectedOption(null);
      setQuery("");
      fetchProductTypes("");
    },
  });

  const handleScrollEnd = () => {
    if (fetchMoreProductTypes?.hasMore) {
      fetchMoreProductTypes?.onFetchMore();
    }
  };

  const isLoading = Boolean(fetchMoreProductTypes?.loading);
  const hasTypes = (productTypes?.length ?? 0) > 0;
  const showEmptyShopState = !isLoading && !hasTypes && !query.trim();

  const handleCreateProductType = () => {
    onClose();
    navigate(productTypeAddUrl());
  };

  return (
    <DashboardModal open={open} onChange={onClose}>
      <DashboardModal.Content size="xs">
        <DashboardModal.Header>
          <FormattedMessage
            {...(showEmptyShopState ? messages.createProductTypeTitle : messages.selectProductType)}
          />
        </DashboardModal.Header>

        <DashboardModal.Body>
          <DashboardModal.Inset>
            {showEmptyShopState ? (
              <Box
                display="flex"
                flexDirection="column"
                gap={2}
                data-test-id="product-type-picker-empty"
              >
                <Text size={3} fontWeight="medium">
                  <FormattedMessage {...messages.emptyTitle} />
                </Text>
                <Text size={2} color="default2">
                  <FormattedMessage {...messages.emptyDescription} />
                </Text>
              </Box>
            ) : (
              <DynamicCombobox
                data-test-id="dialog-product-type"
                label={intl.formatMessage(messages.productType)}
                options={productTypes ?? []}
                name="productType"
                size="small"
                value={selectedOption}
                onChange={setSelectedOption}
                onInputValueChange={value => {
                  setQuery(value);
                  debouncedFetchProductTypes(value);
                }}
                onFocus={() => fetchProductTypes("")}
                onScrollEnd={handleScrollEnd}
                loading={fetchMoreProductTypes?.loading}
              />
            )}
          </DashboardModal.Inset>
        </DashboardModal.Body>

        <DashboardModal.Actions>
          <BackButton onClick={onClose} />
          {showEmptyShopState ? (
            <Button
              variant="primary"
              data-test-id="create-product-type"
              onClick={handleCreateProductType}
            >
              <FormattedMessage {...messages.createProductType} />
            </Button>
          ) : (
            <ConfirmButton
              data-test-id="submit"
              transitionState={confirmButtonState}
              onClick={() => onConfirm(selectedOption?.value ?? "")}
              disabled={!selectedOption}
            >
              <FormattedMessage {...buttonMessages.confirm} />
            </ConfirmButton>
          )}
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

ProductTypePickerDialog.displayName = "ProductTypePickerDialog";
