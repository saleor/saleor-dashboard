// @ts-strict-ignore
import { FetchResult } from "@apollo/client";
import BackButton from "@dashboard/components/BackButton";
import Checkbox from "@dashboard/components/Checkbox";
import {
  ConfirmButton,
  ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import Skeleton from "@dashboard/components/Skeleton";
import TableCellAvatar from "@dashboard/components/TableCellAvatar";
import TableRowLink from "@dashboard/components/TableRowLink";
import {
  SearchProductsQuery,
  ShippingPriceExcludeProductMutation,
} from "@dashboard/graphql";
import useSearchQuery from "@dashboard/hooks/useSearchQuery";
import { renderCollection } from "@dashboard/misc";
import { FetchMoreProps, RelayToFlat } from "@dashboard/types";
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TableBody,
  TableCell,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    avatar: {
      paddingLeft: 0,
      width: 64,
    },
    colName: {
      paddingLeft: 0,
    },
    searchBar: {
      marginBottom: theme.spacing(3),
    },
    loadMoreLoaderContainer: {
      alignItems: "center",
      display: "flex",
      height: theme.spacing(3),
      justifyContent: "center",
      marginTop: theme.spacing(3),
    },
    overflow: {
      overflowY: "visible",
    },
    productCheckboxCell: {
      "&:first-child": {
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
  }),
  { name: "ShippingMethodProductsAddDialog" },
);

export interface ShippingMethodProductsAddDialogProps extends FetchMoreProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  products: RelayToFlat<SearchProductsQuery["search"]>;
  onClose: () => void;
  onFetch: (query: string) => void;
  onSubmit: (
    ids: string[],
  ) => Promise<FetchResult<ShippingPriceExcludeProductMutation>>;
}

const handleProductAssign = (
  product: RelayToFlat<SearchProductsQuery["search"]>[0],
  isSelected: boolean,
  selectedProducts: RelayToFlat<SearchProductsQuery["search"]>,
  setSelectedProducts: (
    data: RelayToFlat<SearchProductsQuery["search"]>,
  ) => void,
) => {
  if (isSelected) {
    setSelectedProducts(
      selectedProducts.filter(
        selectedProduct => selectedProduct.id !== product.id,
      ),
    );
  } else {
    setSelectedProducts([...selectedProducts, product]);
  }
};

const ShippingMethodProductsAddDialog: React.FC<
  ShippingMethodProductsAddDialogProps
> = props => {
  const {
    confirmButtonState,
    open,
    loading,
    hasMore,
    products,
    onFetch,
    onFetchMore,
    onClose,
    onSubmit,
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();
  const [query, onQueryChange, resetQuery] = useSearchQuery(onFetch);
  const [selectedProducts, setSelectedProducts] = React.useState<
    RelayToFlat<SearchProductsQuery["search"]>
  >([]);

  const handleSubmit = () => {
    onSubmit(selectedProducts.map(product => product.id)).then(() => {
      setSelectedProducts([]);
      resetQuery();
    });
  };

  const handleClose = () => {
    onClose();
    setSelectedProducts([]);
    resetQuery();
  };

  return (
    <Dialog onClose={handleClose} open={open} fullWidth maxWidth="sm">
      <DialogTitle disableTypography>
        <FormattedMessage
          id="xZhxBJ"
          defaultMessage="Assign Products"
          description="dialog header"
        />
      </DialogTitle>
      <DialogContent>
        <div
          data-test-id="assign-products-dialog-content"
          className={classes.searchBar}
        >
          <TextField
            data-test-id="search-bar"
            name="query"
            value={query}
            onChange={onQueryChange}
            label={intl.formatMessage({
              id: "/TF6BZ",
              defaultMessage: "Search Products",
            })}
            placeholder={intl.formatMessage({
              id: "/TF6BZ",
              defaultMessage: "Search Products",
            })}
            fullWidth
            InputProps={{
              autoComplete: "off",
              endAdornment: loading && <CircularProgress size={16} />,
            }}
          />
        </div>
        <div>
          <InfiniteScroll
            dataLength={products?.length ?? 0}
            next={onFetchMore}
            hasMore={hasMore}
            scrollThreshold="100px"
            loader={
              <div key="loader" className={classes.loadMoreLoaderContainer}>
                <CircularProgress size={16} />
              </div>
            }
            height={450}
          >
            <ResponsiveTable key="table">
              <TableBody data-test-id="assign-product-list">
                {renderCollection(
                  products,
                  (product, productIndex) => {
                    const isSelected = selectedProducts.some(
                      selectedProduct => selectedProduct.id === product.id,
                    );
                    return (
                      <React.Fragment
                        key={product ? product.id : `skeleton-${productIndex}`}
                      >
                        <TableRowLink data-test-id="product-row">
                          <TableCell
                            padding="checkbox"
                            className={classes.productCheckboxCell}
                          >
                            {product && (
                              <Checkbox
                                checked={isSelected}
                                disabled={loading}
                                onChange={() =>
                                  handleProductAssign(
                                    product,
                                    isSelected,
                                    selectedProducts,
                                    setSelectedProducts,
                                  )
                                }
                              />
                            )}
                          </TableCell>
                          <TableCellAvatar
                            className={classes.avatar}
                            thumbnail={product?.thumbnail?.url}
                          />
                          <TableCell className={classes.colName} colSpan={2}>
                            {product?.name || <Skeleton />}
                          </TableCell>
                        </TableRowLink>
                      </React.Fragment>
                    );
                  },
                  () => (
                    <TableRowLink>
                      <TableCell colSpan={4}>
                        <FormattedMessage
                          id="5ZvuVw"
                          defaultMessage="No products matching given query"
                        />
                      </TableCell>
                    </TableRowLink>
                  ),
                )}
              </TableBody>
            </ResponsiveTable>
          </InfiniteScroll>
        </div>
      </DialogContent>
      <DialogActions>
        <BackButton onClick={handleClose} />
        <ConfirmButton
          data-test-id="assign-and-save-button"
          transitionState={confirmButtonState}
          type="submit"
          disabled={loading || !selectedProducts?.length}
          onClick={handleSubmit}
        >
          <FormattedMessage
            id="FzEew9"
            defaultMessage="Assign and save"
            description="assign products to shipping rate and save, button"
          />
        </ConfirmButton>
      </DialogActions>
    </Dialog>
  );
};
ShippingMethodProductsAddDialog.displayName = "ShippingMethodProductsAddDialog";
export default ShippingMethodProductsAddDialog;
