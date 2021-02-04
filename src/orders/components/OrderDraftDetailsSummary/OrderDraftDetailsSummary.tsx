import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Link from "@saleor/components/Link";
import Money from "@saleor/components/Money";
import { DiscountProviderValues } from "@saleor/products/components/OrderDraftDiscountProvider/DiscountProvider";
import React, { useRef } from "react";
import { useIntl } from "react-intl";
import { defineMessages } from "react-intl";

import { OrderDetails_order } from "../../types/OrderDetails";
import OrderLineDiscountModal from "../OrderLineDiscountModal";
import useDiscountCalculator from "../OrderLineDiscountModal/DiscountCalculator";
import {
  ORDER_DISCOUNT,
  OrderDiscountCalculationMode,
  OrderDiscountData
} from "../OrderLineDiscountModal/types";

const useStyles = makeStyles(
  theme => ({
    root: {
      ...theme.typography.body1,
      lineHeight: 1.9,
      width: "100%"
    },
    textRight: {
      textAlign: "right"
    },
    subtitle: {
      color: theme.palette.grey[500],
      paddingRight: theme.spacing(1)
    },
    relativeRow: {
      position: "relative"
    },
    percentDiscountLabelContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "baseline",
      justifyContent: "flex-end"
    }
  }),
  { name: "OrderDraftDetailsSummary" }
);

const messages = defineMessages({
  subtotal: {
    defaultMessage: "Subtotal",
    description: "subtotal price"
  },
  addDiscount: {
    defaultMessage: "Add Discount",
    description: "add discount button"
  },
  discount: {
    defaultMessage: "Discount",
    description: "discount button"
  },
  addShippingCarrier: {
    defaultMessage: "Add shipping carrier",
    description: "add shipping carrier button"
  },
  noShippingCarriers: {
    defaultMessage: "No applicable shipping carriers",
    description: "no shipping carriers title"
  },
  total: {
    defaultMessage: "Total",
    description: "total price"
  },
  taxes: {
    defaultMessage: "Taxes (VAT in cluded)",
    description: "taxes title"
  }
});

const PRICE_PLACEHOLDER = "---";

interface OrderDraftDetailsSummaryProps extends DiscountProviderValues {
  disabled?: boolean;
  order: OrderDetails_order;
  onShippingMethodEdit: () => void;
}

const OrderDraftDetailsSummary: React.FC<OrderDraftDetailsSummaryProps> = props => {
  const {
    disabled,
    order,
    onShippingMethodEdit,
    orderDiscount,
    addOrderDiscount,
    removeOrderDiscount,
    isDiscountDialogOpen,
    openDialog,
    closeDialog
  } = props;

  const intl = useIntl();
  const classes = useStyles(props);
  const discountCalculator = useDiscountCalculator(order, orderDiscount);

  const popperAnchorRef = useRef<HTMLTableRowElement | null>(null);

  if (!order) {
    return null;
  }

  const {
    subtotal,
    total,
    shippingMethod,
    shippingMethodName,
    availableShippingMethods,
    shippingPrice
  } = order;

  const hasChosenShippingMethod =
    shippingMethod !== undefined && shippingMethodName !== undefined;

  const hasNoneShippingChosen = shippingMethod === null;

  const hasAvailableShippingMethods = !!availableShippingMethods?.length;

  const discountTitle = !!orderDiscount
    ? messages.discount
    : messages.addDiscount;

  const getOrderDiscountLabel = (orderDiscountData: OrderDiscountData) => {
    if (!orderDiscountData) {
      return PRICE_PLACEHOLDER;
    }

    const { value: discountValue, type } = orderDiscountData;
    const currency = total.gross.currency;

    if (type === OrderDiscountCalculationMode.PERCENTAGE) {
      return (
        <div className={classes.percentDiscountLabelContainer}>
          <Typography
            className={classes.subtitle}
          >{`(${discountValue}%)`}</Typography>
          <Money money={discountCalculator.getDiscountedMoney()} />
        </div>
      );
    }

    return <Money money={{ amount: discountValue, currency }} />;
  };

  return (
    <table className={classes.root}>
      <tbody>
        <tr className={classes.relativeRow} ref={popperAnchorRef}>
          <td>
            <Link onClick={openDialog}>
              {intl.formatMessage(discountTitle)}
            </Link>
            <OrderLineDiscountModal
              anchorRef={popperAnchorRef}
              isOpen={isDiscountDialogOpen}
              onClose={closeDialog}
              currency={total.gross.currency}
              modalType={ORDER_DISCOUNT}
              maxAmount={total.gross.amount}
              onConfirm={addOrderDiscount}
              onRemove={removeOrderDiscount}
              existingDiscount={orderDiscount}
              dialogPlacement="bottom-start"
            />
          </td>
          <td className={classes.textRight}>
            {getOrderDiscountLabel(orderDiscount)}
          </td>
        </tr>
        <tr>
          <td>{intl.formatMessage(messages.subtotal)}</td>
          <td className={classes.textRight}>
            <Money money={subtotal.gross} />
          </td>
        </tr>
        <tr>
          {!hasChosenShippingMethod && !disabled && (
            <td>
              <Link onClick={onShippingMethodEdit}>
                {intl.formatMessage(messages.addShippingCarrier)}
              </Link>
            </td>
          )}

          {(!hasAvailableShippingMethods || hasNoneShippingChosen) && (
            <td>{intl.formatMessage(messages.noShippingCarriers)}</td>
          )}

          {hasChosenShippingMethod && (
            <td className={classes.textRight}>
              {hasNoneShippingChosen ? (
                PRICE_PLACEHOLDER
              ) : (
                <Money money={shippingPrice.gross} />
              )}
            </td>
          )}
        </tr>
        <tr>
          <td>{intl.formatMessage(messages.taxes)}</td>
          <td className={classes.textRight}>
            <Money money={order.total.tax} />
          </td>
        </tr>
        <tr>
          <td>{intl.formatMessage(messages.total)}</td>
          <td className={classes.textRight}>
            <Money
              money={discountCalculator.getTotalMoneyIncludingDiscount()}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default OrderDraftDetailsSummary;
