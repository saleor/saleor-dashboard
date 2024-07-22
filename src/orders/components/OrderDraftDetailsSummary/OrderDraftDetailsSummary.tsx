// @ts-strict-ignore
import { ButtonLink } from "@dashboard/components/ButtonLink";
import HorizontalSpacer from "@dashboard/components/HorizontalSpacer";
import Money from "@dashboard/components/Money";
import {
  DiscountValueTypeEnum,
  OrderDetailsFragment,
  OrderErrorFragment,
} from "@dashboard/graphql";
import { OrderDiscountContextConsumerProps } from "@dashboard/products/components/OrderDiscountProviders/OrderDiscountProvider";
import { OrderDiscountData } from "@dashboard/products/components/OrderDiscountProviders/types";
import { getFormErrors } from "@dashboard/utils/errors";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { Box, Popover, sprinkles } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import OrderDiscountCommonModal from "../OrderDiscountCommonModal";
import { ORDER_DISCOUNT } from "../OrderDiscountCommonModal/types";
import { messages } from "./messages";

const useStyles = makeStyles(
  theme => ({
    root: {
      ...theme.typography.body1,
      lineHeight: 1.9,
      width: "100%",
    },
    textRight: {
      textAlign: "right",
    },
    textError: {
      color: theme.palette.error.main,
      marginLeft: theme.spacing(1.5),
      display: "inline",
    },
    subtitle: {
      color: theme.palette.grey[500],
      paddingRight: theme.spacing(1),
    },
    relativeRow: {
      position: "relative",
    },
    percentDiscountLabelContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "baseline",
      justifyContent: "flex-end",
    },
    shippingMethodContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "baseline",
    },
  }),
  { name: "OrderDraftDetailsSummary" },
);
const PRICE_PLACEHOLDER = "---";

interface OrderDraftDetailsSummaryProps extends OrderDiscountContextConsumerProps {
  disabled?: boolean;
  order: OrderDetailsFragment;
  errors: OrderErrorFragment[];
  onShippingMethodEdit: () => void;
}

const OrderDraftDetailsSummary: React.FC<OrderDraftDetailsSummaryProps> = props => {
  const {
    order,
    errors,
    onShippingMethodEdit,
    orderDiscount,
    addOrderDiscount,
    removeOrderDiscount,
    openDialog,
    closeDialog,
    isDialogOpen,
    orderDiscountAddStatus,
    orderDiscountRemoveStatus,
    undiscountedPrice,
  } = props;
  const intl = useIntl();
  const classes = useStyles(props);

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
    isShippingRequired,
  } = order;
  const formErrors = getFormErrors(["shipping"], errors);
  const hasChosenShippingMethod = shippingMethod !== null && shippingMethodName !== null;
  const hasShippingMethods = !!shippingMethods?.length || isShippingRequired;
  const discountTitle = orderDiscount ? messages.discount : messages.addDiscount;
  const getOrderDiscountLabel = (orderDiscountData: OrderDiscountData) => {
    if (!orderDiscountData) {
      return PRICE_PLACEHOLDER;
    }

    const { value: discountValue, calculationMode, amount: discountAmount } = orderDiscountData;
    const currency = total.gross.currency;

    if (calculationMode === DiscountValueTypeEnum.PERCENTAGE) {
      return (
        <div className={classes.percentDiscountLabelContainer}>
          <Typography className={classes.subtitle}>{`(${discountValue}%)`}</Typography>
          <Money money={discountAmount} />
        </div>
      );
    }

    return <Money money={{ amount: discountValue, currency }} />;
  };
  const getShippingMethodComponent = () => {
    if (hasChosenShippingMethod) {
      return <ButtonLink onClick={onShippingMethodEdit}>{`${shippingMethodName}`}</ButtonLink>;
    }

    const shippingCarrierBase = intl.formatMessage(messages.addShippingCarrier);

    if (shippingAddress) {
      return (
        <ButtonLink onClick={onShippingMethodEdit} data-test-id="add-shipping-carrier">
          {shippingCarrierBase}
        </ButtonLink>
      );
    }

    const addShippingAddressInfo = intl.formatMessage(messages.addShippingAddressInfo);

    return (
      <div className={classes.shippingMethodContainer}>
        <ButtonLink underline disabled onClick={onShippingMethodEdit}>
          {shippingCarrierBase}
        </ButtonLink>
        <HorizontalSpacer />
        <Typography variant="caption">{`(${addShippingAddressInfo})`}</Typography>
      </div>
    );
  };

  return (
    <table data-test-id="order-summary" className={classes.root}>
      <tbody>
        <tr className={classes.relativeRow}>
          <td>
            <Popover open={isDialogOpen}>
              <Popover.Trigger>
                <Box>
                  <ButtonLink onClick={isDialogOpen ? closeDialog : openDialog}>
                    {intl.formatMessage(discountTitle)}
                  </ButtonLink>
                </Box>
              </Popover.Trigger>
              <Popover.Content align="start" className={sprinkles({ zIndex: "3" })}>
                <Box boxShadow="defaultOverlay">
                  <OrderDiscountCommonModal
                    modalType={ORDER_DISCOUNT}
                    existingDiscount={orderDiscount}
                    maxPrice={undiscountedPrice}
                    onConfirm={addOrderDiscount}
                    onClose={closeDialog}
                    onRemove={removeOrderDiscount}
                    confirmStatus={orderDiscountAddStatus}
                    removeStatus={orderDiscountRemoveStatus}
                  />
                </Box>
              </Popover.Content>
            </Popover>
          </td>
          <td className={classes.textRight}>{getOrderDiscountLabel(orderDiscount)}</td>
        </tr>
        <tr data-test-id="order-subtotal-price">
          <td>{intl.formatMessage(messages.subtotal)}</td>
          <td className={classes.textRight}>
            <Money money={subtotal.gross} />
          </td>
        </tr>
        <tr data-test-id="order-add-shipping-line">
          <td>
            {hasShippingMethods && getShippingMethodComponent()}

            {!hasShippingMethods && intl.formatMessage(messages.noShippingCarriers)}

            {formErrors.shipping && (
              <Typography variant="body2" className={classes.textError}>
                {getOrderErrorMessage(formErrors.shipping, intl)}
              </Typography>
            )}
          </td>

          <td className={classes.textRight}>
            {hasChosenShippingMethod ? <Money money={shippingPrice.gross} /> : PRICE_PLACEHOLDER}
          </td>
        </tr>
        <tr data-test-id="order-taxes-price">
          <td>{intl.formatMessage(messages.taxes)}</td>
          <td className={classes.textRight}>
            <Money money={order.total.tax} />
          </td>
        </tr>
        <tr data-test-id="order-total-price">
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
