import { TableCell, TableHead, TableRow } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    clickableRow: {
      cursor: "pointer",
    },
    colName: {
      textAlign: "left",
      width: "auto",
    },
    colPrice: {
      textAlign: "right",
      width: 150,
    },
    colQuantity: {
      textAlign: "center",
      width: 110,
    },
    colSku: {
      textAlign: "right",
      textOverflow: "ellipsis",
      width: 140,
    },
    colTotal: {
      textAlign: "right",
      width: 170,
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
    table: {
      tableLayout: "fixed",
    },
  }),
  { name: "TableHeader" },
);

const TableHeader = () => {
  const classes = useStyles({});

  return (
    <>
      <colgroup>
        <col className={classes.colName} />
        <col className={classes.colSku} />
        <col className={classes.colQuantity} />
        <col className={classes.colPrice} />
        <col className={classes.colTotal} />
      </colgroup>
      <TableHead>
        <TableRow>
          <TableCell className={classes.colName}>
            <FormattedMessage
              id="WE8IFE"
              defaultMessage="Product"
              description="product name"
            />
          </TableCell>
          <TableCell className={classes.colSku}>
            <FormattedMessage
              id="8J81ri"
              defaultMessage="SKU"
              description="ordered product sku"
            />
          </TableCell>
          <TableCell className={classes.colQuantity}>
            <FormattedMessage
              id="tvpAXl"
              defaultMessage="Quantity"
              description="ordered product quantity"
            />
          </TableCell>
          <TableCell className={classes.colPrice}>
            <FormattedMessage
              id="b810WJ"
              defaultMessage="Price"
              description="product price"
            />
          </TableCell>
          <TableCell className={classes.colTotal}>
            <FormattedMessage
              id="qT6YYk"
              defaultMessage="Total"
              description="order line total price"
            />
          </TableCell>
        </TableRow>
      </TableHead>
    </>
  );
};

export default TableHeader;
