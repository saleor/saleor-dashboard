import { ButtonLink } from "@dashboard/components/ButtonLink";
import {
  DiscountValueTypeEnum,
  OrderDetailsFragment,
  OrderErrorFragment,
} from "@dashboard/graphql";
import { OrderDiscountContextConsumerProps } from "@dashboard/products/components/OrderDiscountProviders/OrderDiscountProvider";
import { OrderDiscountData } from "@dashboard/products/components/OrderDiscountProviders/types";
import { getFormErrors } from "@dashboard/utils/errors";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { Box, Popover, PropsWithBox, sprinkles, Text } from "@saleor/macaw-ui-next";
import { ReactNode } from "react";
import { defineMessages, useIntl } from "react-intl";

import OrderDiscountCommonModal from "../OrderDiscountCommonModal";
import { ORDER_DISCOUNT, OrderDiscountCommonInput } from "../OrderDiscountCommonModal/types";
import { OrderSummaryListAmount } from "./OrderSummaryListAmount";
import { OrderSummaryListItem } from "./OrderSummaryListItem";
import { OrderValueHeader } from "./OrderValueHeader";

const emptyDiscount: OrderDiscountCommonInput = {
  value: 0,
  reason: "",
  calculationMode: DiscountValueTypeEnum.PERCENTAGE,
};

const messages = defineMessages({
  discount: {
    id: "+8v1ny",
    defaultMessage: "Discount",
    description: "discount button",
  },
  addDiscount: {
    id: "Myx1Qp",
    defaultMessage: "Add Discount",
    description: "add discount button",
  },
  setShippingMethod: {
    id: "Dg4Y2p",
    defaultMessage: "Set shipping method",
    description: "set shipping method link when no shipping method selected",
  },
  shipping: {
    id: "glR0om",
    defaultMessage: "Shipping",
    description: "shipping label",
  },
  noShippingMethods: {
    id: "G+MtyG",
    defaultMessage: "No applicable shipping methods",
    description: "no shipping methods available",
  },
  noAlternativeShippingMethods: {
    id: "gCZYcl",
    defaultMessage: "No alternative shipping methods available",
    description: "tooltip shown when shipping method is selected but no other options exist",
  },
  noShippingAddress: {
    id: "Ai4XSg",
    defaultMessage: "No shipping address",
    description: "shown when shipping address is required but not set",
  },
  netPrices: {
    id: "J/6a1+",
    defaultMessage: "Net prices",
    description: "tooltip for taxes when showing net prices",
  },
  grossPrices: {
    id: "TdoAea",
    defaultMessage: "Gross prices",
    description: "tooltip for taxes when showing gross prices",
  },
  subtotalTitle: {
    id: "ClUKur",
    defaultMessage: "Sum of all line items",
    description: "tooltip for subtotal amount",
  },
  shippingTitle: {
    id: "MHY5da",
    defaultMessage: "Shipping cost",
    description: "tooltip for shipping amount",
  },
  taxesTitle: {
    id: "fS2rip",
    defaultMessage: "Tax amount",
    description: "tooltip for taxes amount",
  },
  totalTitle: {
    id: "aaj/MI",
    defaultMessage: "Order total",
    description: "tooltip for total amount",
  },
  discountTitle: {
    id: "i3Hquc",
    defaultMessage: "Discount amount",
    description: "tooltip for discount amount",
  },
  giftCardTitle: {
    id: "ztsvOP",
    defaultMessage: "Gift card amount used",
    description: "tooltip for gift card amount",
  },
  fixedAmount: {
    id: "YPCB7b",
    defaultMessage: "Fixed amount",
    description: "label for fixed amount discount type",
  },
});

type BaseProps = {
  orderSubtotal: OrderDetailsFragment["subtotal"];
  shippingMethodName: OrderDetailsFragment["shippingMethodName"];
  shippingPrice: OrderDetailsFragment["shippingPrice"];
  orderTotal: OrderDetailsFragment["total"];
  discounts: OrderDetailsFragment["discounts"];
  giftCardsAmount: number | null;
  usedGiftCards: OrderDetailsFragment["giftCards"] | null;
  displayGrossPrices: OrderDetailsFragment["displayGrossPrices"];
};

