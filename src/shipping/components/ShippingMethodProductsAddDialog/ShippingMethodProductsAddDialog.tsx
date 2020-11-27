import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
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
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import useSearchQuery from "@saleor/hooks/useSearchQuery";
import { buttonMessages } from "@saleor/intl";
import { renderCollection } from "@saleor/misc";
import { SearchShippingProducts_search_edges_node } from "@saleor/shipping/types/SearchShippingProducts";
import { ChannelProps, FetchMoreProps } from "@saleor/types";
import React from "react";
import InfiniteScroll from "react-infinite-scroller";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    avatar: {
      paddingLeft: 0,
      width: 64
    },
    colName: {
      paddingLeft: 0
    },
    content: {
      overflowY: "scroll"
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
    }
  }),
  { name: "ShippingMethodProductsAddDialog" }
);

export interface ShippingMethodProductsAddDialogProps
  extends FetchMoreProps,
    ChannelProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  products: SearchShippingProducts_search_edges_node[];
  onClose: () => void;
  onFetch: (query: string) => void;
  onSubmit: (ids: string[]) => void;
}

const handleProductAssign = (
  product: SearchShippingProducts_search_edges_node,
  isSelected: boolean,
  selectedProducts: SearchShippingProducts_search_edges_node[],
  setSelectedProducts: (
    data: SearchShippingProducts_search_edges_node[]
  ) => void
) => {
  if (isSelected) {
    setSelectedProducts(
      selectedProducts.filter(
        selectedProduct => selectedProduct.id !== product.id
      )
    );
  } else {
    setSelectedProducts([...selectedProducts, product]);
  }
};

const ShippingMethodProductsAddDialog: React.FC<ShippingMethodProductsAddDialogProps> = props => {
  const {
    confirmButtonState,
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
  const [selectedProducts, setSelectedProducts] = React.useState<
    SearchShippingProducts_search_edges_node[]
  >([]);

  const handleSubmit = () =>
    onSubmit(selectedProducts.map(product => product.id));

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
          defaultMessage="Assign Products"
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
            defaultMessage: "Search Products"
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
                products,
                (product, productIndex) => {
                  const isSelected = selectedProducts.some(
                    selectedProduct => selectedProduct.id === product.id
                  );
                  return product?.channelListings.some(
                    listing => listing.channel.id === selectedChannelId
                  ) ? (
                    <React.Fragment
                      key={product ? product.id : `skeleton-${productIndex}`}
                    >
                      <TableRow>
                        <TableCell
                          padding="checkbox"
                          className={classes.productCheckboxCell}
                        >
                          <Checkbox
                            checked={isSelected}
                            disabled={loading}
                            onChange={() =>
                              handleProductAssign(
                                product,
                                isSelected,
                                selectedProducts,
                                setSelectedProducts
                              )
                            }
                          />
                        </TableCell>
                        <TableCellAvatar
                          className={classes.avatar}
                          thumbnail={product?.thumbnail.url}
                        />
                        <TableCell className={classes.colName} colSpan={2}>
                          {product?.name}
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ) : null;
                },
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
ShippingMethodProductsAddDialog.displayName = "ShippingMethodProductsAddDialog";
export default ShippingMethodProductsAddDialog;
