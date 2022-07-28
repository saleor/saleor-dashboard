import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import { Button } from "@saleor/components/Button";
import CardTitle from "@saleor/components/CardTitle";
import Money from "@saleor/components/Money";
import Skeleton from "@saleor/components/Skeleton";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import { OrderRefundDataQuery } from "@saleor/graphql";
import { FormsetChange } from "@saleor/hooks/useFormset";
import { makeStyles } from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { OrderRefundFormData } from "../OrderRefundPage/form";
import { getTitle } from "./messages";

const useStyles = makeStyles(
  theme => {
    const inputPadding = {
      paddingBottom: theme.spacing(2),
      paddingTop: theme.spacing(2),
    };

    return {
      cartContent: {
        paddingBottom: 0,
        paddingTop: 0,
      },
      colQuantity: {
        textAlign: "right",
        width: 210,
      },
      notice: {
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(2),
      },
      orderNumber: {
        display: "inline",
        marginLeft: theme.spacing(1),
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
        marginTop: theme.spacing(1),
      },
    };
  },
  { name: "OrderRefundFulfilledProducts" },
);

interface OrderRefundFulfilledProductsProps {
  fulfillment: OrderRefundDataQuery["order"]["fulfillments"][0];
  data: OrderRefundFormData;
  disabled: boolean;
  orderNumber: string;
  onRefundedProductQuantityChange: FormsetChange<string>;
  onSetMaximalQuantities: () => void;
}

const OrderRefundFulfilledProducts: React.FC<OrderRefundFulfilledProductsProps> = props => {
  const {
    fulfillment,
    data,
    disabled,
    orderNumber,
    onRefundedProductQuantityChange,
    onSetMaximalQuantities,
  } = props;
  const classes = useStyles({});
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={
          <>
            {getTitle(fulfillment.status, intl)}
            {fulfillment && (
              <Typography className={classes.orderNumber} variant="body1">
                {`#${orderNumber}-${fulfillment?.fulfillmentOrder}`}
              </Typography>
            )}
          </>
        }
      />
      <CardContent className={classes.cartContent}>
        <Button
          className={classes.setMaximalQuantityButton}
          onClick={onSetMaximalQuantities}
          data-test-id={
            "set-maximal-quantity-fulfilled-button-" + fulfillment?.id
          }
        >
          <FormattedMessage
            id="2W4EBM"
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
                id="FNT4b+"
                defaultMessage="Product"
                description="tabel column header"
              />
            </TableCell>
            <TableCell>
              <FormattedMessage
                id="5aiFbL"
                defaultMessage="Price"
                description="tabel column header"
              />
            </TableCell>
            <TableCell>
              <FormattedMessage
                id="Tl+7X4"
                defaultMessage="Refunded Qty"
                description="tabel column header"
              />
            </TableCell>
            <TableCell>
              <FormattedMessage
                id="+PclgM"
                defaultMessage="Total"
                description="tabel column header"
              />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {renderCollection(
            fulfillment?.lines,
            line => {
              const selectedLineQuantity = data.refundedFulfilledProductQuantities.find(
                refundedLine => refundedLine.id === line.id,
              );
              const isError =
                Number(selectedLineQuantity?.value) > line?.quantity ||
                Number(selectedLineQuantity?.value) < 0;

              return (
                <TableRow key={line?.id}>
                  <TableCellAvatar thumbnail={line?.orderLine?.thumbnail?.url}>
                    {line?.orderLine?.productName ? (
                      line?.orderLine?.productName
                    ) : (
                      <Skeleton />
                    )}
                  </TableCellAvatar>
                  <TableCell>
                    {line?.orderLine?.unitPrice ? (
                      <Money money={line?.orderLine?.unitPrice.gross} />
                    ) : (
                      <Skeleton />
                    )}
                  </TableCell>
                  <TableCell className={classes.colQuantity}>
                    {line?.quantity ? (
                      <TextField
                        disabled={disabled}
                        type="number"
                        inputProps={{
                          className: classes.quantityInnerInput,
                          "data-test-id": "quantityInput" + line?.id,
                          max: (line?.quantity).toString(),
                          min: 0,
                          style: { textAlign: "right" },
                        }}
                        fullWidth
                        value={selectedLineQuantity?.value}
                        onChange={event =>
                          onRefundedProductQuantityChange(
                            line.id,
                            event.target.value,
                          )
                        }
                        InputProps={{
                          endAdornment: line?.quantity && (
                            <div className={classes.remainingQuantity}>
                              / {line?.quantity}
                            </div>
                          ),
                        }}
                        error={isError}
                        helperText={
                          isError &&
                          intl.formatMessage({
                            id: "xoyCZ/",
                            defaultMessage: "Improper value",
                            description: "error message",
                          })
                        }
                      />
                    ) : (
                      <Skeleton />
                    )}
                  </TableCell>
                  <TableCell>
                    {(line?.quantity && line?.orderLine?.unitPrice.gross && (
                      <Money
                        money={{
                          ...line?.orderLine.unitPrice.gross,
                          amount:
                            (line?.orderLine.unitPrice.gross.amount || 0) *
                            Number(selectedLineQuantity?.value),
                        }}
                      />
                    )) || <Skeleton />}
                  </TableCell>
                </TableRow>
              );
            },
            () => (
              <TableRow>
                <TableCell colSpan={4}>
                  <FormattedMessage
                    id="Q1Uzbb"
                    defaultMessage="No products found"
                  />
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>
    </Card>
  );
};
OrderRefundFulfilledProducts.displayName = "OrderRefundFulfilledProducts";
export default OrderRefundFulfilledProducts;
