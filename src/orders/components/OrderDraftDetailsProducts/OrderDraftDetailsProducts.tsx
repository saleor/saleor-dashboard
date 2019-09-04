import IconButton from "@material-ui/core/IconButton";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import { FormattedMessage } from "react-intl";

import Debounce from "@saleor/components/Debounce";
import Money from "@saleor/components/Money";
import Skeleton from "@saleor/components/Skeleton";
import TableCellAvatar, {
  AVATAR_MARGIN
} from "@saleor/components/TableCellAvatar";
import { updateAtIndex } from "@saleor/utils/lists";
import { maybe, renderCollection } from "../../../misc";
import { OrderDetails_order_lines } from "../../types/OrderDetails";

const styles = (theme: Theme) =>
  createStyles({
    colAction: {
      "&:last-child": {
        paddingRight: 0
      },
      width: 76 + theme.spacing.unit / 2
    },
    colName: {
      width: "auto"
    },
    colNameLabel: {
      marginLeft: AVATAR_MARGIN
    },
    colPrice: {
      textAlign: "right",
      width: 150
    },
    colQuantity: {
      textAlign: "right",
      width: 140
    },
    colTotal: {
      textAlign: "right",
      width: 150
    },
    quantityField: {
      "& input": {
        padding: "12px 12px 10px",
        textAlign: "right"
      }
    },
    table: {
      tableLayout: "fixed"
    }
  });

interface OrderDraftDetailsProductsProps extends WithStyles<typeof styles> {
  lines: OrderDetails_order_lines[];
  onOrderLineChange: (id: string, quantity: number) => void;
  onOrderLineRemove: (id: string) => void;
}

const OrderDraftDetailsProducts = withStyles(styles, {
  name: "OrderDraftDetailsProducts"
})(
  ({
    classes,
    lines,
    onOrderLineChange,
    onOrderLineRemove
  }: OrderDraftDetailsProductsProps) => {
    const initialLinesQuantity = lines ? lines.map(line => line.quantity) : [];
    const [linesQuantity, setLinesQuantity] = React.useState<number[]>(
      initialLinesQuantity
    );

    React.useEffect(() => setLinesQuantity(initialLinesQuantity), [
      lines ? lines.map(line => line.id).join(":") : ""
    ]);

    return (
      <Table className={classes.table}>
        {maybe(() => !!lines.length) && (
          <TableHead>
            <TableRow>
              <TableCell className={classes.colName}>
                <span className={classes.colNameLabel}>
                  <FormattedMessage defaultMessage="Product" />
                </span>
              </TableCell>
              <TableCell className={classes.colQuantity}>
                <FormattedMessage
                  defaultMessage="Quantity"
                  description="quantity of ordered products"
                />
              </TableCell>
              <TableCell className={classes.colPrice}>
                <FormattedMessage
                  defaultMessage="Price"
                  description="price or ordered products"
                />
              </TableCell>
              <TableCell className={classes.colTotal}>
                <FormattedMessage
                  defaultMessage="Total"
                  description="total price of ordered products"
                />
              </TableCell>
              <TableCell className={classes.colAction} />
            </TableRow>
          </TableHead>
        )}
        <TableBody>
          {maybe(() => lines.length) === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>
                <FormattedMessage defaultMessage="No Products added to Order" />
              </TableCell>
            </TableRow>
          ) : (
            renderCollection(lines, (line, lineIndex) => (
              <TableRow key={line ? line.id : "skeleton"}>
                <TableCellAvatar
                  className={classes.colName}
                  thumbnail={maybe(() => line.thumbnail.url)}
                >
                  {maybe(() => line.productName && line.productSku) ? (
                    <>
                      <Typography variant="body2">
                        {line.productName}
                      </Typography>
                      <Typography variant="caption">
                        {line.productSku}
                      </Typography>
                    </>
                  ) : (
                    <Skeleton />
                  )}
                </TableCellAvatar>
                <TableCell className={classes.colQuantity}>
                  {maybe(() => line.quantity) ? (
                    <Debounce
                      debounceFn={() =>
                        onOrderLineChange(line.id, linesQuantity[lineIndex])
                      }
                    >
                      {onLineChange => {
                        const handleChange = (
                          event: React.ChangeEvent<any>
                        ) => {
                          onLineChange();
                          setLinesQuantity(
                            updateAtIndex(
                              event.target.value,
                              linesQuantity,
                              lineIndex
                            )
                          );
                        };

                        return (
                          <TextField
                            className={classes.quantityField}
                            fullWidth
                            name="quantity"
                            type="number"
                            value={linesQuantity[lineIndex]}
                            onChange={handleChange}
                          />
                        );
                      }}
                    </Debounce>
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
                <TableCell className={classes.colPrice}>
                  {maybe(() => line.unitPrice.net) ? (
                    <Money money={line.unitPrice.net} />
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
                <TableCell className={classes.colTotal}>
                  {maybe(() => line.unitPrice.net && line.quantity) ? (
                    <Money
                      money={{
                        amount: line.unitPrice.net.amount * line.quantity,
                        currency: line.unitPrice.net.currency
                      }}
                    />
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
                <TableCell className={classes.colAction}>
                  <IconButton onClick={() => onOrderLineRemove(line.id)}>
                    <DeleteIcon color="primary" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    );
  }
);
OrderDraftDetailsProducts.displayName = "OrderDraftDetailsProducts";
export default OrderDraftDetailsProducts;
