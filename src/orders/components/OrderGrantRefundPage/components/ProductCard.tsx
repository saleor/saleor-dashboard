import { Button } from "@dashboard/components/Button";
import CardTitle from "@dashboard/components/CardTitle";
import TableCellAvatar from "@dashboard/components/TableCellAvatar";
import TableRowLink from "@dashboard/components/TableRowLink";
import { OrderLineGrantRefundFragment } from "@dashboard/graphql";
import { renderCollection } from "@dashboard/misc";
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TextField,
} from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";

import { useGrantRefundContext } from "../context";
import { grantRefundPageMessages, productCardMessages } from "../messages";
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

  const getHandleAmountChange =
    (line: OrderLineGrantRefundFragment) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
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
          <Button
            variant="secondary"
            onClick={handleSetMaxQuanity}
            data-test-id="setMaxQuantityButton"
          >
            <FormattedMessage {...grantRefundPageMessages.setMaxQuantity} />
          </Button>
        }
      ></CardTitle>
      <Table>
        <TableHead>
          <TableCell className={classes.colProduct}>
            <FormattedMessage {...productCardMessages.product} />
          </TableCell>
          <TableCell className={classes.colQuantity}>
            <FormattedMessage {...productCardMessages.quantity} />
          </TableCell>
          <TableCell className={classes.colQuantityInput}>
            <FormattedMessage {...productCardMessages.qtyToRefund} />
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