type EditableProps = {
  isEditable: true;
  orderDiscount?: OrderDiscountData;
  addOrderDiscount: OrderDiscountContextConsumerProps["addOrderDiscount"];
  removeOrderDiscount: OrderDiscountContextConsumerProps["removeOrderDiscount"];
  openDialog: OrderDiscountContextConsumerProps["openDialog"];
  closeDialog: OrderDiscountContextConsumerProps["closeDialog"];
  isDialogOpen: OrderDiscountContextConsumerProps["isDialogOpen"];
  orderDiscountAddStatus: OrderDiscountContextConsumerProps["orderDiscountAddStatus"];
  orderDiscountRemoveStatus: OrderDiscountContextConsumerProps["orderDiscountRemoveStatus"];
  undiscountedPrice: OrderDiscountContextConsumerProps["undiscountedPrice"];
  onShippingMethodEdit: () => void;
  shippingMethods: OrderDetailsFragment["shippingMethods"];
  shippingMethod: OrderDetailsFragment["shippingMethod"];
  shippingAddress: OrderDetailsFragment["shippingAddress"];
  isShippingRequired: OrderDetailsFragment["isShippingRequired"];
  errors?: OrderErrorFragment[];
};

type ReadOnlyProps = {
  isEditable?: false;
};

type Props = PropsWithBox<BaseProps & (EditableProps | ReadOnlyProps)>;

const getOrderDiscountLabel = (
  orderDiscount: OrderDiscountData | undefined,
  _currency: string,
): { value: string; percentage?: string } => {
  if (!orderDiscount) {
    return { value: "---" };
  }

  const { value: discountValue, calculationMode, amount: discountAmount } = orderDiscount;

  if (calculationMode === DiscountValueTypeEnum.PERCENTAGE) {
    return {
      value: discountAmount.amount.toFixed(2),
      percentage: `${discountValue}%`,
    };
  }

  return { value: discountValue.toFixed(2) };
};

