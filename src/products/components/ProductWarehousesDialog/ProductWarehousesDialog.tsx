import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { FormattedMessage, useIntl, IntlShape } from "react-intl";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { diff, DiffData } from "fast-array-diff";

import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import { buttonMessages } from "@saleor/intl";
import { SearchWarehouses_search_edges_node } from "@saleor/searches/types/SearchWarehouses";
import Skeleton from "@saleor/components/Skeleton";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import { isSelected, toggle } from "@saleor/utils/lists";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { BulkStockErrorFragment } from "@saleor/products/types/BulkStockErrorFragment";
import { StockErrorFragment } from "@saleor/products/types/StockErrorFragment";
import getStockErrorMessage, {
  getBulkStockErrorMessage
} from "@saleor/utils/errors/stock";

const useStyles = makeStyles(
  theme => ({
    dropShadow: {
      boxShadow: `0px -5px 10px 0px ${theme.palette.divider}`
    },
    errorParagraph: {
      paddingTop: 0
    },
    helperText: {
      marginBottom: theme.spacing(1)
    }
  }),
  {
    name: "ProductWarehousesDialog"
  }
);

export interface ProductWarehousesDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  disabled: boolean;
  errors: Array<BulkStockErrorFragment | StockErrorFragment>;
  open: boolean;
  warehouses: SearchWarehouses_search_edges_node[];
  warehousesWithStocks: string[];
  onClose: () => void;
  onConfirm: (data: DiffData<string>) => void;
}

function getErrorMessage(
  err: BulkStockErrorFragment | StockErrorFragment,
  intl: IntlShape
): string {
  switch (err?.__typename) {
    case "BulkStockError":
      return getBulkStockErrorMessage(err, intl);
    default:
      return getStockErrorMessage(err, intl);
  }
}

const ProductWarehousesDialog: React.FC<ProductWarehousesDialogProps> = ({
  confirmButtonState,
  disabled,
  errors,
  onClose,
  onConfirm,
  open,
  warehousesWithStocks,
  warehouses
}) => {
  const classes = useStyles({});
  const intl = useIntl();

  const [selectedWarehouses, setSelectedWarehouses] = useStateFromProps(
    warehousesWithStocks || []
  );

  const handleConfirm = () =>
    onConfirm(diff(warehousesWithStocks, selectedWarehouses));

  return (
    <Dialog onClose={onClose} maxWidth="sm" fullWidth open={open}>
      <DialogTitle>
        <FormattedMessage
          defaultMessage="Edit Warehouses"
          description="dialog header"
        />
      </DialogTitle>
      <form>
        <DialogContent>
          <Typography className={classes.helperText}>
            <FormattedMessage defaultMessage="Select warehouses that stock selected product" />
          </Typography>
          {warehouses === undefined ? (
            <Skeleton />
          ) : (
            warehouses.map(warehouse => (
              <div key={warehouse.id}>
                <ControlledCheckbox
                  checked={isSelected(
                    warehouse.id,
                    selectedWarehouses,
                    (a, b) => a === b
                  )}
                  name={`warehouse:${warehouse.id}`}
                  onChange={() =>
                    setSelectedWarehouses(
                      toggle(
                        warehouse.id,
                        selectedWarehouses,
                        (a, b) => a === b
                      )
                    )
                  }
                  disabled={disabled}
                  label={warehouse.name}
                />
              </div>
            ))
          )}
        </DialogContent>
        {errors.length > 0 && (
          <DialogContent className={classes.errorParagraph}>
            <Typography color="error">
              {getErrorMessage(errors[0], intl)}
            </Typography>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={onClose}>
            <FormattedMessage {...buttonMessages.back} />
          </Button>
          <ConfirmButton
            transitionState={confirmButtonState}
            onClick={handleConfirm}
          >
            <FormattedMessage {...buttonMessages.save} />
          </ConfirmButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

ProductWarehousesDialog.displayName = "ProductWarehousesDialog";
export default ProductWarehousesDialog;
