// @ts-strict-ignore
import { AssignPickerListEmptyStateRow } from "@dashboard/components/AssignPickerListEmptyState/AssignPickerListEmptyState";
import { AssignPickerListLoadingRow } from "@dashboard/components/AssignPickerListLoading/AssignPickerListLoading";
import BackButton from "@dashboard/components/BackButton";
import Checkbox from "@dashboard/components/Checkbox";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { InfiniteScroll } from "@dashboard/components/InfiniteScroll";
import { DashboardModal } from "@dashboard/components/Modal";
import { ResponsiveTable } from "@dashboard/components/ResponsiveTable";
import TableCellAvatar from "@dashboard/components/TableCellAvatar";
import TableRowLink from "@dashboard/components/TableRowLink";
import { SaleorThrobber } from "@dashboard/components/Throbber";
import { type OrderErrorFragment, type SearchOrderVariantQuery } from "@dashboard/graphql";
import { useAssignPickerListDisplayState } from "@dashboard/hooks/useAssignPickerListDisplayState";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import useSearchQuery from "@dashboard/hooks/useSearchQuery";
import { useStalePickerList } from "@dashboard/hooks/useStalePickerList";
import { buttonMessages } from "@dashboard/intl";
import { maybe, renderCollection } from "@dashboard/misc";
import { type FetchMoreProps, type RelayToFlat } from "@dashboard/types";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { TableBody, TableCell, TextField } from "@material-ui/core";
import { Box, Text } from "@saleor/macaw-ui-next";
import { Fragment, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import OrderPriceLabel from "../OrderPriceLabel/OrderPriceLabel";
import { messages } from "./messages";
import { useStyles } from "./styles";
import {
  hasAllVariantsSelected,
  hasVariantPricing,
  isVariantSelected,
  onProductAdd,
  onVariantAdd,
} from "./utils";

interface OrderProductAddDialogProps extends FetchMoreProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  open: boolean;
  products: RelayToFlat<SearchOrderVariantQuery["search"]>;
  onClose: () => void;
  onFetch: (query: string) => void;
  onSubmit: (data: SearchOrderVariantQuery["search"]["edges"][0]["node"]["variants"]) => void;
  channelName?: string;
}

const scrollableTargetId = "orderProductAddScrollableDialog";

