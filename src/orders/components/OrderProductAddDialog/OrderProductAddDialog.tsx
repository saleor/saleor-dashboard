import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TableBody,
  TableCell,
  TableRow,
  TextField,
} from "@material-ui/core";
import BackButton from "@saleor/components/BackButton";
import Checkbox from "@saleor/components/Checkbox";
import ConfirmButton from "@saleor/components/ConfirmButton";
import FormSpacer from "@saleor/components/FormSpacer";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import { OrderErrorFragment, SearchOrderVariantQuery } from "@saleor/graphql";
import useModalDialogErrors from "@saleor/hooks/useModalDialogErrors";
import useModalDialogOpen from "@saleor/hooks/useModalDialogOpen";
import useSearchQuery from "@saleor/hooks/useSearchQuery";
import { buttonMessages } from "@saleor/intl";
import { ConfirmButtonTransitionState, makeStyles } from "@saleor/macaw-ui";
import { maybe, renderCollection } from "@saleor/misc";
import { ChannelProps, FetchMoreProps, RelayToFlat } from "@saleor/types";
import getOrderErrorMessage from "@saleor/utils/errors/order";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { FormattedMessage, useIntl } from "react-intl";

import OrderPriceLabel from "../OrderPriceLabel/OrderPriceLabel";

const useStyles = makeStyles(
  theme => ({
    avatar: {
      paddingLeft: 0,
      width: 64,
    },
    colName: {
      paddingLeft: 0,
    },
    colVariantCheckbox: {
      padding: 0,
    },
    content: {
      overflowY: "scroll",
      paddingTop: 0,
      marginBottom: theme.spacing(3),
    },
    grayText: {
      color: theme.palette.text.disabled,
    },
    loadMoreLoaderContainer: {
      alignItems: "center",
      display: "flex",
      height: theme.spacing(3),
      justifyContent: "center",
      marginTop: theme.spacing(3),
    },
    overflow: {
      overflowY: "hidden",
    },
    topArea: {
      overflowY: "hidden",
      paddingBottom: theme.spacing(6),
      margin: theme.spacing(0, 3, 3, 3),
    },
    productCheckboxCell: {
      "&:first-child": {
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
    textRight: {
      textAlign: "right",
    },
    variantCheckbox: {
      left: theme.spacing(),
      position: "relative",
    },
    wideCell: {
      width: "100%",
    },
  }),
  { name: "OrderProductAddDialog" },
);

type SetVariantsAction = (
  data: SearchOrderVariantQuery["search"]["edges"][0]["node"]["variants"],
) => void;

export interface OrderProductAddDialogProps
  extends FetchMoreProps,
    ChannelProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  open: boolean;
  products: RelayToFlat<SearchOrderVariantQuery["search"]>;
  onClose: () => void;
  onFetch: (query: string) => void;
  onSubmit: (
    data: SearchOrderVariantQuery["search"]["edges"][0]["node"]["variants"],
  ) => void;
}

function hasAllVariantsSelected(
  productVariants: SearchOrderVariantQuery["search"]["edges"][0]["node"]["variants"],
  selectedVariantsToProductsMap: SearchOrderVariantQuery["search"]["edges"][0]["node"]["variants"],
): boolean {
  return productVariants.reduce(
    (acc, productVariant) =>
      acc &&
      !!selectedVariantsToProductsMap.find(
        selectedVariant => selectedVariant.id === productVariant.id,
      ),
    true,
  );
}

function isVariantSelected(
  variant: SearchOrderVariantQuery["search"]["edges"][0]["node"]["variants"][0],
  selectedVariantsToProductsMap: SearchOrderVariantQuery["search"]["edges"][0]["node"]["variants"],
): boolean {
  return !!selectedVariantsToProductsMap.find(
    selectedVariant => selectedVariant.id === variant.id,
  );
}

const onProductAdd = (
  product: SearchOrderVariantQuery["search"]["edges"][0]["node"],
  productIndex: number,
  productsWithAllVariantsSelected: boolean[],
  variants: SearchOrderVariantQuery["search"]["edges"][0]["node"]["variants"],
  setVariants: SetVariantsAction,
) =>
  productsWithAllVariantsSelected[productIndex]
    ? setVariants(
        variants.filter(
          selectedVariant =>
            !product.variants.find(
              productVariant => productVariant.id === selectedVariant.id,
            ),
        ),
      )
    : setVariants([
        ...variants,
        ...product.variants.filter(
          productVariant =>
            !variants.find(
              selectedVariant => selectedVariant.id === productVariant.id,
            ),
        ),
      ]);

const onVariantAdd = (
  variant: SearchOrderVariantQuery["search"]["edges"][0]["node"]["variants"][0],
  variantIndex: number,
  productIndex: number,
  variants: SearchOrderVariantQuery["search"]["edges"][0]["node"]["variants"],
  selectedVariantsToProductsMap: boolean[][],
  setVariants: SetVariantsAction,
) =>
  selectedVariantsToProductsMap[productIndex][variantIndex]
    ? setVariants(
        variants.filter(selectedVariant => selectedVariant.id !== variant.id),
      )
    : setVariants([...variants, variant]);

const scrollableTargetId = "orderProductAddScrollableDialog";

const OrderProductAddDialog: React.FC<OrderProductAddDialogProps> = props => {
  const {
    confirmButtonState,
    errors: apiErrors,
    open,
    loading,
    hasMore,
    products,
    selectedChannelId,
    onFetch,
    onFetchMore,
    onClose,
    onSubmit,
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
    channelListings,
  }: SearchOrderVariantQuery["search"]["edges"][0]["node"]["variants"][0]) => {
    const currentListing = channelListings.find(
      listing => listing.channel.id === selectedChannelId,
    );

    const listingPrice = currentListing?.price?.amount;

    const isVariantPriceSet =
      listingPrice !== null && listingPrice !== undefined;

    return !!currentListing && isVariantPriceSet;
  };

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
      <DialogTitle>
        <FormattedMessage
          id="myyWNp"
          defaultMessage="Add Product"
          description="dialog header"
        />
      </DialogTitle>
      <DialogContent className={classes.topArea} data-test-id="search-query">
        <TextField
          name="query"
          value={query}
          onChange={onQueryChange}
          label={intl.formatMessage({
            id: "/TF6BZ",
            defaultMessage: "Search Products",
          })}
          placeholder={intl.formatMessage({
            id: "SHm7ee",
            defaultMessage:
              "Search by product name, attribute, product type etc...",
          })}
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
                    <TableRow>
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
                    </TableRow>
                    {maybe(() => product.variants, [])
                      .filter(isValidVariant)
                      .map((variant, variantIndex) => (
                        <TableRow key={variant.id}>
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
                                  id="+HuipK"
                                  defaultMessage="SKU {sku}"
                                  description="variant sku"
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
                        </TableRow>
                      ))}
                  </React.Fragment>
                ),
                () => (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <FormattedMessage
                        id="WQnltU"
                        defaultMessage="No products available in order channel matching given query"
                      />
                    </TableCell>
                  </TableRow>
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
        >
          <FormattedMessage {...buttonMessages.confirm} />
        </ConfirmButton>
      </DialogActions>
    </Dialog>
  );
};
OrderProductAddDialog.displayName = "OrderProductAddDialog";
export default OrderProductAddDialog;
