import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { InfiniteScroll } from "@dashboard/components/InfiniteScroll";
import { DashboardModal } from "@dashboard/components/Modal";
import Money from "@dashboard/components/Money";
import { SaleorThrobber } from "@dashboard/components/Throbber";
import { ProductWhereInput, SearchProductsQuery } from "@dashboard/graphql";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { useModalSearchWithFilters } from "@dashboard/hooks/useModalSearchWithFilters";
import { renderCollection } from "@dashboard/misc";
import { Container, FetchMoreProps, RelayToFlat } from "@dashboard/types";
import { Box, Checkbox, Input, Text } from "@saleor/macaw-ui-next";
import { Fragment, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { AssignContainerDialogProps } from "../AssignContainerDialog";
import BackButton from "../BackButton";
import { useModalProductFilterContext } from "../ModalFilters/entityConfigs/ModalProductFilterProvider";
import { ModalFilters } from "../ModalFilters/ModalFilters";
import styles from "./AssignVariantDialog.module.css";
import { messages } from "./messages";
import {
  getCompositeLabel,
  handleProductAssign,
  handleVariantAssign,
  hasAllVariantsSelected,
  isVariantSelected,
  VariantWithProductLabel,
} from "./utils";

interface AssignVariantDialogMultiProps extends FetchMoreProps {
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
  labels?: Partial<AssignContainerDialogProps["labels"]>;
  open: boolean;
}

const scrollableTargetId = "assignVariantScrollableDialog";

export const AssignVariantDialogMulti = (props: AssignVariantDialogMultiProps) => {
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
    open,
  } = props;
  const intl = useIntl();

  const { combinedFilters, clearFilters } = useModalProductFilterContext();

  const { query, onQueryChange, resetQuery } = useModalSearchWithFilters({
    filterVariables: combinedFilters,
    open,
    onFetch: (filters, query) => onFilterChange?.(filters.where, filters.channel, query),
  });

  const [variants, setVariants] = useState<VariantWithProductLabel[]>([]);
  const productChoices = (products ?? []).filter(
    (product): product is NonNullable<typeof product> => (product?.variants?.length ?? 0) > 0,
  );
  const selectedVariantsToProductsMap = productChoices.map(product =>
    (product?.variants ?? [])
      .filter((variant): variant is NonNullable<typeof variant> => !!variant)
      .map(variant => isVariantSelected(variant, variants)),
  );
  const productsWithAllVariantsSelected = productChoices.map(product =>
    hasAllVariantsSelected(
      (product?.variants ?? []).filter(
        (variant): variant is NonNullable<typeof variant> => !!variant,
      ),
      variants,
    ),
  );
  const handleSubmit = () =>
    onSubmit(
      variants
        .filter((variant): variant is VariantWithProductLabel & { id: string } => "id" in variant)
        .map(variant => ({
          ...variant,
          name: getCompositeLabel(variant),
          id: variant.id,
        })),
    );

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
        dataLength={variants?.length ?? 0}
        next={onFetchMore}
        hasMore={hasMore}
        scrollThreshold="100px"
        scrollableTarget={scrollableTargetId}
      >
        <Box display="flex" flexDirection="column">
          {renderCollection(
            productChoices,
            (product, productIndex) => {
              if (!product || productIndex === undefined) return null;

              const productVariants = (product?.variants ?? []).filter(
                (variant): variant is NonNullable<typeof variant> => !!variant,
              );

              return (
                <Fragment key={product ? product.id : "skeleton"}>
                  <Box display="flex" alignItems="center" gap={3} paddingX={3} paddingY={2}>
                    <Box className={styles.checkboxCell}>
                      <Checkbox
                        checked={productsWithAllVariantsSelected[productIndex]}
                        disabled={loading}
                        onCheckedChange={() =>
                          handleProductAssign(
                            product,
                            productIndex,
                            productsWithAllVariantsSelected,
                            variants,
                            setVariants,
                          )
                        }
                      />
                    </Box>
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
                  {productVariants.map((variant, variantIndex) => (
                    <Box
                      key={variant.id}
                      display="flex"
                      alignItems="center"
                      gap={3}
                      paddingX={3}
                      paddingY={1}
                      data-test-id="assign-variant-table-row"
                    >
                      <Box className={styles.checkboxCell} />
                      <Box className={styles.variantCheckboxCell}>
                        <Checkbox
                          checked={selectedVariantsToProductsMap[productIndex][variantIndex]}
                          disabled={loading}
                          onCheckedChange={() =>
                            handleVariantAssign(
                              variant,
                              product,
                              variantIndex,
                              productIndex,
                              variants,
                              selectedVariantsToProductsMap,
                              setVariants,
                            )
                          }
                        />
                      </Box>
                      <Box flexGrow="1">
                        <Text>{variant.name}</Text>
                        <Text size={1} color="default2">
                          <FormattedMessage
                            {...messages.assignVariantDialogSKU}
                            values={{
                              sku: variant.sku,
                            }}
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
              );
            },
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
