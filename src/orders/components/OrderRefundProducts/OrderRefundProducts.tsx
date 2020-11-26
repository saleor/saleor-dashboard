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
import Typography from "@material-ui/core/Typography";
import { CSSProperties } from "@material-ui/styles";
import CardTitle from "@saleor/components/CardTitle";
import Money from "@saleor/components/Money";
import Skeleton from "@saleor/components/Skeleton";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import { FormsetChange } from "@saleor/hooks/useFormset";
import { renderCollection } from "@saleor/misc";
import { OrderRefundData_order } from "@saleor/orders/types/OrderRefundData";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { OrderRefundFormData } from "../OrderRefundPage/form";

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
  { name: "OrderRefundProducts" }
);

interface OrderRefundProductsProps {
  order: OrderRefundData_order;
  data: OrderRefundFormData;
  disabled: boolean;
  title: React.ReactNode;
  onRefundedProductQuantityChange: FormsetChange<string>;
  onSetMaximalQuantities: () => void;
}

const OrderRefundProducts: React.FC<OrderRefundProductsProps> = props => {
  const {
    order,
    data,
    disabled,
    title,
    onRefundedProductQuantityChange,
    onSetMaximalQuantities
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <Card>
      <CardTitle title={title} />
      <CardContent className={classes.cartContent}>
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
            order.lines,
            line => {
              const selectedLineQuantity = data.refundedProductQuantities.find(
                refundedLine => refundedLine.id === line.id
              );
              const isError =
                Number(selectedLineQuantity?.value) > line?.quantity ||
                Number(selectedLineQuantity?.value) < 0;

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
                        disabled={disabled}
                        type="number"
                        inputProps={{
                          className: classes.quantityInnerInput,
                          "data-test": "quantityInput",
                          "data-test-id": line?.id,
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
    </Card>
  );
};
OrderRefundProducts.displayName = "OrderRefundProducts";
export default OrderRefundProducts;