export const OrderValue = (props: Props): ReactNode => {
  const {
    orderSubtotal,
    shippingMethodName,
    shippingPrice,
    orderTotal,
    discounts,
    giftCardsAmount,
    usedGiftCards,
    displayGrossPrices,
    isEditable = false,
    ...restProps
  } = props;
  const intl = useIntl();

  const editableProps = isEditable ? (props as BaseProps & EditableProps) : null;

  const hasChosenShippingMethod =
    editableProps?.shippingMethod !== null &&
    editableProps?.shippingMethod !== undefined &&
    shippingMethodName !== null;
  const hasShippingMethods =
    !!editableProps?.shippingMethods?.length || editableProps?.isShippingRequired;

  const formErrors = editableProps
    ? getFormErrors(["shipping"], editableProps.errors ?? [])
    : { shipping: undefined };

  const renderShippingRow = (): ReactNode => {
    const shippingAmountTitle = intl.formatMessage(messages.shippingTitle);

    if (!isEditable) {
      return (
        <OrderSummaryListItem amount={shippingPrice.gross.amount} amountTitle={shippingAmountTitle}>
          {intl.formatMessage(messages.shipping)}{" "}
          <Text as="span" color="default2">
            {shippingMethodName}
          </Text>
        </OrderSummaryListItem>
      );
    }

    if (hasChosenShippingMethod) {
      if (!hasShippingMethods) {
        return (
          <OrderSummaryListItem
            amount={shippingPrice.gross.amount}
            amountTitle={shippingAmountTitle}
          >
            {intl.formatMessage(messages.shipping)}{" "}
            <Text
              as="span"
              color="default2"
              title={intl.formatMessage(messages.noAlternativeShippingMethods)}
            >
              {shippingMethodName}
            </Text>
          </OrderSummaryListItem>
        );
      }

      return (
        <OrderSummaryListItem amount={shippingPrice.gross.amount} amountTitle={shippingAmountTitle}>
          {intl.formatMessage(messages.shipping)}{" "}
          <ButtonLink onClick={editableProps?.onShippingMethodEdit}>
            {shippingMethodName}
          </ButtonLink>
        </OrderSummaryListItem>
      );
    }

    const hasShippingAddress = !!editableProps?.shippingAddress;

    if (!hasShippingAddress || !hasShippingMethods) {
      return (
        <OrderSummaryListItem amount={0} amountTitle={shippingAmountTitle}>
          <Text as="span" color="default2">
            {intl.formatMessage(
              !hasShippingAddress ? messages.noShippingAddress : messages.noShippingMethods,
            )}
          </Text>
        </OrderSummaryListItem>
      );
    }

    return (
      <OrderSummaryListItem amount={0} amountTitle={shippingAmountTitle}>
        <ButtonLink
          onClick={editableProps?.onShippingMethodEdit}
          data-test-id="add-shipping-carrier"
        >
          {intl.formatMessage(messages.setShippingMethod)}
        </ButtonLink>
      </OrderSummaryListItem>
    );
  };

  const renderDiscountRow = (): ReactNode => {
    const discountAmountTitle = intl.formatMessage(messages.discountTitle);

    if (!isEditable) {
      return discounts.map(discount => (
        <OrderSummaryListItem
          key={`order-value-discount-${discount.id}`}
          amount={discount.amount.amount}
          amountTitle={discountAmountTitle}
        >
          {intl.formatMessage(messages.discount)}{" "}
          <Text as="span" color="default2">
            {discount.name}
          </Text>{" "}
          <Text color="default2" fontWeight="medium" size={3}>
            (applied)
          </Text>
        </OrderSummaryListItem>
      ));
    }

    const hasDiscount = !!editableProps?.orderDiscount;
    const discountLabel = getOrderDiscountLabel(
      editableProps?.orderDiscount,
      orderTotal.gross.currency,
    );
    const discountReason = editableProps?.orderDiscount?.reason;

    if (!hasDiscount) {
      return (
        <OrderSummaryListItem amount={0} amountTitle={discountAmountTitle}>
          <Popover
            onOpenChange={val => {
              if (!val) {
                editableProps?.closeDialog();
              }
            }}
            open={editableProps?.isDialogOpen}
          >
            <Popover.Trigger>
              <Text as="span">
                <ButtonLink onClick={editableProps?.openDialog}>
                  {intl.formatMessage(messages.addDiscount)}
                </ButtonLink>
              </Text>
            </Popover.Trigger>
            <Popover.Content align="start" className={sprinkles({ zIndex: "3" })}>
              <Box boxShadow="defaultOverlay">
                {editableProps && (
                  <OrderDiscountCommonModal
                    modalType={ORDER_DISCOUNT}
                    existingDiscount={editableProps.orderDiscount ?? emptyDiscount}
                    maxPrice={editableProps.undiscountedPrice}
                    onConfirm={editableProps.addOrderDiscount}
                    onClose={editableProps.closeDialog}
                    onRemove={editableProps.removeOrderDiscount}
                    confirmStatus={editableProps.orderDiscountAddStatus}
                    removeStatus={editableProps.orderDiscountRemoveStatus}
                  />
                )}
              </Box>
            </Popover.Content>
          </Popover>
        </OrderSummaryListItem>
      );
    }

    const discountDisplayValue =
      discountLabel.percentage || intl.formatMessage(messages.fixedAmount);
    const discountAmount = parseFloat(discountLabel.value) || 0;

    return (
      <OrderSummaryListItem amount={discountAmount} amountTitle={discountAmountTitle}>
        {intl.formatMessage(messages.discount)}{" "}
        <Popover
          onOpenChange={val => {
            if (!val) {
              editableProps?.closeDialog();
            }
          }}
          open={editableProps?.isDialogOpen}
        >
          <Popover.Trigger>
            <Text as="span">
              <ButtonLink onClick={editableProps?.openDialog} title={discountReason || undefined}>
                {discountDisplayValue}
              </ButtonLink>
            </Text>
          </Popover.Trigger>
          <Popover.Content align="start" className={sprinkles({ zIndex: "3" })}>
            <Box boxShadow="defaultOverlay">
              {editableProps && (
                <OrderDiscountCommonModal
                  modalType={ORDER_DISCOUNT}
                  existingDiscount={editableProps.orderDiscount ?? emptyDiscount}
                  maxPrice={editableProps.undiscountedPrice}
                  onConfirm={editableProps.addOrderDiscount}
                  onClose={editableProps.closeDialog}
                  onRemove={editableProps.removeOrderDiscount}
                  confirmStatus={editableProps.orderDiscountAddStatus}
                  removeStatus={editableProps.orderDiscountRemoveStatus}
                />
              )}
            </Box>
          </Popover.Content>
        </Popover>{" "}
        <Text color="default2" fontWeight="medium" size={3}>
          (applied)
        </Text>
      </OrderSummaryListItem>
    );
  };

  const { isEditable: _, ...boxProps } = restProps as any;

  return (
    <Box
      padding={5}
      borderRadius={4}
      borderStyle="solid"
      borderColor="default1"
      borderWidth={1}
      {...boxProps}
    >
      <OrderValueHeader
        description={intl.formatMessage({
          defaultMessage: "All lines as ordered by the client.",
          id: "73SSOz",
        })}
      />

      <Box as="ul" display="grid" gap={1} marginTop={4}>
        <OrderSummaryListItem
          amount={orderSubtotal.gross.amount}
          amountTitle={intl.formatMessage(messages.subtotalTitle)}
          data-test-id="order-subtotal-line"
        >
          {intl.formatMessage({
            defaultMessage: "Subtotal",
            id: "L8seEc",
          })}
        </OrderSummaryListItem>

        {renderShippingRow()}

        {formErrors.shipping && (
          <Box>
            <Text size={2} color="critical1">
              {getOrderErrorMessage(formErrors.shipping, intl)}
            </Text>
          </Box>
        )}

        {!displayGrossPrices && (
          <OrderSummaryListItem
            amount={orderTotal.tax.amount}
            title={intl.formatMessage(messages.netPrices)}
            amountTitle={intl.formatMessage(messages.taxesTitle)}
          >
            {intl.formatMessage({
              defaultMessage: "Taxes ",
              id: "HTiAMm",
            })}
          </OrderSummaryListItem>
        )}

        <Box display="grid" placeItems="end" title={intl.formatMessage(messages.totalTitle)}>
          <Box
            borderStyle="solid"
            borderColor="default1"
            borderBottomWidth={0}
            borderLeftWidth={0}
            borderRightWidth={0}
          >
            {intl.formatMessage(
              {
                defaultMessage: "{currency} {totalAmount}",
                id: "V21v8h",
              },
              {
                currency: (
                  <Text fontWeight="bold" color="default2" size={3}>
                    {orderTotal.gross.currency}
                  </Text>
                ),
                totalAmount: (
                  <OrderSummaryListAmount
                    amount={orderTotal.gross.amount}
                    fontWeight="bold"
                    data-test-id="order-total"
                  />
                ),
              },
            )}
          </Box>
        </Box>

        {renderDiscountRow()}

        {displayGrossPrices && (
          <OrderSummaryListItem
            amount={orderTotal.tax.amount}
            title={intl.formatMessage(messages.grossPrices)}
            amountTitle={intl.formatMessage(messages.taxesTitle)}
          >
            {intl.formatMessage({
              defaultMessage: "Taxes ",
              id: "HTiAMm",
            })}
            <Text color="default2" fontWeight="medium" size={3}>
              (included)
            </Text>
          </OrderSummaryListItem>
        )}

        {giftCardsAmount && giftCardsAmount > 0 && usedGiftCards && (
          <OrderSummaryListItem
            amount={-giftCardsAmount}
            amountTitle={intl.formatMessage(messages.giftCardTitle)}
          >
            {intl.formatMessage(
              {
                defaultMessage:
                  "{usedGiftCards, plural, one {Gift card} other {Gift cards} } {giftCardCodesList}",
                id: "5kODlC",
              },
              {
                usedGiftCards: usedGiftCards.length,
                giftCardCodesList: (
                  <Text fontWeight="medium" color="default2" size={3}>
                    ({usedGiftCards.map(card => card.last4CodeChars).join(", ")})
                  </Text>
                ),
              },
            )}
          </OrderSummaryListItem>
        )}
      </Box>
    </Box>
  );
};
