import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import FormSpacer from "@saleor/components/FormSpacer";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import useSearchQuery from "@saleor/hooks/useSearchQuery";
import { buttonMessages } from "@saleor/intl";
import { maybe } from "@saleor/misc";
import { SearchProducts_search_edges_node } from "../../containers/SearchProducts/types/SearchProducts";
import Checkbox from "../Checkbox";

export interface FormData {
  products: SearchProducts_search_edges_node[];
  query: string;
}

const styles = createStyles({
  avatar: {
    "&:first-child": {
      paddingLeft: 0
    }
  },
  checkboxCell: {
    paddingLeft: 0
  },
  overflow: {
    overflowY: "visible"
  },
  scrollArea: {
    overflowY: "scroll"
  },
  wideCell: {
    paddingLeft: 0,
    width: "100%"
  }
});

export interface AssignProductDialogProps {
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

const AssignProductDialog = withStyles(styles, {
  name: "AssignProductDialog"
})(
  ({
    classes,
    confirmButtonState,
    open,
    loading,
    products,
    onClose,
    onFetch,
    onSubmit
  }: AssignProductDialogProps & WithStyles<typeof styles>) => {
    const intl = useIntl();
    const [query, onQueryChange] = useSearchQuery(onFetch);
    const [selectedProducts, setSelectedProducts] = React.useState<
      SearchProducts_search_edges_node[]
    >([]);

    const handleSubmit = () => onSubmit(selectedProducts);

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
            defaultMessage="Assign Product"
            description="dialog header"
          />
        </DialogTitle>
        <DialogContent>
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
          <div className={classes.scrollArea}>
            <Table>
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
                        <TableCell className={classes.wideCell}>
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
            </Table>
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
  }
);
AssignProductDialog.displayName = "AssignProductDialog";
export default AssignProductDialog;
