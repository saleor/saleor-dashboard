import { TableCell, TableRow, Typography } from "@material-ui/core";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import { FulfillmentFragment, OrderFulfillLineFragment } from "@saleor/graphql";
import {
  getAttributesCaption,
  getFulfillmentFormsetQuantity,
  getOrderLineAvailableQuantity,
  OrderFulfillStockFormsetData,
} from "@saleor/orders/utils/data";
import React from "react";

import { useStyles } from "../OrderFulfillStockExceededDialog/styles";

export interface OrderFulfillStockExceededDialogLineProps {
  line: OrderFulfillLineFragment | FulfillmentFragment["lines"][0];
  warehouseId: string;
  formsetData: OrderFulfillStockFormsetData;
}

const OrderFulfillStockExceededDialogLine: React.FC<OrderFulfillStockExceededDialogLineProps> = props => {
  const { line: genericLine, warehouseId, formsetData } = props;

  const classes = useStyles(props);

  if (!genericLine) {
    return null;
  }

  const line = "orderLine" in genericLine ? genericLine.orderLine : genericLine;

  const stock = line?.variant?.stocks.find(
    stock => stock.warehouse.id === warehouseId,
  );

  return (
    <TableRow key={line?.id}>
      <TableCellAvatar
        className={classes.colName}
        thumbnail={line?.thumbnail?.url}
      >
        {line?.productName}
        {line.variant && "attributes" in line.variant && (
          <Typography color="textSecondary" variant="caption">
            {getAttributesCaption(line.variant?.attributes)}
          </Typography>
        )}
      </TableCellAvatar>
      <TableCell className={classes.colQuantity}>
        {getFulfillmentFormsetQuantity(formsetData, line)}
      </TableCell>
      <TableCell className={classes.colWarehouseStock}>
        {getOrderLineAvailableQuantity(line, stock)}
      </TableCell>
    </TableRow>
  );
};

OrderFulfillStockExceededDialogLine.displayName =
  "OrderFulfillStockExceededDialogLine";
export default OrderFulfillStockExceededDialogLine;
