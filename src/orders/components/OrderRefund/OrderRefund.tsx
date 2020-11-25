import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import { CSSProperties } from "@material-ui/styles";
import CardTitle from "@saleor/components/CardTitle";
import Money from "@saleor/components/Money";
import RadioGroupField from "@saleor/components/RadioGroupField";
import Skeleton from "@saleor/components/Skeleton";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import { FormsetChange } from "@saleor/hooks/useFormset";
import { renderCollection } from "@saleor/misc";
import { OrderRefundData_order } from "@saleor/orders/types/OrderRefundData";
import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import { OrderRefundFormData, OrderRefundType } from "../OrderRefundPage/form";

const useStyles = makeStyles(
  theme => {
    const inputPadding: CSSProperties = {
      paddingBottom: theme.spacing(2),
      paddingTop: theme.spacing(2)
    };

    return {
      colQuantity: {
        textAlign: "right",
        width: 210
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
      }
    };
  },
  { name: "OrderRefund" }
);

interface OrderRefundProps {
  order: OrderRefundData_order;
  data: OrderRefundFormData;
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
  onRefundedProductQuantityChange: FormsetChange<string>;
  onSetMaximalQuantities: () => void;
}

const messages = defineMessages({
  refundMiscellaneous: {
    defaultMessage: "Miscellaneous Refund",
    description: "refund type"
  },
  refundProducts: {
    defaultMessage: "Refund Products",
    description: "refund type"
  }
});

const OrderRefund: React.FC<OrderRefundProps> = props => {
  const {
    order,
    data,
    disabled,
    onChange,
    onRefundedProductQuantityChange,
    onSetMaximalQuantities
  } = props;
  const classes = useStyles({});
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Refund Order",
          description: "section header"
        })}
      />
      <CardContent>
        <RadioGroupField
          choices={[
            {
              label: intl.formatMessage(messages.refundProducts),
              value: OrderRefundType.PRODUCTS
            },
            {
              label: intl.formatMessage(messages.refundMiscellaneous),
              value: OrderRefundType.MISCELLANEOUS
            }
          ]}
          disabled={disabled}
          name={"type" as keyof FormData}
          value={data.type}
          onChange={onChange}
          variant="inline"
        />
        {data.type === OrderRefundType.PRODUCTS && (
          <Button color="primary" onClick={onSetMaximalQuantities}>
            <FormattedMessage defaultMessage="Set maximal quantities" />
          </Button>
        )}
      </CardContent>
      {data.type === OrderRefundType.PRODUCTS && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <FormattedMessage
                  defaultMessage="Product"
                  description="tabel column header"
                />
              </TableCell>
              <TableCell>
                <FormattedMessage
                  defaultMessage="Price"
                  description="tabel column header"
                />
              </TableCell>
              <TableCell>
                <FormattedMessage
                  defaultMessage="Refunded Qty"
                  description="tabel column header"
                />
              </TableCell>
              <TableCell>
                <FormattedMessage
                  defaultMessage="Total"
                  description="tabel column header"
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderCollection(
              order?.lines,
              line => {
                const selectedLineQuantity = data.refundedProductQuantities.find(
                  refundedLine => refundedLine.id === line.id
                );
                return (
                  <TableRow key={line?.id}>
                    <TableCellAvatar thumbnail={line?.thumbnail?.url}>
                      {line?.productName ? line?.productName : <Skeleton />}
                    </TableCellAvatar>
                    <TableCell>
                      {line?.totalPrice ? (
                        <Money money={line?.totalPrice.gross} />
                      ) : (
                        <Skeleton />
                      )}
                    </TableCell>
                    <TableCell className={classes.colQuantity}>
                      {line?.quantity ? (
                        <TextField
                          type="number"
                          inputProps={{
                            className: classes.quantityInnerInput,
                            max: (line?.quantity).toString(),
                            min: 0,
                            style: { textAlign: "right" }
                          }}
                          fullWidth
                          value={selectedLineQuantity?.value}
                          onChange={event =>
                            onRefundedProductQuantityChange(
                              line.id,
                              event.target.value
                            )
                          }
                          InputProps={{
                            endAdornment: line?.quantity && (
                              <div className={classes.remainingQuantity}>
                                / {line?.quantity}
                              </div>
                            )
                          }}
                          error={
                            Number(selectedLineQuantity?.value) > line?.quantity
                          }
                        />
                      ) : (
                        <Skeleton />
                      )}
                    </TableCell>
                    <TableCell>
                      {(line?.quantity && line?.totalPrice.gross && (
                        <Money
                          money={{
                            ...line.totalPrice.gross,
                            amount:
                              (line.totalPrice.gross.amount || 0) *
                              Number(selectedLineQuantity?.value)
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
                    <FormattedMessage defaultMessage="No products found" />
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      )}
    </Card>
  );
};
OrderRefund.displayName = "OrderRefund";
export default OrderRefund;
