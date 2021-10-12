import { TableCell, TableRow, Typography } from "@material-ui/core";
import { ClassNameMap } from "@material-ui/styles";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import { FormsetData } from "@saleor/hooks/useFormset";
import { renderCollection } from "@saleor/misc";
import {
  OrderFulfillData_order_lines,
  OrderFulfillData_order_lines_variant_stocks
} from "@saleor/orders/types/OrderFulfillData";
import { OrderFulfillStockInput } from "@saleor/types/globalTypes";
import React from "react";

export interface OrderFulfillStockExceededDialogLinesProps {
  line: OrderFulfillData_order_lines;
  formsetData: FormsetData<null, OrderFulfillStockInput[]>;
  classes: ClassNameMap;
}

const getAvailableQuantity = (
  line: OrderFulfillData_order_lines,
  stock: OrderFulfillData_order_lines_variant_stocks
) => {
  const warehouseAllocation = line.allocations.find(
    allocation => allocation.warehouse.id === stock.warehouse.id
  );
  const allocatedQuantityForLine = warehouseAllocation?.quantity || 0;

  const availableQuantity =
    stock.quantity - stock.quantityAllocated + allocatedQuantityForLine;

  return availableQuantity;
};

const getFormsetQuantity = (
  formsetData: FormsetData<null, OrderFulfillStockInput[]>,
  line: OrderFulfillData_order_lines,
  stock: OrderFulfillData_order_lines_variant_stocks
) =>
  formsetData
    .find(data => data.id === line.id)
    .value.find(val => val.warehouse === stock.warehouse.id).quantity;

const OrderFulfillStockExceededDialogLines: React.FC<OrderFulfillStockExceededDialogLinesProps> = props => {
  const { line, formsetData, classes } = props;

  const filteredStocks = line.variant.stocks.filter(stock => {
    const warehouseAllocation = line.allocations.find(
      allocation => allocation.warehouse.id === stock.warehouse.id
    );
    const allocatedQuantityForLine = warehouseAllocation?.quantity || 0;

    const availableQuantity =
      stock.quantity - stock.quantityAllocated + allocatedQuantityForLine;

    const formsetQuantity = formsetData
      ?.find(data => data.id === line.id)
      ?.value.find(val => val.warehouse === stock.warehouse.id).quantity;
    return availableQuantity < formsetQuantity;
  });

  return renderCollection(filteredStocks, stock => (
    <TableRow key={line?.id + stock?.id}>
      <TableCellAvatar
        className={classes.colName}
        thumbnail={line?.thumbnail.url}
      >
        {line?.productName}
        <Typography color="textSecondary" variant="caption">
          {line.variant.attributes
            .map(attribute =>
              attribute.values
                .map(attributeValue => attributeValue.name)
                .join(", ")
            )
            .join(" / ")}
        </Typography>
      </TableCellAvatar>
      <TableCell className={classes.colQuantity}>
        {getFormsetQuantity(formsetData, line, stock)}
      </TableCell>
      <TableCell className={classes.colQuantity}>
        {line.variant.stocks.reduce(
          (partialSum, currentValue) =>
            partialSum + getAvailableQuantity(line, currentValue),
          0
        )}
      </TableCell>
      <TableCell className={classes.colWarehouseStock}>
        {getAvailableQuantity(line, stock)}
      </TableCell>
    </TableRow>
  ));
};

OrderFulfillStockExceededDialogLines.displayName =
  "OrderFulfillStockExceededDialogLines";
export default OrderFulfillStockExceededDialogLines;