export const OrderProductAddDialog = ({
  confirmButtonState,
  errors: apiErrors,
  open,
  loading,
  hasMore,
  products,
  onFetch,
  onFetchMore,
  onClose,
  onSubmit,
  channelName,
}: OrderProductAddDialogProps) => {
  const classes = useStyles({});
  const intl = useIntl();
  const [query, onQueryChange, resetQuery] = useSearchQuery(onFetch);
  const [variants, setVariants] = useState<
    SearchOrderVariantQuery["search"]["edges"][0]["node"]["variants"]
  >([]);
  const errors = useModalDialogErrors(apiErrors, open);

  const handleClose = () => {
    resetQuery();
    onClose();
  };

  useModalDialogOpen(open, {
    onOpen: () => {
      resetQuery();
      setVariants([]);
    },
    onClose: () => {
      resetQuery();
      setVariants([]);
    },
  });

  const isValidVariant = hasVariantPricing;
  const getValidProductVariants = ({
    variants: productVariants,
  }: SearchOrderVariantQuery["search"]["edges"][0]["node"]) =>
    productVariants.filter(isValidVariant);
  const productChoices =
    products?.filter(product => getValidProductVariants(product).length > 0) || [];
  const displayedProductChoices = useStalePickerList(productChoices, loading, open);
  const selectedVariantsToProductsMap = displayedProductChoices.map(product =>
    getValidProductVariants(product).map(variant => isVariantSelected(variant, variants)),
  );
  const productsWithAllVariantsSelected = displayedProductChoices.map(product =>
    hasAllVariantsSelected(getValidProductVariants(product), variants),
  );
  const productChoicesWithValidVariants = displayedProductChoices.filter(
    ({ variants: productVariants }) => productVariants.some(isValidVariant),
  );
  const { showEmptyState, showListLoading } = useAssignPickerListDisplayState(
    loading,
    productChoicesWithValidVariants.length,
  );

  const handleSubmit = () => onSubmit(variants);

  return (
    <DashboardModal onChange={handleClose} open={open}>
      <DashboardModal.Content size="picker">
        <DashboardModal.PickerHeader
          description={<FormattedMessage {...messages.subtitle} />}
          toolbar={
            <Box data-test-id="search-query">
              <TextField
                name="query"
                value={query}
                onChange={onQueryChange}
                label={intl.formatMessage(messages.search)}
                placeholder={intl.formatMessage(messages.searchPlaceholder)}
                fullWidth
                InputProps={{
                  autoComplete: "off",
                  endAdornment: loading && <SaleorThrobber size={16} />,
                }}
              />
            </Box>
          }
        >
          <FormattedMessage
            {...messages.title}
            values={{
              channelName,
            }}
          />
        </DashboardModal.PickerHeader>

        <DashboardModal.Body fill id={scrollableTargetId}>
          <InfiniteScroll
            flush
            dataLength={productChoicesWithValidVariants.length}
            next={onFetchMore}
            hasMore={hasMore}
            scrollThreshold="100px"
            scrollableTarget={scrollableTargetId}
          >
            <ResponsiveTable bleed fillHeight key="table">
              <TableBody data-test-id="add-products-table">
                {showListLoading ? (
                  <AssignPickerListLoadingRow colSpan={4} />
                ) : (
                  renderCollection(
                    productChoicesWithValidVariants,
                    (product, productIndex) => (
                      <Fragment key={product ? product.id : "skeleton"}>
                        <TableRowLink data-test-id="product">
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={productsWithAllVariantsSelected[productIndex]}
                              disabled={loading}
                              onChange={() =>
                                onProductAdd(
                                  product,
                                  productIndex,
                                  productsWithAllVariantsSelected,
                                  variants,
                                  setVariants,
                                )
                              }
                            />
                          </TableCell>
                          <TableCellAvatar
                            className={classes.avatar}
                            thumbnail={maybe(() => product.thumbnail.url)}
                          />
                          <TableCell colSpan={2} data-test-id="product-name">
                            {maybe(() => product.name)}
                          </TableCell>
                        </TableRowLink>
                        {maybe(() => product.variants, [])
                          .filter(isValidVariant)
                          .map((variant, variantIndex) => (
                            <TableRowLink key={variant.id} data-test-id="variant">
                              <TableCell />
                              <TableCell className={classes.colVariantCheckbox}>
                                <Checkbox
                                  className={classes.variantCheckbox}
                                  checked={
                                    selectedVariantsToProductsMap[productIndex][variantIndex]
                                  }
                                  disabled={loading}
                                  onChange={() =>
                                    onVariantAdd(
                                      variant,
                                      variantIndex,
                                      productIndex,
                                      variants,
                                      selectedVariantsToProductsMap,
                                      setVariants,
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <div>{variant.name}</div>
                                {variant.sku && (
                                  <Box color="default2">
                                    <FormattedMessage
                                      {...messages.sku}
                                      values={{
                                        sku: variant.sku,
                                      }}
                                    />
                                  </Box>
                                )}
                              </TableCell>
                              <TableCell className={classes.textRight} data-test-id="variant-price">
                                <OrderPriceLabel pricing={variant.pricing} />
                              </TableCell>
                            </TableRowLink>
                          ))}
                      </Fragment>
                    ),
                    () =>
                      showEmptyState && (
                        <AssignPickerListEmptyStateRow colSpan={4}>
                          {query
                            ? intl.formatMessage(messages.noProductsInQuery)
                            : intl.formatMessage(messages.noProductsInChannel)}
                        </AssignPickerListEmptyStateRow>
                      ),
                  )
                )}
              </TableBody>
            </ResponsiveTable>
          </InfiniteScroll>
        </DashboardModal.Body>

        {errors.length > 0 ? (
          <DashboardModal.Inset>
            <Box display="flex" flexDirection="column" gap={2}>
              {errors.map((err, index) => (
                <Text display="block" color="critical1" key={index} data-test-id="dialog-error">
                  {getOrderErrorMessage(err, intl)}
                </Text>
              ))}
            </Box>
          </DashboardModal.Inset>
        ) : null}

        <DashboardModal.Actions>
          <BackButton onClick={handleClose} data-test-id="back-button" />
          <ConfirmButton
            transitionState={confirmButtonState}
            data-test-id="confirm-button"
            onClick={handleSubmit}
            disabled={variants.length === 0}
          >
            <FormattedMessage {...buttonMessages.confirm} />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

OrderProductAddDialog.displayName = "OrderProductAddDialog";
