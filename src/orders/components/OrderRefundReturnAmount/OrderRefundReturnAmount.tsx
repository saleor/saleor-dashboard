import {
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from "@material-ui/core";
import CardSpacer from "@saleor/components/CardSpacer";
import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import Hr from "@saleor/components/Hr";
import Money from "@saleor/components/Money";
import {
  SortableTableBody,
  SortableTableRow
} from "@saleor/components/SortableTable";
import { OrderErrorFragment } from "@saleor/fragments/types/OrderErrorFragment";
import { FormsetChange } from "@saleor/hooks/useFormset";
import { makeStyles } from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";
import {
  OrderRefundData_order,
  OrderRefundData_order_payments
} from "@saleor/orders/types/OrderRefundData";
import { ReorderEvent } from "@saleor/types";
import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import {
  OrderRefundAmountCalculationMode,
  OrderRefundFormData,
  OrderRefundType
} from "../OrderRefundPage/form";
import { OrderReturnFormData } from "../OrderReturnPage/form";
import { getById } from "../OrderReturnPage/utils";
import OrderRefundAmountValues, {
  OrderRefundAmountValuesProps
} from "./OrderRefundReturnAmountValues";
import RefundAmountInput from "./RefundAmountInput";
import { getPaymentsAmount } from "./utils";

const useStyles = makeStyles(
  theme => ({
    hr: {
      margin: theme.spacing(1, 0)
    },
    maxRefundRow: {
      fontWeight: 600
    },
    priceField: {
      marginTop: theme.spacing(2)
    },
    refundButton: {
      marginTop: theme.spacing(2)
    },
    refundCaution: {
      marginBottom: theme.spacing(2)
    },
    root: {
      ...theme.typography.body1,
      lineHeight: 1.9,
      width: "100%"
    },
    textRight: {
      textAlign: "right"
    },
    refundGroupTitle: {
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: theme.spacing(1)
    },
    sortableRow: {
      "& td:first-child": {
        paddingLeft: "0!important",
        paddingRight: "5px!important",
        width: 20
      }
    },
    paymentCell: {
      paddingLeft: 5,
      paddingRight: 5,
      paddingTop: 12,
      paddingBottom: 12,
      width: "100%"
    },
    paymentCellManual: {
      paddingLeft: "0!important",
      paddingRight: 0
    },
    amountCell: {
      fontWeight: 600,
      paddingLeft: 5,
      paddingRight: 0,
      paddingTop: 12,
      paddingBottom: 12
    },
    refundNotification: {
      color: "#3D3D3D",
      backgroundColor: "#FFF4E4",
      padding: 20,
      borderRadius: 4,
      boxShadow:
        "0 6px 10px 0px rgb(0 0 0 / 15%), 0 1px 18px 0px rgb(0 0 0 / 12%), 0 3px 5px -1px rgb(0 0 0 / 10%)"
    }
  }),
  { name: "OrderRefundAmount" }
);

const messages = defineMessages({
  refundButton: {
    defaultMessage: "Refund",
    description: "order refund amount button"
  },
  refundCannotBeFulfilled: {
    defaultMessage: "Refunded items can't be fulfilled",
    description: "order refund subtitle"
  },
  returnButton: {
    defaultMessage: "Replace & Return products",
    description: "order return amount button"
  },
  returnCannotBeFulfilled: {
    defaultMessage: "Returned items can't be fulfilled",
    description: "order return subtitle"
  },
  remainingBalanceCaption: {
    defaultMessage:
      "This is how much money will be left captured for these products after refund",
    description: "order refund amount"
  },
  totalPaymentsMade: {
    defaultMessage: "Total payments made",
    description: "order refund amount"
  },
  totalPaymentsMadeCaption: {
    defaultMessage:
      "This is how much money will be left captured when returning those products",
    description: "order refund amount"
  }
});

interface OrderRefundAmountProps {
  data: OrderRefundFormData | OrderReturnFormData;
  order: OrderRefundData_order | OrderDetails_order;
  payments: OrderRefundData_order_payments[];
  disabled: boolean;
  disableSubmitButton?: boolean;
  isReturn?: boolean;
  errors: OrderErrorFragment[];
  amountData: OrderRefundAmountValuesProps;
  allowNoRefund?: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
  onRefund: () => void;
  onPaymentsReorder: (event: ReorderEvent) => void;
  onPaymentAmountChange: FormsetChange<string>;
}

const OrderRefundAmount: React.FC<OrderRefundAmountProps> = props => {
  const {
    data,
    order,
    payments,
    disabled,
    errors,
    onChange,
    onRefund,
    onPaymentsReorder,
    onPaymentAmountChange,
    isReturn = false,
    amountData,
    disableSubmitButton,
    allowNoRefund = false
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  const { type = OrderRefundType.PRODUCTS } = data as OrderRefundFormData;

  const amountCurrency = order?.total?.gross?.currency;

  const {
    maxRefund,
    previouslyRefunded,
    refundTotalAmount,
    selectedProductsValue,
    shipmentCost,
    remainingBalance,
    paymentsTotalAmount
  } = amountData;

  const selectedRefundAmount =
    type === OrderRefundType.PRODUCTS &&
    data.amountCalculationMode === OrderRefundAmountCalculationMode.AUTOMATIC
      ? refundTotalAmount?.amount
      : paymentsTotalAmount?.amount;

  const isAnyPaymentAmountTooSmall =
    order?.payments.filter(payment => {
      const currentPayment = data.paymentsToRefund?.find(getById(payment.id));
      return (
        payment.availableRefundAmount?.amount > 0 &&
        Number(currentPayment?.value) < 0
      );
    }).length > 0;

  const isAnyPaymentAmountTooBig =
    order?.payments.filter(payment => {
      const currentPayment = data.paymentsToRefund?.find(getById(payment.id));
      return (
        payment.availableRefundAmount?.amount > 0 &&
        Number(currentPayment?.value) > payment.availableRefundAmount?.amount
      );
    }).length > 0;

  const isAmountTooSmall =
    (!!selectedRefundAmount && selectedRefundAmount < 0) ||
    isAnyPaymentAmountTooSmall;
  const isAmountTooBig =
    selectedRefundAmount > maxRefund?.amount || isAnyPaymentAmountTooBig;
  const disableRefundButton = isReturn
    ? disableSubmitButton ||
      isAmountTooSmall ||
      isAmountTooBig ||
      (remainingBalance?.amount < 0 &&
        data.amountCalculationMode === OrderRefundAmountCalculationMode.MANUAL)
    : !selectedRefundAmount ||
      isAmountTooBig ||
      isAmountTooSmall ||
      (remainingBalance?.amount < 0 &&
        data.amountCalculationMode === OrderRefundAmountCalculationMode.MANUAL);

  const paymentsAmount = getPaymentsAmount(refundTotalAmount, payments);

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Refund",
          description: "section header"
        })}
      />
      <CardContent>
        {type === OrderRefundType.PRODUCTS && (
          <RadioGroup
            value={data.amountCalculationMode}
            onChange={onChange}
            name="amountCalculationMode"
          >
            <Typography
              variant="caption"
              color="textSecondary"
              className={classes.refundCaution}
            >
              {intl.formatMessage(
                isReturn
                  ? messages.returnCannotBeFulfilled
                  : messages.refundCannotBeFulfilled
              )}
            </Typography>
            <Typography
              color="textSecondary"
              variant="body2"
              className={classes.refundGroupTitle}
            >
              <FormattedMessage
                defaultMessage="Refund Method"
                description="order refund method"
              />
            </Typography>
            {allowNoRefund && (
              <FormControlLabel
                disabled={disabled}
                value={OrderRefundAmountCalculationMode.NONE}
                control={<Radio color="primary" />}
                label={intl.formatMessage({
                  defaultMessage: "No refund",
                  description: "label"
                })}
              />
            )}
            <FormControlLabel
              disabled={disabled}
              value={OrderRefundAmountCalculationMode.AUTOMATIC}
              control={<Radio color="primary" />}
              label={intl.formatMessage({
                defaultMessage: "Automatic",
                description: "label"
              })}
            />
            <FormControlLabel
              disabled={disabled}
              value={OrderRefundAmountCalculationMode.MANUAL}
              control={<Radio color="primary" />}
              label={intl.formatMessage({
                defaultMessage: "Manual",
                description: "label"
              })}
            />
            <Hr className={classes.hr} />
            {data.amountCalculationMode ===
              OrderRefundAmountCalculationMode.NONE && (
              <>
                <CardSpacer />
              </>
            )}
            {data.amountCalculationMode ===
              OrderRefundAmountCalculationMode.AUTOMATIC && (
              <>
                <ControlledCheckbox
                  checked={data.refundShipmentCosts}
                  label={intl.formatMessage({
                    defaultMessage: "Refund shipment costs",
                    description: "checkbox"
                  })}
                  name="refundShipmentCosts"
                  onChange={onChange}
                />
                <CardSpacer />
                <Typography
                  color="textSecondary"
                  variant="body2"
                  className={classes.refundGroupTitle}
                >
                  <FormattedMessage
                    defaultMessage="Refund Amount"
                    description="order refund amount"
                  />
                </Typography>
                <OrderRefundAmountValues
                  selectedProductsValue={selectedProductsValue}
                  shipmentCost={data.refundShipmentCosts && shipmentCost}
                />

                {previouslyRefunded?.amount < 0 && (
                  <Typography className={classes.refundNotification}>
                    <FormattedMessage
                      defaultMessage="You cannot refund the whole value of selected products because of previous refunds"
                      description="order refund"
                    />
                  </Typography>
                )}
                <Table>
                  <SortableTableBody onSortEnd={onPaymentsReorder}>
                    {payments &&
                      renderCollection(payments, (payment, paymentIdx) => {
                        const paymentData = order.payments.find(
                          p => payment.id === p.id
                        );
                        return (
                          <SortableTableRow
                            index={paymentIdx}
                            className={classes.sortableRow}
                            key={payment.id}
                          >
                            <TableCell className={classes.paymentCell}>
                              {paymentData.gatewayName}
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                <FormattedMessage
                                  defaultMessage="Captured amount"
                                  description="order refund"
                                />{" "}
                                <Money money={paymentData.capturedAmount} />
                              </Typography>
                            </TableCell>
                            <TableCell className={classes.amountCell}>
                              <Money money={paymentsAmount[paymentIdx]} />
                            </TableCell>
                          </SortableTableRow>
                        );
                      })}
                  </SortableTableBody>
                </Table>
                <Table>
                  <TableBody>
                    <OrderRefundedPayments order={order} isManual={false} />
                  </TableBody>
                </Table>
              </>
            )}
            {data.amountCalculationMode ===
              OrderRefundAmountCalculationMode.MANUAL && (
              <>
                <ControlledCheckbox
                  disabled={disabled}
                  checked={data.refundShipmentCosts}
                  label={intl.formatMessage({
                    defaultMessage: "Refund shipment costs",
                    description: "checkbox"
                  })}
                  name="refundShipmentCosts"
                  onChange={onChange}
                />
                <CardSpacer />
                <Typography
                  color="textSecondary"
                  variant="body2"
                  className={classes.refundGroupTitle}
                >
                  <FormattedMessage
                    defaultMessage="Refund Amount"
                    description="order refund amount"
                  />
                </Typography>
                <OrderRefundAmountValues
                  selectedProductsValue={selectedProductsValue}
                  shipmentCost={data.refundShipmentCosts && shipmentCost}
                />
                {previouslyRefunded?.amount < 0 && (
                  <Typography className={classes.refundNotification}>
                    <FormattedMessage
                      defaultMessage="You cannot refund the whole value of selected products because of previous refunds"
                      description="order refund"
                    />
                  </Typography>
                )}
                <Table>
                  <TableBody>
                    {order &&
                      renderCollection(
                        order.payments.filter(
                          payment => payment.availableRefundAmount?.amount > 0
                        ),
                        payment => (
                          <TableRow key={payment.id}>
                            <TableCell className={classes.paymentCellManual}>
                              {payment.gatewayName}
                              <RefundAmountInput
                                payment={payment}
                                data={data as OrderRefundFormData}
                                currencySymbol={amountCurrency}
                                disabled={disabled}
                                onChange={event =>
                                  onPaymentAmountChange(
                                    payment.id,
                                    event.target.value
                                  )
                                }
                                errors={errors}
                              />
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    <OrderRefundedPayments order={order} isManual={true} />
                  </TableBody>
                </Table>
                <CardSpacer />
                <OrderRefundAmountValues remainingBalance={remainingBalance} />
                <Typography
                  variant="caption"
                  color="textSecondary"
                  className={classes.refundCaution}
                >
                  {intl.formatMessage(
                    isReturn
                      ? messages.totalPaymentsMadeCaption
                      : messages.remainingBalanceCaption
                  )}
                </Typography>
              </>
            )}
          </RadioGroup>
        )}
        {type === OrderRefundType.MISCELLANEOUS && (
          <>
            <OrderRefundAmountValues maxRefund={maxRefund} />
            <Typography
              color="textSecondary"
              variant="body2"
              className={classes.refundGroupTitle}
            >
              <FormattedMessage
                defaultMessage="Refund Amount"
                description="order refund amount"
              />
            </Typography>
            {previouslyRefunded?.amount < 0 && (
              <Typography className={classes.refundNotification}>
                <FormattedMessage
                  defaultMessage="You cannot refund the whole value of selected products because of previous refunds"
                  description="order refund"
                />
              </Typography>
            )}
            <Table>
              <TableBody>
                {order &&
                  renderCollection(
                    order.payments.filter(
                      payment => payment.availableRefundAmount?.amount > 0
                    ),
                    payment => (
                      <TableRow key={payment.id}>
                        <TableCell className={classes.paymentCellManual}>
                          {payment.gatewayName}
                          <RefundAmountInput
                            payment={payment}
                            data={data as OrderRefundFormData}
                            currencySymbol={amountCurrency}
                            disabled={disabled}
                            onChange={event =>
                              onPaymentAmountChange(
                                payment.id,
                                event.target.value
                              )
                            }
                            errors={errors}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  )}
                <OrderRefundedPayments order={order} isManual={false} />
              </TableBody>
            </Table>
          </>
        )}
        <Button
          color="primary"
          variant="contained"
          fullWidth
          size="large"
          onClick={onRefund}
          className={classes.refundButton}
          disabled={disableRefundButton}
          data-test="submit"
        >
          {!disableRefundButton && !isReturn ? (
            <FormattedMessage
              defaultMessage="Refund {currency} {amount}"
              description="order refund amount, input button"
              values={{
                amount: Number(selectedRefundAmount).toFixed(2),
                currency: amountCurrency
              }}
            />
          ) : (
            intl.formatMessage(
              isReturn ? messages.returnButton : messages.refundButton
            )
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
OrderRefundAmount.displayName = "OrderRefundAmount";
export default OrderRefundAmount;

interface OrderRefundedPaymentsProps {
  order: OrderRefundData_order | OrderDetails_order;
  isManual: boolean;
}

const OrderRefundedPayments: React.FC<OrderRefundedPaymentsProps> = props => {
  const { order, isManual } = props;

  const classes = useStyles(props);

  return (
    <>
      {order &&
        renderCollection(
          order.payments.filter(
            payment =>
              payment.availableRefundAmount?.amount === 0 ||
              payment.availableRefundAmount === null
          ),
          payment => (
            <TableRow key={payment.id} className={classes.sortableRow}>
              <TableCell
                className={
                  isManual ? classes.paymentCellManual : classes.paymentCell
                }
              >
                {payment.gatewayName}
                <Typography variant="caption" color="textSecondary">
                  <FormattedMessage
                    defaultMessage={"Fully refunded"}
                    description={"payment status"}
                  />
                </Typography>
              </TableCell>
            </TableRow>
          )
        )}
    </>
  );
};
