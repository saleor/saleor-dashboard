import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { InfiniteScroll } from "@dashboard/components/InfiniteScroll";
import { DashboardModal } from "@dashboard/components/Modal";
import { SaleorThrobber } from "@dashboard/components/Throbber";
import { type ProductWhereInput } from "@dashboard/graphql";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { useModalSearchWithFilters } from "@dashboard/hooks/useModalSearchWithFilters";
import { type Container, type FetchMoreProps } from "@dashboard/types";
import { Box, Checkbox, Input, Text } from "@saleor/macaw-ui-next";
import { useEffect, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import BackButton from "../BackButton";
import { useModalProductFilterContext } from "../ModalFilters/entityConfigs/ModalProductFilterProvider";
import { ModalFilters } from "../ModalFilters/ModalFilters";
import styles from "./AssignProductDialog.module.css";
import { messages } from "./messages";
import { type Products, type SelectedChannel } from "./types";
import { isProductAvailableInVoucherChannels } from "./utils";

interface AssignProductDialogMultiProps extends FetchMoreProps {
  confirmButtonState: ConfirmButtonTransitionState;
  products: Products;
  selectedChannels?: SelectedChannel[];
  productUnavailableText?: string;
  selectedIds?: Record<string, boolean>;
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

export const AssignProductDialogMulti = (props: AssignProductDialogMultiProps) => {
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
    selectedIds,
    labels,
    open,
  } = props;
  const intl = useIntl();
  const [productsDict, setProductsDict] = useState(selectedIds || {});
  const { combinedFilters, clearFilters } = useModalProductFilterContext();

  const { query, onQueryChange, resetQuery } = useModalSearchWithFilters({
    filterVariables: combinedFilters,
    open,
    onFetch: (filters, query) => onFilterChange?.(filters.where, filters.channel, query),
  });

  // Keep selected product data to send them back when submitting
  const productsData = useRef<Products>([]);

  useEffect(() => {
    if (selectedIds) {
      setProductsDict(prev => {
        const prevIds = Object.keys(prev);
        const newIds = Object.keys(selectedIds);
        const preSelected = newIds
          .filter(n => !prevIds.includes(n))
          .reduce((p, c) => ({ ...p, [c]: true }), {});

        return { ...prev, ...preSelected };
      });
    }
  }, [selectedIds]);

  const handleSubmit = () => {
    const selectedProductsAsArray = Object.keys(productsDict)
      .filter(key => productsDict[key])
      .map(key => key);

    onSubmit(
      selectedProductsAsArray.map(id => {
        const productDetails = productsData.current.find(product => product.id === id);
        const { name: productName, ...productRest } = productDetails ?? {};

        return {
          ...productRest,
          id,
          name: productName ?? "",
        };
      }),
    );
  };

  const handleChange = (productId: string) => {
    const productData = products.find(product => product.id === productId);

    if (productData) {
      productsData.current = [...productsData.current, productData];
    }

    setProductsDict(prev => ({
      ...prev,
      [productId]: prev[productId] ? false : true,
    }));
  };

  const handleClose = () => {
    resetQuery();
    clearFilters();
    onClose();
  };

  useModalDialogOpen(open, {
    onOpen: () => {
      resetQuery();
      clearFilters();
      setProductsDict(selectedIds || {});
    },
    onClose: handleClose,
  });

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
          {products &&
            products.map(product => {
              const isSelected = productsDict[product.id] || false;
              const isProductAvailable = isProductAvailableInVoucherChannels(
                product.channelListings ?? undefined,
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
                  borderBottomWidth={1}
                  borderBottomStyle="solid"
                  borderColor="default1"
                  data-test-id="assign-product-table-row"
                >
                  <Box className={styles.checkboxCell}>
                    <Checkbox
                      checked={isSelected}
                      disabled={!isProductAvailable}
                      onCheckedChange={() => handleChange(product.id)}
                    />
                  </Box>
                  <Box className={styles.avatar} __opacity={!isProductAvailable ? 0.5 : 1}>
                    {product.thumbnail?.url ? (
                      <img
                        src={product.thumbnail.url}
                        alt={product.name}
                        className={styles.thumbnailImg}
                      />
                    ) : (
                      <Box className={styles.thumbnailPlaceholder} />
                    )}
                  </Box>
                  <Box flexGrow="1">
                    <Text size={3}>{product.name}</Text>
                    {!isProductAvailable && productUnavailableText && (
                      <Text display="block" size={2} color="default2">
                        {productUnavailableText}
                      </Text>
                    )}
                  </Box>
                </Box>
              );
            })}
          {!loading && (products?.length ?? 0) === 0 && (
            <Text>
              <Text>{intl.formatMessage(messages.noProductsFound)}</Text>
            </Text>
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
