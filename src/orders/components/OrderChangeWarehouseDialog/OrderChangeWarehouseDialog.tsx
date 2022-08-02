import {
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import Debounce from "@saleor/components/Debounce";
import Skeleton from "@saleor/components/Skeleton";
import { OrderFulfillLineFragment, WarehouseFragment } from "@saleor/graphql";
import { buttonMessages } from "@saleor/intl";
import {
  Button,
  DialogHeader,
  DialogTable,
  isScrolledToBottom,
  isScrolledToTop,
  ScrollShadow,
  SearchIcon,
  useElementScroll,
} from "@saleor/macaw-ui";
import { getLineAvailableQuantityInWarehouse } from "@saleor/orders/utils/data";
import useWarehouseSearch from "@saleor/searches/useWarehouseSearch";
import { mapEdgesToItems } from "@saleor/utils/maps";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { getById } from "../OrderReturnPage/utils";
import { changeWarehouseDialogMessages as messages } from "./messages";
import { useStyles } from "./styles";

export interface OrderChangeWarehouseDialogProps {
  open: boolean;
  line: OrderFulfillLineFragment;
  currentWarehouseId: string;
  onConfirm: (warehouse: WarehouseFragment) => void;
  onClose();
}

export const OrderChangeWarehouseDialog: React.FC<OrderChangeWarehouseDialogProps> = ({
  open,
  line,
  currentWarehouseId,
  onConfirm,
  onClose,
}) => {
  const classes = useStyles();
  const intl = useIntl();

  const { anchor, position, setAnchor } = useElementScroll();
  const topShadow = isScrolledToTop(anchor, position, 20) === false;
  const bottomShadow = isScrolledToBottom(anchor, position, 20) === false;

  const [query, setQuery] = React.useState<string>("");
  const [selectedWarehouseId, setSelectedWarehouseId] = React.useState<
    string | null
  >(null);

  React.useEffect(() => {
    if (currentWarehouseId) {
      setSelectedWarehouseId(currentWarehouseId);
    }
  }, [currentWarehouseId]);

  const { result: warehousesOpts, loadMore, search } = useWarehouseSearch({
    variables: {
      after: null,
      first: 20,
      query: "",
    },
  });
  const filteredWarehouses = mapEdgesToItems(warehousesOpts?.data?.search);

  const selectedWarehouse = filteredWarehouses?.find(
    getById(selectedWarehouseId ?? ""),
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedWarehouseId(e.target.value);
  };
  const handleSubmit = () => {
    onConfirm(selectedWarehouse);
    onClose();
  };

  React.useEffect(() => {
    if (!bottomShadow) {
      loadMore();
    }
  }, [bottomShadow]);

  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <ScrollShadow variant="top" show={topShadow}>
        <DialogHeader onClose={onClose}>
          <FormattedMessage {...messages.dialogTitle} />
        </DialogHeader>

        <DialogContent className={classes.container}>
          <FormattedMessage
            {...messages.dialogDescription}
            values={{
              productName: line?.productName,
            }}
          />
          <Debounce debounceFn={search}>
            {debounceSearchChange => {
              const handleSearchChange = (
                event: React.ChangeEvent<HTMLInputElement>,
              ) => {
                const value = event.target.value;
                setQuery(value);
                debounceSearchChange(value);
              };
              return (
                <TextField
                  className={classes.searchBox}
                  value={query}
                  variant="outlined"
                  onChange={handleSearchChange}
                  placeholder={intl.formatMessage(
                    messages.searchFieldPlaceholder,
                  )}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{ className: classes.searchInput }}
                />
              );
            }}
          </Debounce>

          <Typography className={classes.supportHeader}>
            <FormattedMessage {...messages.warehouseListLabel} />
          </Typography>
        </DialogContent>
      </ScrollShadow>

      <DialogTable ref={setAnchor}>
        {filteredWarehouses ? (
          <RadioGroup
            value={selectedWarehouseId}
            onChange={handleChange}
            className={classes.tableBody}
          >
            {filteredWarehouses.map(warehouse => {
              const lineQuantityInWarehouse = getLineAvailableQuantityInWarehouse(
                line,
                warehouse,
              );
              return (
                <TableRow key={warehouse.id}>
                  <TableCell className={classes.tableCell}>
                    <FormControlLabel
                      value={warehouse.id}
                      control={<Radio color="primary" />}
                      label={
                        <div className={classes.radioLabelContainer}>
                          <span className={classes.warehouseName}>
                            {warehouse.name}
                          </span>
                          <Typography className={classes.supportText}>
                            <FormattedMessage
                              {...messages.productAvailability}
                              values={{
                                productCount: lineQuantityInWarehouse,
                              }}
                            />
                          </Typography>
                        </div>
                      }
                    />
                    {currentWarehouseId === warehouse?.id && (
                      <Typography className={classes.helpText}>
                        <FormattedMessage {...messages.currentSelection} />
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </RadioGroup>
        ) : (
          <Skeleton />
        )}
      </DialogTable>
      <ScrollShadow variant="bottom" show={bottomShadow}>
        <DialogActions>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="primary"
            disabled={!selectedWarehouse}
          >
            {intl.formatMessage(buttonMessages.select)}
          </Button>
        </DialogActions>
      </ScrollShadow>
    </Dialog>
  );
};
OrderChangeWarehouseDialog.displayName = "OrderChangeWarehouseDialog";
export default OrderChangeWarehouseDialog;
