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
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import FormSpacer from "@saleor/components/FormSpacer";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import useSearchQuery from "@saleor/hooks/useSearchQuery";
import { buttonMessages } from "@saleor/intl";
import { maybe } from "@saleor/misc";
import { SearchProducts_search_edges_node } from "@saleor/searches/types/SearchProducts";
import useScrollableDialogStyle from "@saleor/styles/useScrollableDialogStyle";
import { FetchMoreProps } from "@saleor/types";
import React from "react";
import InfiniteScroll from "react-infinite-scroller";
import { FormattedMessage, useIntl } from "react-intl";

import Checkbox from "../Checkbox";

export interface FormData {
  products: SearchProducts_search_edges_node[];
  query: string;
}

const useStyles = makeStyles(
  {
    avatar: {
      "&&:first-child": {
        paddingLeft: 0
      },
      width: 72
    },
    checkboxCell: {
      paddingLeft: 0,
      width: 88
    },
    colName: {
      paddingLeft: 0
    }
  },
  { name: "AssignProductDialog" }
);

export interface AssignProductDialogProps extends FetchMoreProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  products: SearchProducts_search_edges_node[];
  loading: boolean;
  onClose: () => void;
  onFetch: (value: string) => void;
  onSubmit: (data: SearchProducts_search_edges_node[]) => void;
}

function handleProductAssign(
  product: SearchProducts_search_edges_node,
  isSelected: boolean,
  selectedProducts: SearchProducts_search_edges_node[],
  setSelectedProducts: (data: SearchProducts_search_edges_node[]) => void
) {
  if (isSelected) {
    setSelectedProducts(
      selectedProducts.filter(
        selectedProduct => selectedProduct.id !== product.id
      )
    );
  } else {
    setSelectedProducts([...selectedProducts, product]);
  }
}

const AssignProductDialog: React.FC<AssignProductDialogProps> = props => {
  const {
    confirmButtonState,
    hasMore,
    open,
    loading,
    products,
    onClose,
    onFetch,
    onFetchMore,
    onSubmit
  } = props;
  const classes = useStyles(props);
  const scrollableDialogClasses = useScrollableDialogStyle({});

  const intl = useIntl();
  const [query, onQueryChange] = useSearchQuery(onFetch);
  const [selectedProducts, setSelectedProducts] = React.useState<
    SearchProducts_search_edges_node[]
  >([]);
  const container = React.useRef<HTMLDivElement>();

  const handleSubmit = () => onSubmit(selectedProducts);

  const containerHeight = container.current?.scrollHeight - 130;

  return (
    <Dialog
      onClose={onClose}
      open={open}
      classes={{ paper: scrollableDialogClasses.dialog }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        <FormattedMessage
          defaultMessage="Assign Product"
          description="dialog header"
        />
      </DialogTitle>
      <DialogContent
        className={scrollableDialogClasses.content}
        ref={container}
      >
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
        <FormSpacer />
        <div
          className={scrollableDialogClasses.scrollArea}
          style={{ height: containerHeight }}
        >
          <InfiniteScroll
            pageStart={0}
            loadMore={onFetchMore}
            hasMore={hasMore}
            useWindow={false}
            loader={
              <div className={scrollableDialogClasses.loadMoreLoaderContainer}>
                <CircularProgress size={16} />
              </div>
            }
            threshold={10}
          >
            <ResponsiveTable key="table">
              <TableBody>
                {products &&
                  products.map(product => {
                    const isSelected = selectedProducts.some(
                      selectedProduct => selectedProduct.id === product.id
                    );

                    return (
                      <TableRow key={product.id}>
                        <TableCellAvatar
                          className={classes.avatar}
                          thumbnail={maybe(() => product.thumbnail.url)}
                        />
                        <TableCell className={classes.colName}>
                          {product.name}
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          className={classes.checkboxCell}
                        >
                          <Checkbox
                            checked={isSelected}
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
                      </TableRow>
                    );
                  })}
              </TableBody>
            </ResponsiveTable>
          </InfiniteScroll>
        </div>
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
          <FormattedMessage
            defaultMessage="Assign products"
            description="button"
          />
        </ConfirmButton>
      </DialogActions>
    </Dialog>
  );
};
AssignProductDialog.displayName = "AssignProductDialog";
export default AssignProductDialog;
