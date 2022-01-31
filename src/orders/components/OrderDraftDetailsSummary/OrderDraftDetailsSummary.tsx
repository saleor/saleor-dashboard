import { Typography } from "@material-ui/core";
import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import Link from "@saleor/components/Link";
import Money from "@saleor/components/Money";
import { makeStyles } from "@saleor/macaw-ui";
import { OrderDiscountContextConsumerProps } from "@saleor/products/components/OrderDiscountProviders/OrderDiscountProvider";
import { OrderDiscountData } from "@saleor/products/components/OrderDiscountProviders/types";
import { DiscountValueTypeEnum } from "@saleor/types/globalTypes";
import React, { useRef } from "react";
import { useIntl } from "react-intl";

import { OrderDetails_order } from "../../types/OrderDetails";
import OrderDiscountCommonModal from "../OrderDiscountCommonModal";
import { ORDER_DISCOUNT } from "../OrderDiscountCommonModal/types";
import { messages } from "./messages";

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
    },
    shippingMethodContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "baseline"
    }
  }),
  { name: "OrderDraftDetailsSummary" }
);

const PRICE_PLACEHOLDER = "---";

interface OrderDraftDetailsSummaryProps
  extends OrderDiscountContextConsumerProps {
  disabled?: boolean;
  order: OrderDetails_order;
  onShippingMethodEdit: () => void;
}

const OrderDraftDetailsSummary: React.FC<OrderDraftDetailsSummaryProps> = props => {
  const {
    order,
    onShippingMethodEdit,
    orderDiscount,
    addOrderDiscount,
    removeOrderDiscount,
    openDialog,
    closeDialog,
    isDialogOpen,
    orderDiscountAddStatus,
    orderDiscountRemoveStatus,
    undiscountedPrice
  } = props;

  const intl = useIntl();
  const classes = useStyles(props);

  const popperAnchorRef = useRef<HTMLTableRowElement | null>(null);

  if (!order) {
    return null;
  }

  const {
    subtotal,
    total,
    shippingMethod,
    shippingMethodName,
    shippingMethods,
    shippingPrice,
    shippingAddress,
    isShippingRequired
  } = order;

  const hasChosenShippingMethod =
    shippingMethod !== null && shippingMethodName !== null;

  const hasShippingMethods = !!shippingMethods?.length || isShippingRequired;

  const discountTitle = orderDiscount
    ? messages.discount
    : messages.addDiscount;

  const getOrderDiscountLabel = (orderDiscountData: OrderDiscountData) => {
    if (!orderDiscountData) {
      return PRICE_PLACEHOLDER;
    }

    const {
      value: discountValue,
      calculationMode,
      amount: discountAmount
    } = orderDiscountData;
    const currency = total.gross.currency;

    if (calculationMode === DiscountValueTypeEnum.PERCENTAGE) {
      return (
        <div className={classes.percentDiscountLabelContainer}>
          <Typography
            className={classes.subtitle}
          >{`(${discountValue}%)`}</Typography>
          <Money money={discountAmount} />
        </div>
      );
    }

    return <Money money={{ amount: discountValue, currency }} />;
  };

  const getShippingMethodComponent = () => {
    if (hasChosenShippingMethod) {
      return (
        <Link onClick={onShippingMethodEdit}>{`${shippingMethodName}`}</Link>
      );
    }

    const shippingCarrierBase = intl.formatMessage(messages.addShippingCarrier);

    if (!!shippingAddress) {
      return (
        <Link
          onClick={onShippingMethodEdit}
          data-test-id="add-shipping-carrier"
        >
          {shippingCarrierBase}
        </Link>
      );
    }

    const addShippingAddressInfo = intl.formatMessage(
      messages.addShippingAddressInfo
    );

    return (
      <div className={classes.shippingMethodContainer}>
        <Link underline disabled onClick={onShippingMethodEdit}>
          {shippingCarrierBase}
        </Link>
        <HorizontalSpacer />
        <Typography variant="caption">{`(${addShippingAddressInfo})`}</Typography>
      </div>
    );
  };

  return (
    <table className={classes.root}>
      <tbody>
        <tr className={classes.relativeRow} ref={popperAnchorRef}>
          <td>
            <Link onClick={openDialog}>
              {intl.formatMessage(discountTitle)}
            </Link>
            <OrderDiscountCommonModal
              dialogPlacement="bottom-start"
              modalType={ORDER_DISCOUNT}
              anchorRef={popperAnchorRef}
              existingDiscount={orderDiscount}
              maxPrice={undiscountedPrice}
              isOpen={isDialogOpen}
              onConfirm={addOrderDiscount}
              onClose={closeDialog}
              onRemove={removeOrderDiscount}
              confirmStatus={orderDiscountAddStatus}
              removeStatus={orderDiscountRemoveStatus}
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
          {hasShippingMethods && <td>{getShippingMethodComponent()}</td>}

          {!hasShippingMethods && (
            <td>{intl.formatMessage(messages.noShippingCarriers)}</td>
          )}

          <td className={classes.textRight}>
            {hasChosenShippingMethod ? (
              <Money money={shippingPrice.gross} />
            ) : (
              PRICE_PLACEHOLDER
            )}
          </td>
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
            <Money money={total.gross} />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default OrderDraftDetailsSummary;
