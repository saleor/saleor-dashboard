// @ts-strict-ignore
import BackButton from "@dashboard/components/BackButton";
import Checkbox from "@dashboard/components/Checkbox";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import FormSpacer from "@dashboard/components/FormSpacer";
import { InfiniteScroll } from "@dashboard/components/InfiniteScroll";
import { DashboardModal } from "@dashboard/components/Modal";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import TableCellAvatar from "@dashboard/components/TableCellAvatar";
import TableRowLink from "@dashboard/components/TableRowLink";
import { SaleorThrobber } from "@dashboard/components/Throbber";
import { OrderErrorFragment, SearchOrderVariantQuery } from "@dashboard/graphql";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import useSearchQuery from "@dashboard/hooks/useSearchQuery";
import { buttonMessages } from "@dashboard/intl";
import { maybe, renderCollection } from "@dashboard/misc";
import { FetchMoreProps, RelayToFlat } from "@dashboard/types";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { TableBody, TableCell, TextField } from "@material-ui/core";
import { Box, Text } from "@saleor/macaw-ui-next";
import { Fragment, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import OrderPriceLabel from "../OrderPriceLabel/OrderPriceLabel";
import { messages } from "./messages";
import { useStyles } from "./styles";
import { hasAllVariantsSelected, isVariantSelected, onProductAdd, onVariantAdd } from "./utils";

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
const OrderProductAddDialog = (props: OrderProductAddDialogProps) => {
  const {
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
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const [query, onQueryChange] = useSearchQuery(onFetch);
  const [variants, setVariants] = useState<
    SearchOrderVariantQuery["search"]["edges"][0]["node"]["variants"]
  >([]);
  const errors = useModalDialogErrors(apiErrors, open);

  useModalDialogOpen(open, {
    onClose: () => setVariants([]),
  });

  const isValidVariant = ({
    pricing,
  }: SearchOrderVariantQuery["search"]["edges"][0]["node"]["variants"][0]) => !!pricing;
  const getValidProductVariants = ({
    variants,
  }: SearchOrderVariantQuery["search"]["edges"][0]["node"]) => variants.filter(isValidVariant);
  const productChoices =
    products?.filter(product => getValidProductVariants(product).length > 0) || [];
  const selectedVariantsToProductsMap = productChoices
    ? productChoices.map(product =>
        getValidProductVariants(product).map(variant => isVariantSelected(variant, variants)),
      )
    : [];
  const productsWithAllVariantsSelected = productChoices
    ? productChoices.map(product =>
        hasAllVariantsSelected(getValidProductVariants(product), variants),
      )
    : [];
  const handleSubmit = () => onSubmit(variants);
  const productChoicesWithValidVariants = productChoices.filter(({ variants }) =>
    variants.some(isValidVariant),
  );

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="sm" __gridTemplateRows="auto auto auto 1fr">
        <DashboardModal.Header>
          <FormattedMessage
            {...messages.title}
            values={{
              channelName,
            }}
          />
        </DashboardModal.Header>

        <Text size={2} color="default2">
          <FormattedMessage {...messages.subtitle} />
        </Text>

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

        <InfiniteScroll
          id={scrollableTargetId}
          dataLength={productChoicesWithValidVariants?.length}
          next={onFetchMore}
          hasMore={hasMore}
          scrollThreshold="100px"
          scrollableTarget={scrollableTargetId}
        >
          <ResponsiveTable key="table">
            <TableBody data-test-id="add-products-table">
              {renderCollection(
                productChoicesWithValidVariants,
                (product, productIndex) => (
                  <Fragment key={product ? product.id : "skeleton"}>
                    <TableRowLink data-test-id="product">
                      <TableCell padding="checkbox" className={classes.productCheckboxCell}>
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
                      <TableCell
                        className={classes.colName}
                        colSpan={2}
                        data-test-id="product-name"
                      >
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
                              checked={selectedVariantsToProductsMap[productIndex][variantIndex]}
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
                          <TableCell className={classes.colName}>
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
                () => (
                  <Text marginBottom={3}>
                    {query
                      ? intl.formatMessage(messages.noProductsInQuery)
                      : intl.formatMessage(messages.noProductsInChannel)}
                  </Text>
                ),
              )}
            </TableBody>
          </ResponsiveTable>
        </InfiniteScroll>
        {errors.length > 0 && (
          <>
            <FormSpacer />
            {errors.map((err, index) => (
              <Text display="block" color="critical1" key={index}>
                {getOrderErrorMessage(err, intl)}
              </Text>
            ))}
          </>
        )}

        <DashboardModal.Actions>
          <BackButton onClick={onClose} data-test-id="back-button" />
          <ConfirmButton
            transitionState={confirmButtonState}
            type="submit"
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
export default OrderProductAddDialog;
