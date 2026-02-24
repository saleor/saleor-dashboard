import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { InfiniteScroll } from "@dashboard/components/InfiniteScroll";
import { DashboardModal } from "@dashboard/components/Modal";
import { SaleorThrobber } from "@dashboard/components/Throbber";
import { ProductWhereInput } from "@dashboard/graphql";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { useModalSearchWithFilters } from "@dashboard/hooks/useModalSearchWithFilters";
import { Container, FetchMoreProps } from "@dashboard/types";
import { Box, Input, RadioGroup, Text } from "@saleor/macaw-ui-next";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import BackButton from "../BackButton";
import { useModalProductFilterContext } from "../ModalFilters/entityConfigs/ModalProductFilterProvider";
import { ModalFilters } from "../ModalFilters/ModalFilters";
import styles from "./AssignProductDialog.module.css";
import { messages } from "./messages";
import { Products, SelectedChannel } from "./types";
import { isProductAvailableInVoucherChannels } from "./utils";

interface AssignProductDialogSingleProps extends FetchMoreProps {
  confirmButtonState: ConfirmButtonTransitionState;
  products: Products;
  selectedChannels?: SelectedChannel[];
  productUnavailableText?: string;
  selectedId?: string;
  loading: boolean;
  onFilterChange?: (
    filterVariables: ProductWhereInput,
    channel: string | undefined,
    query: string,
  ) => void;
  onSubmit: (data: Array<Container & Omit<Partial<Products[number]>, "name">>) => void;
  onClose: () => void;
  labels?: {
    confirmBtn?: string;
  };
  open: boolean;
}

const scrollableTargetId = "assignProductScrollableDialog";

export const AssignProductDialogSingle = (props: AssignProductDialogSingleProps) => {
  const {
    confirmButtonState,
    selectedChannels,
    productUnavailableText,
    hasMore,
    loading,
    products,
    onClose,
    onFilterChange,
    onFetchMore,
    onSubmit,
    selectedId,
    labels,
    open,
  } = props;
  const intl = useIntl();
  const [selectedProductId, setSelectedProductId] = useState<string>(selectedId ?? "");
  const { combinedFilters, clearFilters } = useModalProductFilterContext();

  const { query, onQueryChange, resetQuery } = useModalSearchWithFilters({
    filterVariables: combinedFilters,
    open,
    onFetch: (filters, query) => onFilterChange?.(filters.where, filters.channel, query),
  });

  useEffect(() => {
    setSelectedProductId(selectedId ?? "");
  }, [selectedId]);

  const handleClose = () => {
    resetQuery();
    clearFilters();
    onClose();
  };

  useModalDialogOpen(open, {
    onOpen: () => {
      resetQuery();
      clearFilters();
    },
    onClose: handleClose,
  });

  const handleSubmit = () => {
    if (selectedProductId) {
      const selectedProduct = products.find(product => product.id === selectedProductId);

      if (selectedProduct) {
        onSubmit([
          {
            ...selectedProduct,
            id: selectedProduct.id,
            name: selectedProduct.name,
          },
        ]);

        return;
      }
    }

    onSubmit([]);
  };

  const handleChange = (productId: string) => {
    setSelectedProductId(productId === selectedProductId ? "" : productId);
  };

  return (
    <>
      <Input
        name="query"
        value={query}
        onChange={onQueryChange}
        label={intl.formatMessage(messages.assignProductDialogSearch)}
        placeholder={intl.formatMessage(messages.assignProductDialogContent)}
        width="100%"
        endAdornment={loading ? <SaleorThrobber size={16} /> : undefined}
        autoComplete="off"
      />

      <ModalFilters />

      <InfiniteScroll
        id={scrollableTargetId}
        dataLength={products?.length ?? 0}
        next={onFetchMore}
        hasMore={hasMore}
        scrollThreshold="100px"
        scrollableTarget={scrollableTargetId}
      >
        <Box display="flex" flexDirection="column">
          <RadioGroup value={selectedProductId} display="flex" flexDirection="column">
            {products &&
              products.map(product => {
                const isProductAvailable = isProductAvailableInVoucherChannels(
                  product.channelListings ?? [],
                  selectedChannels,
                );

                return (
                  <Box
                    key={product.id}
                    display="flex"
                    alignItems="center"
                    gap={3}
                    paddingX={3}
                    paddingY={2}
                    cursor={isProductAvailable ? "pointer" : "auto"}
                    data-test-id="assign-product-table-row"
                    onClick={() => (isProductAvailable ? handleChange(product.id) : null)}
                  >
                    <Box className={styles.checkboxCell}>
                      <RadioGroup.Item
                        value={product.id}
                        id={product.id}
                        name="product-selection"
                        disabled={!isProductAvailable}
                      >
                        {null}
                      </RadioGroup.Item>
                    </Box>
                    <Box className={styles.avatar} __opacity={!isProductAvailable ? 0.5 : 1}>
                      {product?.thumbnail?.url ? (
                        <img
                          src={product.thumbnail.url}
                          alt={product?.name}
                          className={styles.thumbnailImg}
                        />
                      ) : (
                        <Box className={styles.thumbnailPlaceholder} />
                      )}
                    </Box>
                    <Box flexGrow="1">
                      {product?.name}
                      {!isProductAvailable && productUnavailableText && (
                        <Text display="block" size={1} color="default2">
                          {productUnavailableText}
                        </Text>
                      )}
                    </Box>
                  </Box>
                );
              })}
          </RadioGroup>
          {!loading && (products?.length ?? 0) === 0 && (
            <Box>
              <Text>{intl.formatMessage(messages.noProductsFound)}</Text>
            </Box>
          )}
        </Box>
      </InfiniteScroll>

      <DashboardModal.Actions>
        <BackButton onClick={handleClose} />
        <ConfirmButton
          data-test-id="submit"
          transitionState={confirmButtonState}
          type="submit"
          onClick={handleSubmit}
        >
          {labels?.confirmBtn ?? <FormattedMessage {...messages.assignProductDialogButton} />}
        </ConfirmButton>
      </DashboardModal.Actions>
    </>
  );
};
