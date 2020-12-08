import {
  Button,
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
import CardSpacer from "@saleor/components/CardSpacer";
import CardTitle from "@saleor/components/CardTitle";
import Money from "@saleor/components/Money";
import Skeleton from "@saleor/components/Skeleton";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import { FormsetChange, FormsetData } from "@saleor/hooks/useFormset";
import { renderCollection } from "@saleor/misc";
import { OrderDetails_order_lines } from "@saleor/orders/types/OrderDetails";
import React, { CSSProperties } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import { getById } from "./utils";

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
  titleFulfilled: {
    defaultMessage: "Fulfillment - #{fulfillmentId}",
    description: "section header"
  },
  titleUnfulfilled: {
    defaultMessage: "Unfulfilled Items",
    description: "section header"
  }
});

interface OrderReturnRefundLinesCardProps {
  onChangeQuantity: (id: string, value: string) => void;
  isFulfilment?: boolean;
  canReplace?: boolean;
  lines: OrderDetails_order_lines;
  itemsSelections: FormsetData<boolean>;
  itemsQuantities: FormsetData<number>;
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
  isFulfilment = false
}) => {
  const classes = useStyles({});
  const intl = useIntl();

  if (!lines.length) {
    return null;
  }

  return (
    <>
      <CardSpacer />
      <Card>
        <CardTitle
          title={intl.formatMessage(
            isFulfilment ? messages.titleFulfilled : messages.titleUnfulfilled
          )}
        />
        <CardContent className={classes.cartContent}>
          <Button
            className={classes.setMaximalQuantityButton}
            color="primary"
            onClick={onSetMaxQuantity}
            data-test="setMaximalQuantityUnfulfilledButton"
          >
            <FormattedMessage
              defaultMessage="Set maximal quantities"
              description="button"
            />
          </Button>
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
                  defaultMessage="Quantity"
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
            {lines.map(
              ({
                quantity,
                quantityFulfilled,
                id,
                thumbnail,
                unitPrice,
                productName
              }) => {
                const lineQuantity = quantity - quantityFulfilled;
                const isError = false;
                const isSelected = itemsSelections.find(getById(id)).value;
                const currentQuantity = itemsQuantities.find(getById(id)).value;

                return (
                  <TableRow key={id}>
                    <TableCellAvatar
                      thumbnail={thumbnail?.url}
                      style={{ width: "50%" }}
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
                          "data-test": "quantityInput",
                          "data-test-id": id,
                          max: lineQuantity.toString(),
                          min: 0,
                          style: { textAlign: "right" }
                        }}
                        fullWidth
                        value={currentQuantity}
                        onChange={event =>
                          onChangeQuantity(id, event.target.value)
                        }
                        InputProps={{
                          endAdornment: lineQuantity && (
                            <div className={classes.remainingQuantity}>
                              / {lineQuantity}
                            </div>
                          )
                        }}
                        error={isError}
                        helperText={
                          isError &&
                          intl.formatMessage({
                            defaultMessage: "Improper value",
                            description: "error message"
                          })
                        }
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => onChangeSelected(id, !isSelected)}
                      />
                    </TableCell>
                  </TableRow>
                );
                // },
                // () => (
                //   <TableRow>
                //     <TableCell colSpan={4}>
                //       <FormattedMessage defaultMessage="No products found" />
                //     </TableCell>
                //   </TableRow>
                // )
                // )
              }
            )}
          </TableBody>
        </Table>
      </Card>
    </>
  );
};

export default ItemsCard;
