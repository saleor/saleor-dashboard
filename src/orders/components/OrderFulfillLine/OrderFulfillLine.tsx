import { TableCell, TableRow, TextField, Typography } from "@material-ui/core";
import Debounce from "@saleor/components/Debounce";
import SingleAutocompleteSelectField from "@saleor/components/SingleAutocompleteSelectField";
import Skeleton from "@saleor/components/Skeleton";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import { OrderFulfillLineFragment } from "@saleor/graphql";
import { FormsetChange, FormsetData } from "@saleor/hooks/useFormset";
import { Tooltip, WarningIcon } from "@saleor/macaw-ui";
import {
  getAttributesCaption,
  getOrderLineAvailableQuantity,
  getWarehouseStock,
  OrderFulfillLineFormData,
} from "@saleor/orders/utils/data";
import useWarehouseSearch from "@saleor/searches/useWarehouseSearch";
import { mapEdgesToItems, mapNodeToChoice } from "@saleor/utils/maps";
import classNames from "classnames";
import React from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";
import { useStyles } from "./styles";

interface OrderFulfillLineProps {
  line: OrderFulfillLineFragment;
  lineIndex: number;
  formsetData: FormsetData<null, OrderFulfillLineFormData[]>;
  formsetChange: FormsetChange<OrderFulfillLineFormData[]>;
}

export const OrderFulfillLine: React.FC<OrderFulfillLineProps> = props => {
  const { line, lineIndex, formsetData, formsetChange } = props;
  const classes = useStyles();
  const intl = useIntl();

  const isDeletedVariant = !line?.variant;
  const isPreorder = !!line.variant?.preorder;
  const lineFormQuantity = isPreorder
    ? 0
    : formsetData[lineIndex]?.value?.[0]?.quantity;
  const lineFormWarehouse = formsetData[lineIndex]?.value?.[0]?.warehouse;

  const overfulfill = lineFormQuantity > line.quantityToFulfill;

  // const [selectedWarehouse, setSelectedWarehouse] = React.useState(lineFormWarehouse);

  const warehouseStock = getWarehouseStock(
    line?.variant?.stocks,
    lineFormWarehouse?.id,
  );
  const availableQuantity = getOrderLineAvailableQuantity(line, warehouseStock);

  const isStockExceeded = lineFormQuantity > availableQuantity;

  const { result: warehousesOpts, loadMore, search } = useWarehouseSearch({
    variables: {
      after: null,
      first: 20,
      query: "",
    },
  });

  const filteredWarehouses =
    mapEdgesToItems(warehousesOpts?.data?.search) || [];
  const warehouses =
    !lineFormWarehouse ||
    filteredWarehouses.some(warehouse => warehouse.id === lineFormWarehouse.id)
      ? filteredWarehouses
      : [lineFormWarehouse, ...filteredWarehouses];

  const warehousesOptions = mapNodeToChoice(warehouses);

  if (!line || !lineFormWarehouse) {
    return (
      <TableRow key={lineIndex}>
        <TableCellAvatar className={classes.colName}>
          <Skeleton />
        </TableCellAvatar>
        <TableCell className={classes.colSku}>
          <Skeleton />
        </TableCell>
        <TableCell className={classes.colQuantity}>
          <Skeleton />
        </TableCell>
        <TableCell className={classes.colStock}>
          <Skeleton />
        </TableCell>
        <TableCell className={classes.colWarehouse}>
          <Skeleton />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow key={line.id}>
      <TableCellAvatar
        className={classes.colName}
        thumbnail={line?.thumbnail?.url}
        badge={
          isPreorder || !line?.variant ? (
            <Tooltip
              variant="warning"
              title={intl.formatMessage(
                isPreorder
                  ? messages.preorderWarning
                  : messages.deletedVariantWarning,
              )}
            >
              <div className={classes.warningIcon}>
                <WarningIcon />
              </div>
            </Tooltip>
          ) : (
            undefined
          )
        }
      >
        {line.productName}
        <Typography color="textSecondary" variant="caption">
          {getAttributesCaption(line.variant?.attributes)}
        </Typography>
      </TableCellAvatar>
      <TableCell className={classes.colSku}>{line.variant?.sku}</TableCell>
      {isPreorder ? (
        <TableCell className={classes.colQuantity} />
      ) : (
        <TableCell
          className={classes.colQuantity}
          key={warehouseStock?.id ?? "deletedVariant" + lineIndex}
        >
          <TextField
            type="number"
            inputProps={{
              className: classNames(classes.quantityInnerInput, {
                [classes.quantityInnerInputNoRemaining]: !line.variant
                  ?.trackInventory,
              }),
              min: 0,
              style: { textAlign: "right" },
            }}
            fullWidth
            value={lineFormQuantity}
            onChange={event =>
              formsetChange(line.id, [
                {
                  quantity: parseInt(event.target.value, 10),
                  warehouse: lineFormWarehouse,
                },
              ])
            }
            error={overfulfill}
            variant="outlined"
            InputProps={{
              classes: {
                ...(isStockExceeded &&
                  !overfulfill && {
                    notchedOutline: classes.warning,
                  }),
              },
              endAdornment: (
                <div className={classes.remainingQuantity}>
                  / {line.quantityToFulfill}
                </div>
              ),
            }}
          />
        </TableCell>
      )}
      <TableCell className={classes.colStock} key="total">
        {isPreorder || isDeletedVariant ? undefined : availableQuantity}
      </TableCell>
      <TableCell className={classes.colWarehouse}>
        <Debounce debounceFn={search}>
          {debounceSearchChange => (
            <SingleAutocompleteSelectField
              data-test-id="address-edit-country-select-field"
              displayValue={lineFormWarehouse.name}
              // error={!!formErrors.country}
              // helperText={getErrorMessage(formErrors.country, intl)}
              label={intl.formatMessage(messages.warehouse)}
              name="warehouse"
              onChange={event =>
                formsetChange(line.id, [
                  {
                    quantity: lineFormQuantity,
                    warehouse: warehouses.find(
                      ({ id }) => id === event.target.value,
                    ),
                  },
                ])
              }
              value={lineFormWarehouse.id}
              fetchChoices={debounceSearchChange}
              choices={warehousesOptions}
              hasMore={warehousesOpts.data?.search.pageInfo.hasNextPage}
              onFetchMore={loadMore}
            />
          )}
        </Debounce>
      </TableCell>
    </TableRow>
  );
};
OrderFulfillLine.displayName = "OrderFulfillLine";
export default OrderFulfillLine;
