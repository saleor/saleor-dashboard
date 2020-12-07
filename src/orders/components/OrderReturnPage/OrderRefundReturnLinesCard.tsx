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
  TextField,
  Typography
} from "@material-ui/core";
import CardSpacer from "@saleor/components/CardSpacer";
import CardTitle from "@saleor/components/CardTitle";
import Money from "@saleor/components/Money";
import Skeleton from "@saleor/components/Skeleton";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import { renderCollection } from "@saleor/misc";
import { OrderDetails_order_lines } from "@saleor/orders/types/OrderDetails";
import React, { CSSProperties } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

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
      colQuantity: {
        textAlign: "right",
        width: 210
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
        marginTop: theme.spacing(1)
      }
    };
  },
  { name: "OrderRefundUnfulfilledProducts" }
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
  isFulfilment?: boolean;
  canReplace?: boolean;
  lines: OrderDetails_order_lines;
  onProductQuantityChange();
  onSetMaximalQuantities();
}

const OrderReturnRefurnLinesCard: React.FC<OrderReturnRefundLinesCardProps> = ({
  lines,
  onProductQuantityChange,
  onSetMaximalQuantities,
  formData,
  isFulfilment = false,
  canReplace = false
}) => {
  const classes = useStyles({});
  const intl = useIntl();

  const shouldDisplayRestockedSubtitle = !isFulfilment && !canReplace;

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
          {shouldDisplayRestockedSubtitle && (
            <Typography
              variant="caption"
              color="textSecondary"
              className={classes.notice}
            >
              <FormattedMessage
                defaultMessage="Unfulfilled products will be restocked"
                description="section notice"
              />
            </Typography>
          )}
          <Button
            className={classes.setMaximalQuantityButton}
            color="primary"
            onClick={onSetMaximalQuantities}
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
              <TableCell>
                <FormattedMessage
                  defaultMessage="Price"
                  description="table column header"
                />
              </TableCell>
              <TableCell>
                <FormattedMessage
                  defaultMessage="Refunded Qty"
                  description="table column header"
                />
              </TableCell>
              <TableCell>
                <FormattedMessage
                  defaultMessage="Total"
                  description="table column header"
                />
              </TableCell>
              {canReplace && (
                <TableCell>
                  <FormattedMessage
                    defaultMessage="Replace"
                    description="table column header"
                  />
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {renderCollection(
              lines,
              line => {
                // LINES BELOW NEED WORK
                const selectedLineQuantity = formData?.products.find(
                  refundedLine => refundedLine.id === line.id
                );
                const lineQuantity = line?.quantity - line?.quantityFulfilled;
                const isError =
                  Number(selectedLineQuantity?.value) > lineQuantity ||
                  Number(selectedLineQuantity?.value) < 0;

                return (
                  <TableRow key={line?.id}>
                    <TableCellAvatar thumbnail={line?.thumbnail?.url}>
                      {line?.productName ? line?.productName : <Skeleton />}
                    </TableCellAvatar>
                    <TableCell>
                      {line?.unitPrice ? (
                        <Money money={line?.unitPrice.gross} />
                      ) : (
                        <Skeleton />
                      )}
                    </TableCell>
                    <TableCell className={classes.colQuantity}>
                      {lineQuantity || lineQuantity === 0 ? (
                        <TextField
                          //   disabled={disabled}
                          type="number"
                          inputProps={{
                            className: classes.quantityInnerInput,
                            "data-test": "quantityInput",
                            "data-test-id": line?.id,
                            max: lineQuantity.toString(),
                            min: 0,
                            style: { textAlign: "right" }
                          }}
                          fullWidth
                          value={selectedLineQuantity?.value}
                          onChange={event =>
                            onProductQuantityChange(line.id, event.target.value)
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
                      ) : (
                        <Skeleton />
                      )}
                    </TableCell>
                    <TableCell>
                      {(line?.unitPrice.gross && (
                        <Money
                          money={{
                            ...line.unitPrice.gross,
                            amount:
                              (line.unitPrice.gross.amount ?? 0) *
                              Number(selectedLineQuantity?.value)
                          }}
                        />
                      )) || <Skeleton />}
                    </TableCell>
                    {canReplace && (
                      <TableCell>
                        <Checkbox
                          //   checked={isSelected}
                          disableClickPropagation
                          //   onChange={() => toggle(attribute.id)}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                );
              },
              () => (
                <TableRow>
                  <TableCell colSpan={4}>
                    <FormattedMessage defaultMessage="No products found" />
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </Card>
    </>
  );
};

export default OrderReturnRefurnLinesCard;
