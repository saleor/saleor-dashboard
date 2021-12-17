import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TableBody,
  TableCell,
  TableRow,
  TextField
} from "@material-ui/core";
import ConfirmButton from "@saleor/components/ConfirmButton";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import useSearchQuery from "@saleor/hooks/useSearchQuery";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { maybe } from "@saleor/misc";
import { SearchProducts_search_edges_node } from "@saleor/searches/types/SearchProducts";
import useScrollableDialogStyle from "@saleor/styles/useScrollableDialogStyle";
import { DialogProps, FetchMoreProps } from "@saleor/types";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { FormattedMessage, useIntl } from "react-intl";

import BackButton from "../BackButton";
import Checkbox from "../Checkbox";
import { messages } from "./messages";
import { useStyles } from "./styles";

export interface AssignProductDialogFormData {
  products: SearchProducts_search_edges_node[];
  query: string;
}

export interface AssignProductDialogProps extends FetchMoreProps, DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  products: SearchProducts_search_edges_node[];
  loading: boolean;
  onFetch: (value: string) => void;
  onSubmit: (data: string[]) => void;
}

function handleProductAssign(
  productID: string,
  isSelected: boolean,
  selectedProducts: string[],
  setSelectedProducts: (data: string[]) => void
) {
  if (isSelected) {
    setSelectedProducts(
      selectedProducts.filter(selectedProduct => selectedProduct !== productID)
    );
  } else {
    setSelectedProducts([...selectedProducts, productID]);
  }
}

const scrollableTargetId = "assignProductScrollableDialog";

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
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([]);

  const handleSubmit = () => onSubmit(selectedProducts);

  return (
    <Dialog
      onClose={onClose}
      open={open}
      classes={{ paper: scrollableDialogClasses.dialog }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        <FormattedMessage {...messages.assignVariantDialogHeader} />
      </DialogTitle>
      <DialogContent className={scrollableDialogClasses.topArea}>
        <TextField
          name="query"
          value={query}
          onChange={onQueryChange}
          label={intl.formatMessage(messages.assignProductDialogSearch)}
          placeholder={intl.formatMessage(messages.assignProductDialogContent)}
          fullWidth
          InputProps={{
            autoComplete: "off",
            endAdornment: loading && <CircularProgress size={16} />
          }}
        />
      </DialogContent>
      <DialogContent
        className={scrollableDialogClasses.scrollArea}
        id={scrollableTargetId}
      >
        <InfiniteScroll
          dataLength={products?.length}
          next={onFetchMore}
          hasMore={hasMore}
          scrollThreshold="100px"
          loader={
            <div className={scrollableDialogClasses.loadMoreLoaderContainer}>
              <CircularProgress size={16} />
            </div>
          }
          scrollableTarget={scrollableTargetId}
        >
          <ResponsiveTable key="table">
            <TableBody>
              {products &&
                products.map(product => {
                  const isSelected = selectedProducts.some(
                    selectedProduct => selectedProduct === product.id
                  );

                  return (
                    <TableRow
                      key={product.id}
                      data-test-id="assign-product-table-row"
                    >
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
                              product.id,
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
      </DialogContent>
      <DialogActions>
        <BackButton onClick={onClose} />
        <ConfirmButton
          data-test="submit"
          transitionState={confirmButtonState}
          type="submit"
          onClick={handleSubmit}
        >
          <FormattedMessage {...messages.assignProductDialogButton} />
        </ConfirmButton>
      </DialogActions>
    </Dialog>
  );
};
AssignProductDialog.displayName = "AssignProductDialog";
export default AssignProductDialog;
