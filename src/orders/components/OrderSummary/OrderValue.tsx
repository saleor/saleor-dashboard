import { ButtonLink } from "@dashboard/components/ButtonLink";
import { voucherUrl } from "@dashboard/discounts/urls";
import {
  DiscountValueTypeEnum,
  type OrderDetailsFragment,
  OrderDiscountType,
  type OrderErrorFragment,
  type OrderLinesUpdateFragment,
} from "@dashboard/graphql";
import {
  type DiscountTypeCategory,
  getDiscountTypeCategory,
} from "@dashboard/orders/utils/discounts";
import { type OrderDiscountContextConsumerProps } from "@dashboard/products/components/OrderDiscountProviders/OrderDiscountProvider";
import { type OrderDiscountData } from "@dashboard/products/components/OrderDiscountProviders/types";
import { getFormErrors } from "@dashboard/utils/errors";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { Box, Text, Tooltip } from "@saleor/macaw-ui-next";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { type ReactNode, useState } from "react";
import { defineMessages, type MessageDescriptor, useIntl } from "react-intl";
import useRouter from "use-react-router";

import { OrderDiscountModal } from "../OrderDiscountModal/OrderDiscountModal";
import { type LineDiscountSummaryEntry } from "./getLineDiscountsSummary";
import { OrderSummaryListAmount } from "./OrderSummaryListAmount";
import { OrderSummaryListItem } from "./OrderSummaryListItem";
import styles from "./OrderValue.module.css";
import { OrderValueHeader } from "./OrderValueHeader";

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
  manual: {
    id: "u2/qds",
    defaultMessage: "Manual",
    description: "label for manually added order discount",
  },
  voucher: {
    id: "nMQ3ZW",
    defaultMessage: "Voucher",
    description: "label for voucher discount type in order summary",
  },
  promotion: {
    id: "lrTQWC",
    defaultMessage: "Promotion",
    description: "label for promotion discount type in order summary",
  },
  fixedAmount: {
    id: "YPCB7b",
    defaultMessage: "Fixed amount",
    description: "label for fixed amount discount type",
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
  overrideWithManual: {
    id: "x5wgj0",
    defaultMessage: "Override with manual discount",
    description: "link to replace automatic order discounts with a manual one",
  },
  orderDiscountsLabel: {
    id: "RADyO6",
    defaultMessage: "Order",
    description: "sub-header for order-level discounts in summary",
  },
  lineDiscountsLabel: {
    id: "jg8M0x",
    defaultMessage: "Lines",
    description: "sub-header for line-level discounts in summary",
  },
  beforeDiscountsTooltipTitle: {
    id: "zcyBm+",
    defaultMessage: "Before discounts",
    description: "tooltip title for undiscounted subtotal next to order subtotal",
  },
  beforeDiscountsTooltipDescription: {
    id: "R06XZQ",
    defaultMessage: "Sum of each line's undiscounted total from the order",
    description: "tooltip explanation for before-discounts subtotal amount",
  },
  lineCount: {
    id: "U2il94",
    defaultMessage: "{count, plural, one {# line} other {# lines}}",
    description: "number of order lines with this discount type",
  },
});

// Fields that can change when order lines are modified (from OrderLinesUpdateFragment)
type LineUpdateFields = {
  orderSubtotal: OrderLinesUpdateFragment["subtotal"];
  shippingMethodName: OrderLinesUpdateFragment["shippingMethodName"];
  shippingPrice: OrderLinesUpdateFragment["shippingPrice"];
  orderTotal: OrderLinesUpdateFragment["total"];
  discounts: OrderLinesUpdateFragment["discounts"];
  isShippingRequired: OrderLinesUpdateFragment["isShippingRequired"];
  shippingMethods: OrderLinesUpdateFragment["shippingMethods"];
  // shippingMethod is reset to null when isShippingRequired becomes false
  shippingMethod: OrderLinesUpdateFragment["shippingMethod"];
  lineDiscountsSummary: LineDiscountSummaryEntry[];
};

// Fields that don't change on line mutations (from OrderDetailsFragment)
type StaticFields = {
  giftCardsAmount: number | null;
  usedGiftCards: OrderDetailsFragment["giftCards"] | null;
  displayGrossPrices: OrderDetailsFragment["displayGrossPrices"];
  voucherId: string | null;
  undiscountedSubtotal: number;
};

