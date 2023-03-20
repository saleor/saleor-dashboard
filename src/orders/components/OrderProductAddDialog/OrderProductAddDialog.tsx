import BackButton from "@dashboard/components/BackButton";
import Checkbox from "@dashboard/components/Checkbox";
import ConfirmButton from "@dashboard/components/ConfirmButton";
import FormSpacer from "@dashboard/components/FormSpacer";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import TableCellAvatar from "@dashboard/components/TableCellAvatar";
import TableRowLink from "@dashboard/components/TableRowLink";
import {
  OrderErrorFragment,
  SearchOrderVariantQuery,
} from "@dashboard/graphql";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import useSearchQuery from "@dashboard/hooks/useSearchQuery";
import { buttonMessages } from "@dashboard/intl";
import { maybe, renderCollection } from "@dashboard/misc";
import { FetchMoreProps, RelayToFlat } from "@dashboard/types";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TableBody,
  TableCell,
  TextField,
  Typography,
} from "@material-ui/core";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { Text } from "@saleor/macaw-ui/next";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { FormattedMessage, useIntl } from "react-intl";

import OrderPriceLabel from "../OrderPriceLabel/OrderPriceLabel";
import { messages } from "./messages";
import { useStyles } from "./styles";
import {
  hasAllVariantsSelected,
  isVariantSelected,
  onProductAdd,
  onVariantAdd,
} from "./utils";

export interface OrderProductAddDialogProps extends FetchMoreProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  open: boolean;
  products: RelayToFlat<SearchOrderVariantQuery["search"]>;
  onClose: () => void;
  onFetch: (query: string) => void;
  onSubmit: (
    data: SearchOrderVariantQuery["search"]["edges"][0]["node"]["variants"],
  ) => void;
  channelName?: string;
}

const scrollableTargetId = "orderProductAddScrollableDialog";

const OrderProductAddDialog: React.FC<OrderProductAddDialogProps> = props => {
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
  const [variants, setVariants] = React.useState<
    SearchOrderVariantQuery["search"]["edges"][0]["node"]["variants"]
  >([]);
  const errors = useModalDialogErrors(apiErrors, open);

  useModalDialogOpen(open, {
    onClose: () => setVariants([]),
  });

  const isValidVariant = ({
    pricing,
  }: SearchOrderVariantQuery["search"]["edges"][0]["node"]["variants"][0]) =>
    !!pricing;

  const getValidProductVariants = ({
    variants,
  }: SearchOrderVariantQuery["search"]["edges"][0]["node"]) =>
    variants.filter(isValidVariant);

  const productChoices =
    products?.filter(product => getValidProductVariants(product).length > 0) ||
    [];

  const selectedVariantsToProductsMap = productChoices
    ? productChoices.map(product =>
        getValidProductVariants(product).map(variant =>
          isVariantSelected(variant, variants),
        ),
      )
    : [];

  const productsWithAllVariantsSelected = productChoices
    ? productChoices.map(product =>
        hasAllVariantsSelected(getValidProductVariants(product), variants),
      )
    : [];

  const handleSubmit = () => onSubmit(variants);

  const productChoicesWithValidVariants = productChoices.filter(
    ({ variants }) => variants.some(isValidVariant),
  );

  return (
    <Dialog
      onClose={onClose}
      open={open}
      classes={{ paper: classes.overflow }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle disableTypography>
        <FormattedMessage
          {...messages.title}
          values={{
            channelName,
          }}
        />
      </DialogTitle>
      <DialogContent className={classes.subtitle}>
        <Text variant="caption" color="textNeutralSubdued">
          <FormattedMessage {...messages.subtitle} />
        </Text>
      </DialogContent>
      <DialogContent data-test-id="search-query">
        <TextField
          name="query"
          value={query}
          onChange={onQueryChange}
          label={intl.formatMessage(messages.search)}
          placeholder={intl.formatMessage(messages.searchPlaceholder)}
          fullWidth
          InputProps={{
            autoComplete: "off",
            endAdornment: loading && <CircularProgress size={16} />,
          }}
        />
      </DialogContent>
      <DialogContent className={classes.content} id={scrollableTargetId}>
        <InfiniteScroll
          dataLength={productChoicesWithValidVariants?.length}
          next={onFetchMore}
          hasMore={hasMore}
          scrollThreshold="100px"
          loader={
            <div className={classes.loadMoreLoaderContainer}>
              <CircularProgress size={16} />
            </div>
          }
          scrollableTarget={scrollableTargetId}
        >
          <ResponsiveTable key="table">
            <TableBody>
              {renderCollection(
                productChoicesWithValidVariants,
                (product, productIndex) => (
                  <React.Fragment key={product ? product.id : "skeleton"}>
                    <TableRowLink>
                      <TableCell
                        padding="checkbox"
                        className={classes.productCheckboxCell}
                      >
                        <Checkbox
                          checked={
                            productsWithAllVariantsSelected[productIndex]
                          }
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
                      <TableCell className={classes.colName} colSpan={2}>
                        {maybe(() => product.name)}
                      </TableCell>
                    </TableRowLink>
                    {maybe(() => product.variants, [])
                      .filter(isValidVariant)
                      .map((variant, variantIndex) => (
                        <TableRowLink key={variant.id}>
                          <TableCell />
                          <TableCell className={classes.colVariantCheckbox}>
                            <Checkbox
                              className={classes.variantCheckbox}
                              checked={
                                selectedVariantsToProductsMap[productIndex][
                                  variantIndex
                                ]
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
                          <TableCell className={classes.colName}>
                            <div>{variant.name}</div>
                            {variant.sku && (
                              <div className={classes.grayText}>
                                <FormattedMessage
                                  {...messages.sku}
                                  values={{
                                    sku: variant.sku,
                                  }}
                                />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className={classes.textRight}>
                            <OrderPriceLabel pricing={variant.pricing} />
                          </TableCell>
                        </TableRowLink>
                      ))}
                  </React.Fragment>
                ),
                () => (
                  <Typography className={classes.noContentText}>
                    {!!query
                      ? intl.formatMessage(messages.noProductsInQuery)
                      : intl.formatMessage(messages.noProductsInChannel)}
                  </Typography>
                ),
              )}
            </TableBody>
          </ResponsiveTable>
        </InfiniteScroll>
        {errors.length > 0 && (
          <>
            <FormSpacer />
            {errors.map((err, index) => (
              <DialogContentText color="error" key={index}>
                {getOrderErrorMessage(err, intl)}
              </DialogContentText>
            ))}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <BackButton onClick={onClose} />
        <ConfirmButton
          transitionState={confirmButtonState}
          type="submit"
          onClick={handleSubmit}
          disabled={variants.length === 0}
        >
          <FormattedMessage {...buttonMessages.confirm} />
        </ConfirmButton>
      </DialogActions>
    </Dialog>
  );
};
OrderProductAddDialog.displayName = "OrderProductAddDialog";
export default OrderProductAddDialog;
