import { TableCell } from "@material-ui/core";
import Money from "@saleor/components/Money";
import Skeleton from "@saleor/components/Skeleton";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import { AVATAR_MARGIN } from "@saleor/components/TableCellAvatar/Avatar";
import TableRowLink from "@saleor/components/TableRowLink";
import { OrderDetailsFragment, OrderLineFragment } from "@saleor/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import { maybe } from "@saleor/misc";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    colName: {},
    colNameLabel: {
      marginLeft: AVATAR_MARGIN,
    },
    colPrice: {
      textAlign: "right",
    },
    colQuantity: {
      textAlign: "center",
    },
    colSku: {
      textAlign: "right",
      textOverflow: "ellipsis",
    },
    colTotal: {
      textAlign: "right",
    },
    infoLabel: {
      display: "inline-block",
    },
    infoLabelWithMargin: {
      marginBottom: theme.spacing(),
    },
    infoRow: {
      padding: theme.spacing(2, 3),
    },
    orderNumber: {
      display: "inline",
      marginLeft: theme.spacing(1),
    },
    statusBar: {
      paddingTop: 0,
    },
  }),
  { name: "TableLine" },
);

interface TableLineProps {
  line: OrderDetailsFragment["fulfillments"][0]["lines"][0] | OrderLineFragment;
  isOrderLine?: boolean;
}

const TableLine: React.FC<TableLineProps> = ({
  line: lineData,
  isOrderLine = false,
}) => {
  const classes = useStyles({});
  const { quantity, quantityToFulfill } = lineData as OrderLineFragment;

  if (!lineData) {
    return <Skeleton />;
  }

  const line = isOrderLine
    ? ({
        ...lineData,
        orderLine: lineData,
      } as OrderDetailsFragment["fulfillments"][0]["lines"][0])
    : (lineData as OrderDetailsFragment["fulfillments"][0]["lines"][0]);

  const quantityToDisplay = isOrderLine ? quantityToFulfill : quantity;

  return (
    <TableRowLink key={line.id}>
      <TableCellAvatar
        className={classes.colName}
        thumbnail={maybe(() => line.orderLine.thumbnail.url)}
      >
        {maybe(() => line.orderLine.productName) || <Skeleton />}
      </TableCellAvatar>
      <TableCell className={classes.colSku}>
        {line?.orderLine ? line.orderLine.productSku : <Skeleton />}
      </TableCell>
      <TableCell className={classes.colQuantity}>
        {quantityToDisplay || <Skeleton />}
      </TableCell>
      <TableCell className={classes.colPrice} align="right">
        {maybe(() => line.orderLine.unitPrice.gross) ? (
          <Money money={line.orderLine.unitPrice.gross} />
        ) : (
          <Skeleton />
        )}
      </TableCell>
      <TableCell className={classes.colTotal} align="right">
        <Money
          money={{
            amount: line.orderLine.totalPrice.gross.amount,
            currency: line.orderLine.totalPrice.gross.currency,
          }}
        />
      </TableCell>
    </TableRowLink>
  );
};

export default TableLine;
