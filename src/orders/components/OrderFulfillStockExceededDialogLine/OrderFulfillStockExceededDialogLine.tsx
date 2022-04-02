import { TableCell, TableRow, Typography } from "@material-ui/core";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import {
  OrderFulfillLineFragment,
  OrderFulfillStockInput
} from "@saleor/graphql";
import { FormsetData } from "@saleor/hooks/useFormset";
import {
  getFulfillmentFormsetQuantity,
  getOrderLineAvailableQuantity
} from "@saleor/orders/utils/data";
import React from "react";

import { useStyles } from "../OrderFulfillStockExceededDialog/styles";

export interface OrderFulfillStockExceededDialogLineProps {
  line: OrderFulfillLineFragment;
  warehouseId: string;
  formsetData: FormsetData<null, OrderFulfillStockInput[]>;
}

const OrderFulfillStockExceededDialogLine: React.FC<OrderFulfillStockExceededDialogLineProps> = props => {
  const { line, warehouseId, formsetData } = props;

  const classes = useStyles(props);

  const stock = line.variant?.stocks.find(
    stock => stock.warehouse.id === warehouseId
  );

  return (
    <TableRow key={line?.id}>
      <TableCellAvatar
        className={classes.colName}
        thumbnail={line?.thumbnail?.url}
      >
        {line?.productName}
        <Typography color="textSecondary" variant="caption">
          {line.variant?.attributes
            .map(attribute =>
              attribute.values
                .map(attributeValue => attributeValue.name)
                .join(", ")
            )
            .join(" / ")}
        </Typography>
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
