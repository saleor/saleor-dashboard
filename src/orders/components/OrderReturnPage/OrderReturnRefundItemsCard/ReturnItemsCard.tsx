import {
  Card,
  CardContent,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField
} from "@material-ui/core";
import Money from "@saleor/components/Money";
import Skeleton from "@saleor/components/Skeleton";
import StatusBadge from "@saleor/components/StatusBadge";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import { OrderErrorFragment } from "@saleor/fragments/types/OrderErrorFragment";
import { FormsetChange } from "@saleor/hooks/useFormset";
import { makeStyles } from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
import {
  OrderDetails_order,
  OrderDetails_order_lines
} from "@saleor/orders/types/OrderDetails";
import React, { CSSProperties } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { FormsetQuantityData, FormsetReplacementData } from "../form";
import { ReturnItemCardMessages as messages } from "../messages";
import { getById } from "../utils";
import CardTitle from "./CardTitle";
import MaximalButton from "./MaximalButton";

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
      colProduct: {
        width: "50%"
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
                quantityToFulfill,
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
              const isPreorder = !!variant?.preorder;
              const lineQuantity = fulfilmentId ? quantity : quantityToFulfill;
              const isDeleted = !variant;
              const isSelected = itemsSelections.find(getById(id))?.value;
              const currentQuantity = itemsQuantities.find(getById(id))?.value;

              return (
                <TableRow key={id}>
                  <TableCellAvatar
                    thumbnail={thumbnail?.url}
                    className={classes.colProduct}
                    badge={
                      isDeleted && (
                        <StatusBadge
                          variant="error"
                          description={intl.formatMessage(
                            messages.deletedVariant
                          )}
                        />
                      )
                    }
                  >
                    {productName || <Skeleton />}
                  </TableCellAvatar>
                  <TableCell align="right">
                    <Money
                      money={{
                        amount: unitPrice.gross.amount,
                        currency: unitPrice.gross.currency
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      type="number"
                      inputProps={{
                        className: classes.quantityInnerInput,
                        "data-test-id": "quantityInput",
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
                  </TableCell>
                  <TableCell align="center">
                    {isReplacable && !isPreorder && (
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