type BaseProps = LineUpdateFields & StaticFields;

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
  shippingAddress: OrderDetailsFragment["shippingAddress"];
  errors?: OrderErrorFragment[];
};

type ReadOnlyProps = {
  isEditable?: false;
};

type Props = BaseProps & (EditableProps | ReadOnlyProps);

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

const discountTypeLabelMessages: Record<DiscountTypeCategory, MessageDescriptor> = {
  manual: messages.manual,
  voucher: messages.voucher,
  promotion: messages.promotion,
  other: messages.discount,
};

const getDiscountTypeLabel = (type: OrderDiscountType, intl: ReturnType<typeof useIntl>): string =>
  intl.formatMessage(discountTypeLabelMessages[getDiscountTypeCategory(type)]);

const cornerIcon = (
  <Box
    as="span"
    display="inline-block"
    flexShrink="0"
    borderColor="default1"
    borderStyle="solid"
    borderTopWidth={0}
    borderRightWidth={0}
    borderRadius={1}
    __width="6px"
    __height="8px"
    __borderBottomWidth="1.5px"
    __borderLeftWidth="1.5px"
    __position="relative"
    __top="-2px"
    __marginRight="4px"
  />
);

export const OrderValue = (props: Props): ReactNode => {
  const {
    orderSubtotal,
    shippingMethodName,
    shippingPrice,
    orderTotal,
    discounts,
    voucherId,
    giftCardsAmount,
    usedGiftCards,
    displayGrossPrices,
    lineDiscountsSummary,
    undiscountedSubtotal,
    isEditable = false,
  } = props;
  const intl = useIntl();
  const { history } = useRouter();
  const [discountsExpanded, setDiscountsExpanded] = useState(false);
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

  const renderDiscountRow = ({
    key,
    label,
    detail,
    amount,
    amountTitle,
  }: {
    key: string;
    label: string;
    detail?: ReactNode;
    amount: number;
    amountTitle: string;
  }): ReactNode => (
    <Box
      as="li"
      key={key}
      display="grid"
      __gridTemplateColumns="1fr auto"
      alignItems="baseline"
      gap={2}
      __minWidth={0}
    >
      <Box
        display="grid"
        __gridTemplateColumns="auto auto minmax(0, 1fr)"
        alignItems="baseline"
        gap={0.5}
        columnGap={1}
        __minWidth={0}
      >
        {cornerIcon}
        <Text as="span" size={4}>
          {label}
        </Text>
        {detail && (
          <Text
            as="span"
            size={4}
            overflow="hidden"
            __whiteSpace="nowrap"
            __textOverflow="ellipsis"
          >
            {detail}
          </Text>
        )}
      </Box>
      <Box title={amountTitle}>
        <OrderSummaryListAmount amount={amount} size={4} />
      </Box>
    </Box>
  );

  const renderOrderDiscountSubgroup = (): ReactNode => {
    const discountAmountTitle = intl.formatMessage(messages.discountTitle);
    const automaticDiscounts = discounts.filter(
      discount => discount.type !== OrderDiscountType.MANUAL,
    );
    const hasManualDiscount = !!editableProps?.orderDiscount;
    const hasAutomaticDiscounts = automaticDiscounts.length > 0;

    if (!isEditable) {
      if (discounts.length === 0) {
        return null;
      }

      return (
        <Box display="grid" gap={0.5} __minWidth={0}>
          <Text size={3} color="default2">
            {intl.formatMessage(messages.orderDiscountsLabel)}
          </Text>
          <Box display="grid" gap={0.5} paddingLeft={1} __minWidth={0}>
            {discounts.map(discount =>
              renderDiscountRow({
                key: `order-discount-${discount.id}`,
                label: getDiscountTypeLabel(discount.type, intl),
                detail:
                  discount.type === OrderDiscountType.VOUCHER && voucherId ? (
                    <Text
                      as="span"
                      color="default2"
                      className={styles.subtleLink}
                      onClick={() => history.push(voucherUrl(voucherId))}
                      title={discount.name ?? undefined}
                    >
                      {discount.name}
                    </Text>
                  ) : (
                    <Text as="span" color="default2" title={discount.name ?? undefined}>
                      {discount.name}
                    </Text>
                  ),
                amount: discount.amount.amount,
                amountTitle: discountAmountTitle,
              }),
            )}
          </Box>
        </Box>
      );
    }

    if (hasManualDiscount) {
      const discountLabel = getOrderDiscountLabel(
        editableProps?.orderDiscount,
        orderTotal.gross.currency,
      );
      const discountReason = editableProps?.orderDiscount?.reason;
      const discountDisplayValue =
        discountLabel.percentage || intl.formatMessage(messages.fixedAmount);
      const discountAmount = parseFloat(discountLabel.value) || 0;

      return (
        <Box display="grid" gap={0.5} __minWidth={0}>
          <Text size={3} color="default2">
            {intl.formatMessage(messages.orderDiscountsLabel)}
          </Text>
          <Box display="grid" gap={0.5} paddingLeft={1} __minWidth={0}>
            {renderDiscountRow({
              key: "order-manual-discount",
              label: intl.formatMessage(messages.manual),
              detail: (
                <ButtonLink onClick={editableProps?.openDialog} title={discountReason || undefined}>
                  {discountDisplayValue}
                </ButtonLink>
              ),
              amount: discountAmount,
              amountTitle: discountAmountTitle,
            })}
          </Box>
        </Box>
      );
    }

    if (hasAutomaticDiscounts) {
      return (
        <Box display="grid" gap={0.5} __minWidth={0}>
          <Text size={3} color="default2">
            {intl.formatMessage(messages.orderDiscountsLabel)}
          </Text>
          <Box display="grid" gap={0.5} paddingLeft={1} __minWidth={0}>
            {automaticDiscounts.map(discount =>
              renderDiscountRow({
                key: `order-auto-discount-${discount.id}`,
                label: getDiscountTypeLabel(discount.type, intl),
                detail:
                  discount.type === OrderDiscountType.VOUCHER && voucherId ? (
                    <Text
                      as="span"
                      color="default2"
                      className={styles.subtleLink}
                      onClick={() => history.push(voucherUrl(voucherId))}
                      title={discount.name ?? undefined}
                    >
                      {discount.name}
                    </Text>
                  ) : (
                    <Text as="span" color="default2" title={discount.name ?? undefined}>
                      {discount.name}
                    </Text>
                  ),
                amount: discount.amount.amount,
                amountTitle: discountAmountTitle,
              }),
            )}
            <Text size={4} paddingLeft={1}>
              <ButtonLink onClick={editableProps?.openDialog}>
                {intl.formatMessage(messages.overrideWithManual)}
              </ButtonLink>
            </Text>
          </Box>
        </Box>
      );
    }

    return (
      <Box display="grid" gap={0.5} __minWidth={0}>
        <Text size={3} color="default2">
          {intl.formatMessage(messages.orderDiscountsLabel)}
        </Text>
        <Box paddingLeft={1}>
          <ButtonLink onClick={editableProps?.openDialog}>
            {intl.formatMessage(messages.addDiscount)}
          </ButtonLink>
        </Box>
      </Box>
    );
  };

  const renderLineDiscountSubgroup = (): ReactNode => {
    if (lineDiscountsSummary.length === 0) {
      return null;
    }

    const discountAmountTitle = intl.formatMessage(messages.discountTitle);

    return (
      <Box display="grid" gap={0.5} __minWidth={0}>
        <Text size={3} color="default2">
          {intl.formatMessage(messages.lineDiscountsLabel)}
        </Text>
        <Box display="grid" gap={0.5} paddingLeft={1} __minWidth={0}>
          {lineDiscountsSummary.map(entry =>
            renderDiscountRow({
              key: `line-discount-${entry.type}`,
              label: getDiscountTypeLabel(entry.type, intl),
              detail: (
                <Text as="span" color="default2">
                  ({intl.formatMessage(messages.lineCount, { count: entry.lineCount })})
                </Text>
              ),
              amount: entry.totalAmount,
              amountTitle: discountAmountTitle,
            }),
          )}
        </Box>
      </Box>
    );
  };

  const renderDiscountSection = (): ReactNode => {
    const hasOrderDiscounts = discounts.length > 0 || !!editableProps?.orderDiscount;
    const hasLineDiscounts = lineDiscountsSummary.length > 0;
    const hasAnyDiscount = hasOrderDiscounts || hasLineDiscounts;

    if (!hasAnyDiscount && !isEditable) {
      return null;
    }

    if (!hasAnyDiscount && isEditable) {
      return (
        <OrderSummaryListItem amount={0} amountTitle={intl.formatMessage(messages.discountTitle)}>
          <Text as="span">
            <ButtonLink onClick={editableProps?.openDialog}>
              {intl.formatMessage(messages.addDiscount)}
            </ButtonLink>
          </Text>
        </OrderSummaryListItem>
      );
    }

    const orderDiscountTotal = discounts.reduce((sum, d) => sum + d.amount.amount, 0);
    const lineDiscountTotal = lineDiscountsSummary.reduce((sum, e) => sum + e.totalAmount, 0);
    const totalDiscountAmount = Math.round((orderDiscountTotal + lineDiscountTotal) * 100) / 100;
    const ToggleIcon = discountsExpanded ? ChevronUp : ChevronDown;

    return (
      <Box as="li" display="grid" gap={1.5} __minWidth={0}>
        <Box
          className={styles.discountSectionToggle}
          display="grid"
          __gridTemplateColumns="1fr auto"
          alignItems="baseline"
          gap={2}
          cursor="pointer"
          onClick={() => setDiscountsExpanded(prev => !prev)}
          data-test-id="discount-section-toggle"
        >
          <Box display="flex" alignItems="center" flexWrap="wrap" __minWidth={0}>
            <Text size={4} color="default1">
              {intl.formatMessage(messages.discount)}
            </Text>
            <Text as="span" color="default2" fontWeight="regular" size={4} marginLeft={1}>
              (applied)
            </Text>
            <Box
              as="span"
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              marginLeft={1}
              className={styles.discountToggleChevron}
            >
              <ToggleIcon size={14} />
            </Box>
          </Box>
          <Box title={intl.formatMessage(messages.discountTitle)}>
            <OrderSummaryListAmount amount={totalDiscountAmount} size={4} color="default1" />
          </Box>
        </Box>

        {discountsExpanded && (
          <Box display="grid" gap={1.5} paddingLeft={1} __minWidth={0}>
            {renderOrderDiscountSubgroup()}
            {renderLineDiscountSubgroup()}
          </Box>
        )}
      </Box>
    );
  };

  const renderOrderDiscountModal = () => {
    if (!editableProps) {
      return null;
    }

    return (
      <OrderDiscountModal
        open={editableProps.isDialogOpen}
        existingDiscount={editableProps.orderDiscount ?? undefined}
        maxPrice={editableProps.undiscountedPrice}
        onConfirm={editableProps.addOrderDiscount}
        onClose={editableProps.closeDialog}
        onRemove={editableProps.removeOrderDiscount}
        confirmStatus={editableProps.orderDiscountAddStatus}
        removeStatus={editableProps.orderDiscountRemoveStatus}
      />
    );
  };

  return (
    <Box padding={5} borderRadius={4} borderStyle="solid" borderColor="default1" borderWidth={1}>
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
          {undiscountedSubtotal !== orderSubtotal.gross.amount && (
            <>
              {" "}
              <Tooltip>
                <Tooltip.Trigger>
                  <Box
                    as="span"
                    display="inline-flex"
                    cursor="pointer"
                    style={{ verticalAlign: "middle" }}
                    data-test-id="subtotal-before-discounts"
                  >
                    <Info size={12} />
                  </Box>
                </Tooltip.Trigger>
                <Tooltip.Content>
                  <Tooltip.Arrow />
                  <Box display="flex" flexDirection="column" gap={2} __maxWidth="min(92vw, 20rem)">
                    <Text size={3} fontWeight="medium">
                      {intl.formatMessage(messages.beforeDiscountsTooltipTitle)}
                    </Text>
                    <Text size={4} fontWeight="medium">
                      {intl.formatNumber(undiscountedSubtotal, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Text>
                    <Text size={1} color="default2">
                      {intl.formatMessage(messages.beforeDiscountsTooltipDescription)}
                    </Text>
                  </Box>
                </Tooltip.Content>
              </Tooltip>
            </>
          )}
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

        {renderDiscountSection()}

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

      {renderOrderDiscountModal()}
    </Box>
  );
};
