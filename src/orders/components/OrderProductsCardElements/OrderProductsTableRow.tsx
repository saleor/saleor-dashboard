// @ts-strict-ignore
import Money from "@dashboard/components/Money";
import TableCellAvatar from "@dashboard/components/TableCellAvatar";
import { AVATAR_MARGIN } from "@dashboard/components/TableCellAvatar/Avatar";
import TableRowLink from "@dashboard/components/TableRowLink";
import { OrderDetailsFragment, OrderLineFragment } from "@dashboard/graphql";
import { maybe } from "@dashboard/misc";
import { TableCell } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { Skeleton } from "@saleor/macaw-ui-next";

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

const TableLine = ({ line: lineData, isOrderLine = false }: TableLineProps) => {
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
      <TableCell className={classes.colQuantity}>{quantityToDisplay || <Skeleton />}</TableCell>
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
