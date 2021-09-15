import {
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import Money from "@saleor/components/Money";
import Skeleton from "@saleor/components/Skeleton";
import { FormsetChange } from "@saleor/hooks/useFormset";
import { renderCollection } from "@saleor/misc";
import { OrderRefundData_order_fulfillments } from "@saleor/orders/types/OrderRefundData";
import { ProductTypeKindEnum } from "@saleor/types/globalTypes";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { OrderRefundFormData } from "../OrderRefundPage/form";
import { messages as refundMessages } from "../OrderRefundPage/messages";
import ProductImageCell from "../ProductImageCell";
import { getTitle } from "./messages";
import { useStyles } from "./styles";

interface OrderRefundFulfilledProductsProps {
  fulfillment: OrderRefundData_order_fulfillments;
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
    onSetMaximalQuantities
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
          color="primary"
          onClick={onSetMaximalQuantities}
          data-test="setMaximalQuantityFulfilledButton"
          data-test-id={fulfillment?.id}
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
            fulfillment?.lines,
            line => {
              const selectedLineQuantity = data.refundedFulfilledProductQuantities.find(
                refundedLine => refundedLine.id === line.id
              );
              const isError =
                Number(selectedLineQuantity?.value) > line?.quantity ||
                Number(selectedLineQuantity?.value) < 0;
              const isNotAllowed =
                line?.orderLine?.variant?.product.productType.kind ===
                ProductTypeKindEnum.GIFT_CARD;

              return (
                <TableRow key={line?.id}>
                  <ProductImageCell
                    productName={line?.orderLine?.productName}
                    productThumbnail={line?.orderLine?.thumbnail?.url}
                    notAllowed={isNotAllowed}
                    notAllowedAlert={intl.formatMessage(
                      refundMessages.giftCardRefundNotAllowed
                    )}
                  />
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
                        disabled={disabled || isNotAllowed}
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
                    {(line?.quantity && line?.orderLine?.unitPrice.gross && (
                      <Money
                        money={{
                          ...line?.orderLine.unitPrice.gross,
                          amount:
                            (line?.orderLine.unitPrice.gross.amount || 0) *
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
OrderRefundFulfilledProducts.displayName = "OrderRefundFulfilledProducts";
export default OrderRefundFulfilledProducts;
