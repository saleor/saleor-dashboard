import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TextField,
} from "@material-ui/core";
import { Button } from "@saleor/components/Button";
import CardTitle from "@saleor/components/CardTitle";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import TableRowLink from "@saleor/components/TableRowLink";
import { OrderLineGrantRefundFragment } from "@saleor/graphql";
import { renderCollection } from "@saleor/misc";
import React from "react";
import { FormattedMessage } from "react-intl";

import { useGrantRefundContext } from "../context";
import { grantRefundPageMessages } from "../messages";
import { useProductsCardStyles } from "../styles";

interface ProductsCardProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  lines: OrderLineGrantRefundFragment[];
}

export const ProductsCard: React.FC<ProductsCardProps> = ({
  title,
  subtitle,
  lines,
}) => {
  const classes = useProductsCardStyles();
  const { dispatch, state } = useGrantRefundContext();

  if (lines.length === 0) {
    return null;
  }

  const getHandleAmountChange = (line: OrderLineGrantRefundFragment) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const parsedValue = parseInt(e.target.value, 10);
    const value = Number.isNaN(parsedValue) ? 0 : parsedValue;

    dispatch({
      type: "setQuantity",
      lineId: line.id,
      amount: value,
    });
  };

  const handleSetMaxQuanity = () => {
    dispatch({
      type: "setMaxQuantity",
      lineIds: lines.map(line => line.id),
    });
  };

  return (
    <Card>
      <CardTitle
        title={
          <>
            {title}
            {subtitle}
          </>
        }
        toolbar={
          <Button variant="secondary" onClick={handleSetMaxQuanity}>
            <FormattedMessage {...grantRefundPageMessages.setMaxQuantity} />
          </Button>
        }
      ></CardTitle>
      <Table>
        <TableHead>
          <TableCell className={classes.colProduct}>
            <FormattedMessage
              defaultMessage="Product"
              description="grant refund table, column header"
              id="rxlJJ/"
            />
          </TableCell>
          <TableCell className={classes.colQuantity}>
            <FormattedMessage
              defaultMessage="Quantity"
              description="grant refund table, column header"
              id="S5/nSq"
            />
          </TableCell>
          <TableCell className={classes.colQuantityInput}>
            <FormattedMessage
              defaultMessage="Qty to refund"
              description="grant refund table, column header"
              id="1/oauz"
            />
          </TableCell>
        </TableHead>
        <TableBody>
          {renderCollection(
            lines,
            line => (
              <TableRowLink key={line?.id}>
                <TableCellAvatar
                  thumbnail={line?.thumbnail?.url}
                  className={classes.colProduct}
                >
                  <div className={classes.productName}>
                    <span>{line?.productName}</span>
                    <span className={classes.productVariantName}>
                      {line.variantName}
                    </span>
                  </div>
                </TableCellAvatar>
                <TableCell className={classes.colQuantity}>
                  {line.quantity}
                </TableCell>
                <TableCell className={classes.colQuantityInput}>
                  <TextField
                    type="number"
                    inputProps={{
                      className: classes.quantityInnerInput,
                      "data-test-id": "quantityInput" + line?.id,
                      max: (line?.quantity).toString(),
                      min: 0,
                      style: { textAlign: "right" },
                    }}
                    fullWidth
                    value={state.lines.get(line.id)?.selectedQuantity}
                    onChange={getHandleAmountChange(line)}
                    InputProps={{
                      endAdornment: line?.quantity && (
                        <div className={classes.remainingQuantity}>
                          / {line?.quantity}
                        </div>
                      ),
                    }}
                  />
                </TableCell>
              </TableRowLink>
            ),
            () => (
              <TableRowLink>
                <TableCell colSpan={3}>
                  <FormattedMessage
                    id="Q1Uzbb"
                    defaultMessage="No products found"
                  />
                </TableCell>
              </TableRowLink>
            ),
          )}
        </TableBody>
      </Table>
    </Card>
  );
};
