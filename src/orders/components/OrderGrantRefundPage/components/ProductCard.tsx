import Money from "@dashboard/components/Money";
import TableCellAvatar from "@dashboard/components/TableCellAvatar";
import TableRowLink from "@dashboard/components/TableRowLink";
import { OrderLineGrantRefundFragment } from "@dashboard/graphql";
import { renderCollection } from "@dashboard/misc";
import { Table, TableBody, TableCell, TableHead } from "@material-ui/core";
import { Box, Button, Input, Text } from "@saleor/macaw-ui-next";
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
        unitPrice: line.unitPrice.gross.amount,
      });
    };

  const handleSetMaxQuanity = () => {
    dispatch({
      type: "setMaxQuantity",
      lines: lines.map(line => ({
        id: line.id,
        quantity: state.lines.get(line.id)?.availableQuantity ?? 0,
        unitPrice: line.unitPrice.gross.amount,
      })),
    });
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text typeSize={5} fontWeight="bold">
          {title}
          {subtitle}
        </Text>
        <Button
          variant="secondary"
          onClick={handleSetMaxQuanity}
          data-test-id="setMaxQuantityButton"
        >
          <FormattedMessage {...grantRefundPageMessages.setMaxQuantity} />
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableCell className={classes.colProduct}>
            <FormattedMessage {...productCardMessages.product} />
          </TableCell>
          <TableCell className={classes.colUnitPrice}>
            <FormattedMessage {...productCardMessages.unitPrice} />
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
            line => {
              if (!line) {
                return null;
              }
              const stateLine = state.lines.get(line.id);

              return (
                <TableRowLink key={line.id}>
                  <TableCellAvatar
                    thumbnail={line.thumbnail?.url}
                    className={classes.colProduct}
                  >
                    <div className={classes.productName}>
                      <span>{line.productName}</span>
                      <span>{line.variantName}</span>
                    </div>
                  </TableCellAvatar>
                  <TableCell className={classes.colUnitPrice}>
                    <Money money={line.unitPrice.gross} />
                  </TableCell>
                  <TableCell className={classes.colQuantity}>
                    {line.quantity}
                  </TableCell>
                  <TableCell className={classes.colQuantityInput}>
                    <Input
                      size="small"
                      textAlign="right"
                      type="number"
                      max={stateLine?.availableQuantity}
                      min={0}
                      data-test-id={"quantityInput" + line.id}
                      value={stateLine?.selectedQuantity ?? 0}
                      onChange={getHandleAmountChange(line)}
                      endAdornment={
                        line.quantity && (
                          <Box
                            fontSize="bodySmall"
                            whiteSpace="nowrap"
                            color="default2"
                          >
                            / {stateLine?.availableQuantity}
                          </Box>
                        )
                      }
                    />
                  </TableCell>
                </TableRowLink>
              );
            },
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
    </>
  );
};
