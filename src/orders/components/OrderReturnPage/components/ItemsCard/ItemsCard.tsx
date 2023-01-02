import {
  Card,
  CardContent,
  Checkbox,
  TableBody,
  TableCell,
  TableHead,
  TextField,
} from "@material-ui/core";
import Money from "@saleor/components/Money";
import Skeleton from "@saleor/components/Skeleton";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import TableRowLink from "@saleor/components/TableRowLink";
import {
  OrderDetailsFragment,
  OrderErrorFragment,
  OrderLineFragment,
} from "@saleor/graphql";
import { FormsetChange } from "@saleor/hooks/useFormset";
import { ResponsiveTable } from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
import OrderCardTitle from "@saleor/orders/components/OrderCardTitle";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { FormsetQuantityData, FormsetReplacementData } from "../../form";
import {
  getById,
  getQuantityDataFromItems,
  getReplacementDataFromItems,
} from "../../utils";
import { MaximalButton } from "../MaximalButton";
import { ProductErrorCell } from "../ProductErrorCell";
import { itemsCardMessages } from "./messages";
import { useItemCardStyles } from "./styles";

interface OrderReturnRefundLinesCardProps {
  onChangeQuantity: FormsetChange<number>;
  fulfilmentId?: string;
  canReplace?: boolean;
  errors: OrderErrorFragment[];
  lines: OrderLineFragment[];
  order: OrderDetailsFragment;
  itemsSelections: FormsetReplacementData;
  itemsQuantities: FormsetQuantityData;
  onChangeSelected: FormsetChange<boolean>;
  onSetMaxQuantity();
}

export const ItemsCard: React.FC<OrderReturnRefundLinesCardProps> = ({
  lines,
  onSetMaxQuantity,
  onChangeQuantity,
  onChangeSelected,
  itemsSelections,
  itemsQuantities,
  fulfilmentId,
  order,
}) => {
  const classes = useItemCardStyles({});
  const intl = useIntl();

  const handleChangeQuantity = (id: string) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => onChangeQuantity(id, parseInt(event.target.value, 10));

  const fulfillment = order?.fulfillments.find(getById(fulfilmentId));

  return (
    <Card>
      <OrderCardTitle
        orderNumber={order?.number}
        lines={lines}
        fulfillmentOrder={fulfillment?.fulfillmentOrder}
        status={fulfillment?.status}
      />
      <CardContent className={classes.cartContent}>
        <MaximalButton onClick={onSetMaxQuantity} />
      </CardContent>
      <ResponsiveTable>
        <TableHead>
          <TableRowLink>
            <TableCell>
              <FormattedMessage
                id="aAAxKp"
                defaultMessage="Product"
                description="table column header"
              />
            </TableCell>
            <TableCell />
            <TableCell align="right">
              <FormattedMessage
                id="Y299ST"
                defaultMessage="Price"
                description="table column header"
              />
            </TableCell>
            <TableCell align="right">
              <FormattedMessage
                id="0qg33z"
                defaultMessage="Return"
                description="table column header"
              />
            </TableCell>
            <TableCell align="center">
              <FormattedMessage
                id="ikM00B"
                defaultMessage="Replace"
                description="table column header"
              />
            </TableCell>
          </TableRowLink>
        </TableHead>
        <TableBody>
          {renderCollection(
            lines,
            line => {
              const {
                quantity,
                quantityToFulfill,
                id,
                thumbnail,
                unitPrice,
                productName,
                variant,
              } = line;
              const isValueError = false;
              const { isRefunded, currentQuantity } = getQuantityDataFromItems(
                itemsQuantities,
                id,
              );
              const { isSelected } = getReplacementDataFromItems(
                itemsSelections,
                id,
              );
              const isReplacable = !!variant && !isRefunded;
              const isReturnable = !!variant;
              const isPreorder = !!variant?.preorder;
              const lineQuantity = fulfilmentId ? quantity : quantityToFulfill;
              const anyLineWithoutVariant = lines.some(
                ({ variant }) => !variant,
              );
              const productNameCellWidth = anyLineWithoutVariant
                ? "30%"
                : "50%";

              return (
                <TableRowLink key={id}>
                  <TableCellAvatar
                    thumbnail={thumbnail?.url}
                    style={{ width: productNameCellWidth }}
                  >
                    {productName || <Skeleton />}
                  </TableCellAvatar>
                  <ProductErrorCell hasVariant={isReturnable} />
                  <TableCell align="right">
                    <Money
                      money={{
                        amount: unitPrice.gross.amount,
                        currency: unitPrice.gross.currency,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {isReturnable && (
                      <TextField
                        className={classes.quantityField}
                        type="number"
                        inputProps={{
                          className: classes.quantityInnerInput,
                          "data-test": "quantityInput",
                          "data-test-id": id,
                          max: lineQuantity.toString(),
                          min: 0,
                          style: { textAlign: "right" },
                        }}
                        fullWidth
                        value={currentQuantity}
                        onChange={handleChangeQuantity(id)}
                        InputProps={{
                          endAdornment: lineQuantity && (
                            <div className={classes.remainingQuantity}>
                              / {lineQuantity}
                            </div>
                          ),
                        }}
                        error={isValueError}
                        helperText={
                          isValueError &&
                          intl.formatMessage(itemsCardMessages.improperValue)
                        }
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {isReplacable && !isPreorder && (
                      <Checkbox
                        checked={isSelected}
                        onChange={() => onChangeSelected(id, !isSelected)}
                      />
                    )}
                  </TableCell>
                </TableRowLink>
              );
            },
            () => (
              <TableRowLink>
                <TableCell colSpan={4}>
                  <Skeleton />
                </TableCell>
              </TableRowLink>
            ),
          )}
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};
