// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import Money from "@dashboard/components/Money";
import Skeleton from "@dashboard/components/Skeleton";
import TableCellAvatar from "@dashboard/components/TableCellAvatar";
import TableRowLink from "@dashboard/components/TableRowLink";
import { OrderDetailsFragment, OrderErrorFragment, OrderLineFragment } from "@dashboard/graphql";
import { FormsetChange } from "@dashboard/hooks/useFormset";
import { getById, renderCollection } from "@dashboard/misc";
import { Checkbox, TableBody, TableCell, TableHead, TextField } from "@material-ui/core";
import { makeStyles, ResponsiveTable } from "@saleor/macaw-ui";
import React, { CSSProperties } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import OrderCardTitle from "../../OrderCardTitle";
import { FormsetQuantityData, FormsetReplacementData } from "../form";
import { getQuantityDataFromItems, getReplacementDataFromItems } from "../utils";
import MaximalButton from "./MaximalButton";
import ProductErrorCell from "./ProductErrorCell";

const useStyles = makeStyles(
  theme => {
    const inputPadding: CSSProperties = {
      paddingBottom: theme.spacing(2),
      paddingTop: theme.spacing(2),
    };

    return {
      cartContent: {
        paddingBottom: 0,
        paddingTop: 0,
      },

      notice: {
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(2),
      },

      quantityField: {
        minWidth: "80px",
      },
      quantityInnerInput: {
        ...inputPadding,
      },
      quantityInnerInputNoRemaining: {
        paddingRight: 0,
      },
      remainingQuantity: {
        ...inputPadding,
        color: theme.palette.text.secondary,
        whiteSpace: "nowrap",
      },
      setMaximalQuantityButton: {
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(2),
        padding: 0,
      },
    };
  },
  { name: "ItemsCard" },
);
const messages = defineMessages({
  improperValue: {
    id: "xoyCZ/",
    defaultMessage: "Improper value",
    description: "error message",
  },

  titleFulfilled: {
    id: "NxRsHQ",
    defaultMessage: "Fulfillment - #{fulfilmentId}",
    description: "section header",
  },
  titleUnfulfilled: {
    id: "BkFke9",
    defaultMessage: "Unfulfilled Items",
    description: "section header",
  },
});

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
  onSetMaxQuantity: () => any;
}

const ItemsCard: React.FC<OrderReturnRefundLinesCardProps> = ({
  lines,
  onSetMaxQuantity,
  onChangeQuantity,
  onChangeSelected,
  itemsSelections,
  itemsQuantities,
  fulfilmentId,
  order,
}) => {
  const classes = useStyles({});
  const intl = useIntl();
  const handleChangeQuantity = (id: string) => (event: React.ChangeEvent<HTMLInputElement>) =>
    onChangeQuantity(id, parseInt(event.target.value, 10));
  const fulfillment = order?.fulfillments.find(getById(fulfilmentId));

  return (
    <DashboardCard>
      <OrderCardTitle
        orderNumber={order?.number}
        fulfillmentOrder={fulfillment?.fulfillmentOrder}
        status={fulfillment?.status}
      />
      <DashboardCard.Content className={classes.cartContent}>
        <MaximalButton onClick={onSetMaxQuantity} />
      </DashboardCard.Content>
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
              const { isRefunded, currentQuantity } = getQuantityDataFromItems(itemsQuantities, id);
              const { isSelected } = getReplacementDataFromItems(itemsSelections, id);
              const isReplacable = !!variant && !isRefunded;
              const isReturnable = !!variant;
              const isPreorder = !!variant?.preorder;
              const lineQuantity = fulfilmentId ? quantity : quantityToFulfill;
              const anyLineWithoutVariant = lines.some(({ variant }) => !variant);
              const productNameCellWidth = anyLineWithoutVariant ? "30%" : "50%";

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
                            <div className={classes.remainingQuantity}>/ {lineQuantity}</div>
                          ),
                        }}
                        error={isValueError}
                        helperText={isValueError && intl.formatMessage(messages.improperValue)}
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
    </DashboardCard>
  );
};

export default ItemsCard;
