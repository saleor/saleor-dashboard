import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@saleor/components/Checkbox";
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import FormSpacer from "@saleor/components/FormSpacer";
import Money from "@saleor/components/Money";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import { OrderErrorFragment } from "@saleor/fragments/types/OrderErrorFragment";
import useModalDialogErrors from "@saleor/hooks/useModalDialogErrors";
import useModalDialogOpen from "@saleor/hooks/useModalDialogOpen";
import useSearchQuery from "@saleor/hooks/useSearchQuery";
import { buttonMessages } from "@saleor/intl";
import { maybe, renderCollection } from "@saleor/misc";
import { ChannelProps, FetchMoreProps } from "@saleor/types";
import getOrderErrorMessage from "@saleor/utils/errors/order";
import React from "react";
import InfiniteScroll from "react-infinite-scroller";
import { FormattedMessage, useIntl } from "react-intl";

import {
  SearchOrderVariant_search_edges_node,
  SearchOrderVariant_search_edges_node_variants
} from "../../types/SearchOrderVariant";

const useStyles = makeStyles(
  theme => ({
    avatar: {
      paddingLeft: 0,
      width: 64
    },
    colName: {
      paddingLeft: 0
    },
    colVariantCheckbox: {
      padding: 0
    },
    content: {
      overflowY: "scroll"
    },
    grayText: {
      color: theme.palette.text.disabled
    },
    loadMoreLoaderContainer: {
      alignItems: "center",
      display: "flex",
      height: theme.spacing(3),
      justifyContent: "center",
      marginTop: theme.spacing(3)
    },
    overflow: {
      overflowY: "visible"
    },
    productCheckboxCell: {
      "&:first-child": {
        paddingLeft: 0,
        paddingRight: 0
      }
    },
    textRight: {
      textAlign: "right"
    },
    variantCheckbox: {
      left: theme.spacing(),
      position: "relative"
    },
    wideCell: {
      width: "100%"
    }
  }),
  { name: "OrderProductAddDialog" }
);

type SetVariantsAction = (
  data: SearchOrderVariant_search_edges_node_variants[]
) => void;

export interface OrderProductAddDialogProps
  extends FetchMoreProps,
    ChannelProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  open: boolean;
  products: SearchOrderVariant_search_edges_node[];
  onClose: () => void;
  onFetch: (query: string) => void;
  onSubmit: (data: SearchOrderVariant_search_edges_node_variants[]) => void;
}

function hasAllVariantsSelected(
  productVariants: SearchOrderVariant_search_edges_node_variants[],
  selectedVariantsToProductsMap: SearchOrderVariant_search_edges_node_variants[]
): boolean {
  return productVariants.reduce(
    (acc, productVariant) =>
      acc &&
      !!selectedVariantsToProductsMap.find(
        selectedVariant => selectedVariant.id === productVariant.id
      ),
    true
  );
}

function isVariantSelected(
  variant: SearchOrderVariant_search_edges_node_variants,
  selectedVariantsToProductsMap: SearchOrderVariant_search_edges_node_variants[]
): boolean {
  return !!selectedVariantsToProductsMap.find(
    selectedVariant => selectedVariant.id === variant.id
  );
}

const onProductAdd = (
  product: SearchOrderVariant_search_edges_node,
  productIndex: number,
  productsWithAllVariantsSelected: boolean[],
  variants: SearchOrderVariant_search_edges_node_variants[],
  setVariants: SetVariantsAction
) =>
  productsWithAllVariantsSelected[productIndex]
    ? setVariants(
        variants.filter(
          selectedVariant =>
            !product.variants.find(
              productVariant => productVariant.id === selectedVariant.id
            )
        )
      )
    : setVariants([
        ...variants,
        ...product.variants.filter(
          productVariant =>
            !variants.find(
              selectedVariant => selectedVariant.id === productVariant.id
            )
        )
      ]);

const onVariantAdd = (
  variant: SearchOrderVariant_search_edges_node_variants,
  variantIndex: number,
  productIndex: number,
  variants: SearchOrderVariant_search_edges_node_variants[],
  selectedVariantsToProductsMap: boolean[][],
  setVariants: SetVariantsAction
) =>
  selectedVariantsToProductsMap[productIndex][variantIndex]
    ? setVariants(
        variants.filter(selectedVariant => selectedVariant.id !== variant.id)
      )
    : setVariants([...variants, variant]);

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
    onSubmit
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();
  const [query, onQueryChange] = useSearchQuery(onFetch);
  const [variants, setVariants] = React.useState<
    SearchOrderVariant_search_edges_node_variants[]
  >([]);
  const errors = useModalDialogErrors(apiErrors, open);

  useModalDialogOpen(open, {
    onClose: () => setVariants([])
  });

  const productChoices = products.filter(
    product => product.variants?.length > 0
  );
  const selectedVariantsToProductsMap = productChoices
    ? productChoices.map(product =>
        product.variants.map(variant => isVariantSelected(variant, variants))
      )
    : [];
  const productsWithAllVariantsSelected = productChoices
    ? productChoices.map(product =>
        hasAllVariantsSelected(product.variants, variants)
      )
    : [];

  const handleSubmit = () => onSubmit(variants);

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
          defaultMessage="Add Product"
          description="dialog header"
        />
      </DialogTitle>
      <DialogContent className={classes.overflow}>
        <TextField
          name="query"
          value={query}
          onChange={onQueryChange}
          label={intl.formatMessage({
            defaultMessage: "Search Products"
          })}
          placeholder={intl.formatMessage({
            defaultMessage:
              "Search by product name, attribute, product type etc..."
          })}
          fullWidth
          InputProps={{
            autoComplete: "off",
            endAdornment: loading && <CircularProgress size={16} />
          }}
        />
      </DialogContent>
      <DialogContent className={classes.content}>
        <InfiniteScroll
          pageStart={0}
          loadMore={onFetchMore}
          hasMore={hasMore}
          useWindow={false}
          loader={
            <div className={classes.loadMoreLoaderContainer}>
              <CircularProgress size={16} />
            </div>
          }
          threshold={10}
        >
          <ResponsiveTable key="table">
            <TableBody>
              {renderCollection(
                productChoices,
                (product, productIndex) =>
                  product.variants.some(variant =>
                    variant.channelListings.some(
                      listing => listing.channel.id === selectedChannelId
                    )
                  ) ? (
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
                                setVariants
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
                      {maybe(() => product.variants, []).map(
                        (variant, variantIndex) =>
                          variant.channelListings.some(
                            listing => listing.channel.id === selectedChannelId
                          ) ? (
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
                                      setVariants
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell className={classes.colName}>
                                <div>{variant.name}</div>
                                <div className={classes.grayText}>
                                  <FormattedMessage
                                    defaultMessage="SKU {sku}"
                                    description="variant sku"
                                    values={{
                                      sku: variant.sku
                                    }}
                                  />
                                </div>
                              </TableCell>
                              <TableCell className={classes.textRight}>
                                {variant?.channelListings[0]?.price && (
                                  <Money
                                    money={variant.channelListings[0].price}
                                  />
                                )}
                              </TableCell>
                            </TableRow>
                          ) : null
                      )}
                    </React.Fragment>
                  ) : null,
                () => (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <FormattedMessage defaultMessage="No products matching given query" />
                    </TableCell>
                  </TableRow>
                )
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
        <Button onClick={onClose}>
          <FormattedMessage {...buttonMessages.back} />
        </Button>
        <ConfirmButton
          transitionState={confirmButtonState}
          color="primary"
          variant="contained"
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
