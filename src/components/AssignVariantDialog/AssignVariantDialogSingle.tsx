import { ConfirmButton, type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { InfiniteScroll } from "@dashboard/components/InfiniteScroll";
import { DashboardModal } from "@dashboard/components/Modal";
import Money from "@dashboard/components/Money";
import { SaleorThrobber } from "@dashboard/components/Throbber";
import { type ProductWhereInput, type SearchProductsQuery } from "@dashboard/graphql";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { useModalSearchWithFilters } from "@dashboard/hooks/useModalSearchWithFilters";
import { renderCollection } from "@dashboard/misc";
import { type Container, type FetchMoreProps, type RelayToFlat } from "@dashboard/types";
import { Box, Input, RadioGroup, Text } from "@saleor/macaw-ui-next";
import { Fragment, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { type AssignContainerDialogProps } from "../AssignContainerDialog";
import BackButton from "../BackButton";
import { useModalProductFilterContext } from "../ModalFilters/entityConfigs/ModalProductFilterProvider";
import { ModalFilters } from "../ModalFilters/ModalFilters";
import styles from "./AssignVariantDialog.module.css";
import { messages } from "./messages";
import { getCompositeLabel, type VariantWithProductLabel } from "./utils";

interface AssignVariantDialogSingleProps extends FetchMoreProps {
  confirmButtonState: ConfirmButtonTransitionState;
  products: RelayToFlat<SearchProductsQuery["search"]>;
  loading: boolean;
  onFilterChange?: (
    filterVariables: ProductWhereInput,
    channel: string | undefined,
    query: string,
  ) => void;
  onSubmit: (data: Container[]) => void;
  onClose: () => void;
  selectedId?: string;
  labels?: Partial<AssignContainerDialogProps["labels"]>;
  open: boolean;
}

const scrollableTargetId = "assignVariantScrollableDialog";

export const AssignVariantDialogSingle = (props: AssignVariantDialogSingleProps) => {
  const {
    confirmButtonState,
    labels,
    hasMore,
    loading,
    products,
    onClose,
    onFilterChange,
    onFetchMore,
    onSubmit,
    selectedId,
    open,
  } = props;
  const intl = useIntl();
  const [selectedVariantId, setSelectedVariantId] = useState<string>(selectedId ?? "");
  const { combinedFilters, clearFilters } = useModalProductFilterContext();

  const { query, onQueryChange, resetQuery } = useModalSearchWithFilters({
    filterVariables: combinedFilters,
    open,
    onFetch: (filters, query) => onFilterChange?.(filters.where, filters.channel, query),
  });

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

  const productChoices = useMemo(
    () =>
      (products ?? []).filter(
        (product): product is NonNullable<typeof product> => (product?.variants?.length ?? 0) > 0,
      ),
    [products],
  );
  const productVariantChoices = useMemo(
    () =>
      productChoices.flatMap(product =>
        (product?.variants ?? []).filter(
          (variant): variant is NonNullable<typeof variant> => !!variant,
        ),
      ),
    [productChoices],
  );

  const handleSubmit = () => {
    if (selectedVariantId) {
      const variant = productVariantChoices.find(v => v && v.id === selectedVariantId);

      if (variant) {
        const variantWithLabel: VariantWithProductLabel = {
          ...variant,
          productName: variant.product.name,
        };

        onSubmit([
          {
            ...variantWithLabel,
            name: getCompositeLabel(variantWithLabel),
            id: variant.id,
          },
        ]);

        return;
      }
    }

    onSubmit([]);
  };

  const handleVariantSelect = (variantId: string) => {
    setSelectedVariantId(variantId === selectedVariantId ? "" : variantId);
  };

  return (
    <>
      <Input
        name="query"
        value={query}
        onChange={onQueryChange}
        label={intl.formatMessage(messages.assignVariantDialogSearch)}
        placeholder={intl.formatMessage(messages.assignVariantDialogContent)}
        width="100%"
        endAdornment={loading ? <SaleorThrobber size={16} /> : undefined}
        autoComplete="off"
      />

      <ModalFilters />

      <InfiniteScroll
        id={scrollableTargetId}
        dataLength={productChoices.reduce(
          (acc, product) => acc + (product.variants?.length || 0),
          0,
        )}
        next={onFetchMore}
        hasMore={hasMore}
        scrollThreshold="100px"
        scrollableTarget={scrollableTargetId}
      >
        <Box display="flex" flexDirection="column">
          <RadioGroup value={selectedVariantId} display="flex" flexDirection="column">
            {renderCollection(
              productChoices,
              product => (
                <Fragment key={product ? product.id : "skeleton"}>
                  <Box display="flex" alignItems="center" gap={3} paddingX={3} paddingY={2}>
                    <Box className={styles.checkboxCell} />
                    <Box className={styles.avatar}>
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
                      <Text>{product?.name}</Text>
                    </Box>
                  </Box>
                  {(product?.variants ?? [])
                    .filter((variant): variant is NonNullable<typeof variant> => !!variant)
                    .map(variant => (
                      <Box
                        key={variant.id}
                        display="flex"
                        alignItems="center"
                        gap={3}
                        paddingX={3}
                        paddingY={1}
                        cursor="pointer"
                        data-test-id="assign-variant-table-row"
                        onClick={() => handleVariantSelect(variant.id)}
                      >
                        <Box className={styles.checkboxCell} />
                        <Box className={styles.variantCheckboxCell}>
                          <RadioGroup.Item
                            value={variant.id}
                            id={variant.id}
                            name="variant-selection"
                            disabled={loading}
                          >
                            {null}
                          </RadioGroup.Item>
                        </Box>
                        <Box flexGrow="1">
                          <Text>{variant.name}</Text>
                          <Text size={1} color="default2">
                            <FormattedMessage
                              {...messages.assignVariantDialogSKU}
                              values={{ sku: variant.sku }}
                            />
                          </Text>
                        </Box>
                        <Box className={styles.priceCell}>
                          {variant?.channelListings?.[0]?.price && (
                            <Money money={variant.channelListings[0].price} />
                          )}
                        </Box>
                      </Box>
                    ))}
                </Fragment>
              ),
              () => (
                <Box paddingX={3} paddingY={2}>
                  <Text>
                    {query
                      ? intl.formatMessage(messages.noProductsInQuery)
                      : intl.formatMessage(messages.noProductsInChannel)}
                  </Text>
                </Box>
              ),
            )}
          </RadioGroup>
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
          {labels?.confirmBtn ?? <FormattedMessage {...messages.assignVariantDialogButton} />}
        </ConfirmButton>
      </DashboardModal.Actions>
    </>
  );
};
