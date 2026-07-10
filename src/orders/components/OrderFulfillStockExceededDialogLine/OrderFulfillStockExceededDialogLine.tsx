// @ts-strict-ignore
import TableCellAvatar from "@dashboard/components/TableCellAvatar";
import TableRowLink from "@dashboard/components/TableRowLink";
import { type FulfillmentFragment, type OrderFulfillLineFragment } from "@dashboard/graphql";
import {
  getAttributesCaption,
  getFulfillmentFormsetQuantity,
  getOrderLineAvailableQuantity,
  type OrderFulfillStockFormsetData,
} from "@dashboard/orders/utils/data";
import { TableCell } from "@material-ui/core";
import { Text } from "@saleor/macaw-ui-next";

import { OrderFulfillProductCellContent } from "../OrderFulfillLine/OrderFulfillProductCellContent";
import { useStyles } from "../OrderFulfillStockExceededDialog/styles";

interface OrderFulfillStockExceededDialogLineProps {
  line: OrderFulfillLineFragment | FulfillmentFragment["lines"][0];
  warehouse: { id: string; name: string } | undefined;
  formsetData: OrderFulfillStockFormsetData;
}

export const OrderFulfillStockExceededDialogLine = (
  props: OrderFulfillStockExceededDialogLineProps,
) => {
  const { line: genericLine, warehouse, formsetData } = props;
  const classes = useStyles(props);

  if (!genericLine) {
    return null;
  }

  const line = "orderLine" in genericLine ? genericLine.orderLine : genericLine;
  const stock = line?.variant?.stocks.find(stock => stock.warehouse.id === warehouse?.id);
  const toFulfill = getFulfillmentFormsetQuantity(formsetData, line);
  const available = getOrderLineAvailableQuantity(line, stock);
  const shortfall = toFulfill - available;

  return (
    <TableRowLink key={line?.id}>
      <TableCellAvatar className={classes.colName} thumbnail={line?.thumbnail?.url}>
        <OrderFulfillProductCellContent
          productName={line?.productName}
          attributesCaption={
            line.variant && "attributes" in line.variant
              ? getAttributesCaption(line.variant?.attributes)
              : undefined
          }
        >
          {warehouse?.name ? (
            <Text color="default2" size={2} fontWeight="light">
              {warehouse.name}
            </Text>
          ) : null}
        </OrderFulfillProductCellContent>
      </TableCellAvatar>
      <TableCell className={classes.colQuantity}>{toFulfill}</TableCell>
      <TableCell className={classes.colWarehouseStock}>
        <Text color={shortfall > 0 ? "critical1" : undefined}>{available}</Text>
      </TableCell>
      <TableCell className={classes.colShort}>
        <Text color="critical1">{shortfall}</Text>
      </TableCell>
    </TableRowLink>
  );
};

OrderFulfillStockExceededDialogLine.displayName = "OrderFulfillStockExceededDialogLine";
