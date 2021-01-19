import {
  Card,
  CardContent,
  Checkbox,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField
} from "@material-ui/core";
import Money from "@saleor/components/Money";
import Skeleton from "@saleor/components/Skeleton";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import { OrderErrorFragment } from "@saleor/fragments/types/OrderErrorFragment";
import { FormsetChange } from "@saleor/hooks/useFormset";
import { renderCollection } from "@saleor/misc";
import {
  OrderDetails_order,
  OrderDetails_order_lines
} from "@saleor/orders/types/OrderDetails";
import React, { CSSProperties } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import { FormsetQuantityData, FormsetReplacementData } from "../form";
import { getById } from "../utils";
import CardTitle from "./CardTitle";
import MaximalButton from "./MaximalButton";
import ProductErrorCell from "./ProductErrorCell";

const useStyles = makeStyles(
  theme => {
    const inputPadding: CSSProperties = {
      paddingBottom: theme.spacing(2),
      paddingTop: theme.spacing(2)
    };

    return {
      cartContent: {
        paddingBottom: 0,
        paddingTop: 0
      },

      notice: {
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(2)
      },

      quantityInnerInput: {
        ...inputPadding
      },
      quantityInnerInputNoRemaining: {
        paddingRight: 0
      },
      remainingQuantity: {
        ...inputPadding,
        color: theme.palette.text.secondary,
        whiteSpace: "nowrap"
      },
      setMaximalQuantityButton: {
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(2),
        padding: 0
      }
    };
  },
  { name: "ItemsCard" }
);

const messages = defineMessages({
  improperValue: {
    defaultMessage: "Improper value",
    description: "error message"
  },

  titleFulfilled: {
    defaultMessage: "Fulfillment - #{fulfilmentId}",
    description: "section header"
  },
  titleUnfulfilled: {
    defaultMessage: "Unfulfilled Items",
    description: "section header"
  }
});

interface OrderReturnRefundLinesCardProps {
  onChangeQuantity: FormsetChange<number>;
  fulfilmentId?: string;
  canReplace?: boolean;
  errors: OrderErrorFragment[];
  lines: OrderDetails_order_lines[];
  order: OrderDetails_order;
  itemsSelections: FormsetReplacementData;
  itemsQuantities: FormsetQuantityData;
  onChangeSelected: FormsetChange<boolean>;
  onSetMaxQuantity();
}

const ItemsCard: React.FC<OrderReturnRefundLinesCardProps> = ({
  lines,
  onSetMaxQuantity,
  onChangeQuantity,
  onChangeSelected,
  itemsSelections,
  itemsQuantities,
  fulfilmentId,
  order
}) => {
  const classes = useStyles({});
  const intl = useIntl();

  const handleChangeQuantity = (id: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => onChangeQuantity(id, parseInt(event.target.value, 10));

  const fulfillment = order?.fulfillments.find(getById(fulfilmentId));

  return (
    <Card>
      <CardTitle
        orderNumber={order?.number}
        lines={lines}
        fulfillmentOrder={fulfillment?.fulfillmentOrder}
        status={fulfillment?.status}
      />
      <CardContent className={classes.cartContent}>
        <MaximalButton onClick={onSetMaxQuantity} />
      </CardContent>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <FormattedMessage
                defaultMessage="Product"
                description="table column header"
              />
            </TableCell>
            <TableCell />
            <TableCell align="right">
              <FormattedMessage
                defaultMessage="Price"
                description="table column header"
              />
            </TableCell>
            <TableCell align="right">
              <FormattedMessage
                defaultMessage="Return"
                description="table column header"
              />
            </TableCell>
            <TableCell align="center">
              <FormattedMessage
                defaultMessage="Replace"
                description="table column header"
              />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {renderCollection(
            lines,
            line => {
              const {
                quantity,
                quantityFulfilled,
                id,
                thumbnail,
                unitPrice,
                productName,
                variant
              } = line;
              const isValueError = false;
              const isRefunded = itemsQuantities.find(getById(id)).data
                .isRefunded;
              const isReplacable = !!variant && !isRefunded;
              const isReturnable = !!variant;
              const lineQuantity = fulfilmentId
                ? quantity
                : quantity - quantityFulfilled;
              const isSelected = itemsSelections.find(getById(id))?.value;
              const currentQuantity = itemsQuantities.find(getById(id))?.value;
              const anyLineWithoutVariant = lines.some(
                ({ variant }) => !variant
              );
              const productNameCellWidth = anyLineWithoutVariant
                ? "30%"
                : "50%";

              return (
                <TableRow key={id}>
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
                        currency: unitPrice.gross.currency
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {isReturnable && (
                      <TextField
                        type="number"
                        inputProps={{
                          className: classes.quantityInnerInput,
                          "data-test": "quantityInput",
                          "data-test-id": id,
                          max: lineQuantity.toString(),
                          min: 0,
                          style: { textAlign: "right" }
                        }}
                        fullWidth
                        value={currentQuantity}
                        onChange={handleChangeQuantity(id)}
                        InputProps={{
                          endAdornment: lineQuantity && (
                            <div className={classes.remainingQuantity}>
                              / {lineQuantity}
                            </div>
                          )
                        }}
                        error={isValueError}
                        helperText={
                          isValueError &&
                          intl.formatMessage(messages.improperValue)
                        }
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {isReplacable && (
                      <Checkbox
                        checked={isSelected}
                        onChange={() => onChangeSelected(id, !isSelected)}
                      />
                    )}
                  </TableCell>
                </TableRow>
              );
            },
            () => (
              <TableRow>
                <TableCell colSpan={4}>
                  <Skeleton />
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default ItemsCard;
