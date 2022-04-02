import { TableCell, TableRow, Typography } from "@material-ui/core";
import { ClassNameMap } from "@material-ui/styles";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import { FormsetData } from "@saleor/hooks/useFormset";
import { renderCollection } from "@saleor/misc";
import { OrderFulfillData_order_lines } from "@saleor/orders/types/OrderFulfillData";
import { OrderFulfillStockInput } from "@saleor/types/globalTypes";
import React from "react";

import { useStyles } from "../OrderFulfillStockExceededDialog/styles";
import {
  getAllocatedQuantityForLine,
  getFulfillmentFormsetQuantity,
  getOrderLineAvailableQuantity
} from "../OrderFulfillStockExceededDialog/utils";

export interface OrderFulfillStockExceededDialogLinesProps {
  line: OrderFulfillData_order_lines;
  formsetData: FormsetData<null, OrderFulfillStockInput[]>;
  classes: ClassNameMap;
}

const OrderFulfillStockExceededDialogLines: React.FC<OrderFulfillStockExceededDialogLinesProps> = props => {
  const { line, formsetData } = props;

  const classes = useStyles(props);

  const filteredStocks = line.variant.stocks.filter(stock => {
    const allocatedQuantityForLine = getAllocatedQuantityForLine(
      line,
      stock.warehouse
    );
    const availableQuantity =
      stock.quantity - stock.quantityAllocated + allocatedQuantityForLine;
    const formsetQuantity = getFulfillmentFormsetQuantity(
      formsetData,
      line,
      stock
    );
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
        {getFulfillmentFormsetQuantity(formsetData, line, stock)}
      </TableCell>
      <TableCell className={classes.colQuantity}>
        {line.variant.stocks.reduce(
          (partialSum, currentValue) =>
            partialSum + getOrderLineAvailableQuantity(line, currentValue),
          0
        )}
      </TableCell>
      <TableCell className={classes.colWarehouseStock}>
        {getOrderLineAvailableQuantity(line, stock)}
      </TableCell>
    </TableRow>
  ));
};

OrderFulfillStockExceededDialogLines.displayName =
  "OrderFulfillStockExceededDialogLines";
export default OrderFulfillStockExceededDialogLines;
