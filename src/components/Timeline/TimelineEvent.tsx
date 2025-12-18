import { OrderEventsEnum } from "@dashboard/graphql";
import { RefundedIcon } from "@dashboard/icons/RefundedIcon";
import { ReturnedIcon } from "@dashboard/icons/ReturnedIcon";
import { getStatusColor, PillStatusType } from "@dashboard/misc";
import { Accordion, Box, sprinkles, Text, Tooltip, useTheme, vars } from "@saleor/macaw-ui-next";
import {
  AlertTriangleIcon,
  BanIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  CircleIcon,
  ClockIcon,
  CopyPlusIcon,
  CreditCardIcon,
  EraserIcon,
  ExternalLinkIcon,
  FileIcon,
  FileTextIcon,
  InfoIcon,
  LucideIcon,
  MailIcon,
  MapPinIcon,
  PackageIcon,
  PercentIcon,
  RefreshCwIcon,
  ReplaceIcon,
  ShoppingCartIcon,
  SignatureIcon,
  TruckIcon,
  XIcon,
} from "lucide-react";
import * as React from "react";

import styles from "./TimelineEvent.module.css";
import { TimelineEventHeader, TitleElement } from "./TimelineEventHeader";
import { Actor } from "./types";
import { safeStringify } from "./utils";

// Custom icon type that includes both Lucide icons and custom icons
type IconComponent = LucideIcon | typeof RefundedIcon | typeof ReturnedIcon;

// Map event types to pill status types (matching Order status pills)
const eventStatusMap: Partial<Record<OrderEventsEnum, PillStatusType>> = {
  // Fulfillment
  [OrderEventsEnum.FULFILLMENT_FULFILLED_ITEMS]: "success",
  [OrderEventsEnum.FULFILLMENT_CANCELED]: "error",
  [OrderEventsEnum.FULFILLMENT_REFUNDED]: "info",
  [OrderEventsEnum.FULFILLMENT_RETURNED]: "info",

  // Payment
  [OrderEventsEnum.PAYMENT_REFUNDED]: "info",
  [OrderEventsEnum.PAYMENT_FAILED]: "error",
  [OrderEventsEnum.ORDER_FULLY_PAID]: "success",
  [OrderEventsEnum.ORDER_MARKED_AS_PAID]: "success",

  // Transaction
  [OrderEventsEnum.TRANSACTION_REFUND_REQUESTED]: "info",
  [OrderEventsEnum.TRANSACTION_MARK_AS_PAID_FAILED]: "error",

  // Order lifecycle
  [OrderEventsEnum.CONFIRMED]: "success",
  [OrderEventsEnum.CANCELED]: "error",
};

// Map event types to icons - matching fulfillment group icons where applicable
const eventIconMap: Partial<Record<OrderEventsEnum, IconComponent>> = {
  // Order lifecycle
  [OrderEventsEnum.PLACED]: ShoppingCartIcon,
  [OrderEventsEnum.PLACED_FROM_DRAFT]: FileTextIcon,
  [OrderEventsEnum.PLACED_AUTOMATICALLY_FROM_PAID_CHECKOUT]: ShoppingCartIcon,
  [OrderEventsEnum.CONFIRMED]: CheckCircleIcon,
  [OrderEventsEnum.CANCELED]: XIcon,
  [OrderEventsEnum.EXPIRED]: ClockIcon,

  // Draft
  [OrderEventsEnum.DRAFT_CREATED]: FileTextIcon,
  [OrderEventsEnum.DRAFT_CREATED_FROM_REPLACE]: FileTextIcon,

  // Fulfillment - matching StatusIndicator icons
  [OrderEventsEnum.FULFILLMENT_FULFILLED_ITEMS]: PackageIcon, // Same as FulfillmentStatus.FULFILLED
  [OrderEventsEnum.FULFILLMENT_CANCELED]: EraserIcon, // Same as FulfillmentStatus.CANCELED
  [OrderEventsEnum.FULFILLMENT_AWAITS_APPROVAL]: SignatureIcon, // Same as FulfillmentStatus.WAITING_FOR_APPROVAL
  [OrderEventsEnum.FULFILLMENT_RESTOCKED_ITEMS]: RefreshCwIcon,
  [OrderEventsEnum.FULFILLMENT_REFUNDED]: RefundedIcon, // Same as FulfillmentStatus.REFUNDED
  [OrderEventsEnum.FULFILLMENT_RETURNED]: ReturnedIcon, // Same as FulfillmentStatus.RETURNED
  [OrderEventsEnum.FULFILLMENT_REPLACED]: ReplaceIcon, // Same as FulfillmentStatus.REPLACED

  // Payment
  [OrderEventsEnum.PAYMENT_AUTHORIZED]: CreditCardIcon,
  [OrderEventsEnum.PAYMENT_CAPTURED]: CreditCardIcon,
  [OrderEventsEnum.PAYMENT_REFUNDED]: RefundedIcon,
  [OrderEventsEnum.PAYMENT_VOIDED]: BanIcon,
  [OrderEventsEnum.PAYMENT_FAILED]: AlertTriangleIcon,
  [OrderEventsEnum.ORDER_FULLY_PAID]: CheckCircleIcon,
  [OrderEventsEnum.ORDER_MARKED_AS_PAID]: CheckCircleIcon,

  // Transaction
  [OrderEventsEnum.TRANSACTION_EVENT]: CreditCardIcon,
  [OrderEventsEnum.TRANSACTION_CHARGE_REQUESTED]: CreditCardIcon,
  [OrderEventsEnum.TRANSACTION_REFUND_REQUESTED]: RefundedIcon,
  [OrderEventsEnum.TRANSACTION_CANCEL_REQUESTED]: XIcon,
  [OrderEventsEnum.TRANSACTION_MARK_AS_PAID_FAILED]: AlertTriangleIcon,

  // Invoice
  [OrderEventsEnum.INVOICE_REQUESTED]: FileIcon,
  [OrderEventsEnum.INVOICE_GENERATED]: FileIcon,
  [OrderEventsEnum.INVOICE_UPDATED]: FileIcon,
  [OrderEventsEnum.INVOICE_SENT]: MailIcon,

  // Email
  [OrderEventsEnum.EMAIL_SENT]: MailIcon,

  // Products
  [OrderEventsEnum.ADDED_PRODUCTS]: PackageIcon,
  [OrderEventsEnum.REMOVED_PRODUCTS]: XIcon,
  [OrderEventsEnum.ORDER_LINE_PRODUCT_DELETED]: XIcon,
  [OrderEventsEnum.ORDER_LINE_VARIANT_DELETED]: XIcon,

  // Discounts
  [OrderEventsEnum.ORDER_DISCOUNT_ADDED]: PercentIcon,
  [OrderEventsEnum.ORDER_DISCOUNT_UPDATED]: PercentIcon,
  [OrderEventsEnum.ORDER_DISCOUNT_DELETED]: PercentIcon,
  [OrderEventsEnum.ORDER_DISCOUNT_AUTOMATICALLY_UPDATED]: PercentIcon,
  [OrderEventsEnum.ORDER_LINE_DISCOUNT_UPDATED]: PercentIcon,
  [OrderEventsEnum.ORDER_LINE_DISCOUNT_REMOVED]: PercentIcon,

  // Shipping
  [OrderEventsEnum.TRACKING_UPDATED]: TruckIcon,

  // Address
  [OrderEventsEnum.UPDATED_ADDRESS]: MapPinIcon,

  // Other
  [OrderEventsEnum.ORDER_REPLACEMENT_CREATED]: CopyPlusIcon,
  [OrderEventsEnum.OVERSOLD_ITEMS]: AlertTriangleIcon,
  [OrderEventsEnum.EXTERNAL_SERVICE_NOTIFICATION]: ExternalLinkIcon,
  [OrderEventsEnum.OTHER]: CircleIcon,
};

export interface TimelineEventProps {
  children?: React.ReactNode;
  date: string | React.ReactNode;
  title?: React.ReactNode;
  titleElements?: TitleElement[];
  hasPlainDate?: boolean;
  eventData?: unknown;
  actor?: Actor;
  eventType?: OrderEventsEnum | null;
  isLastInGroup?: boolean;
}

const ICON_COLOR = vars.colors.text.default2;

// Icon wrapper component with circle background
const EventIcon = ({ eventType }: { eventType?: OrderEventsEnum | null }) => {
  const { theme: currentTheme } = useTheme();
  const IconComponent = eventType ? eventIconMap[eventType] : undefined;
  const statusType = eventType ? eventStatusMap[eventType] : undefined;

  // Get colors from pill status system for consistency with Order pills
  const statusColors = statusType ? getStatusColor({ status: statusType, currentTheme }) : null;

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius="100%"
      borderStyle="solid"
      borderWidth={1}
      __width="32px"
      __height="32px"
      flexShrink="0"
      __backgroundColor={statusColors?.base}
      __borderColor={statusColors?.border}
      __color={statusColors?.text || ICON_COLOR}
      backgroundColor={statusColors ? undefined : "default1"}
      borderColor={statusColors ? undefined : "default1"}
    >
      {IconComponent ? (
        <IconComponent size={16} color="currentColor" />
      ) : (
        <CircleIcon size={8} fill="currentColor" color="currentColor" />
      )}
    </Box>
  );
};

export const TimelineEvent = (props: TimelineEventProps) => {
  const {
    children,
    date,
    title,
    titleElements,
    hasPlainDate,
    eventData,
    actor,
    eventType,
    isLastInGroup,
  } = props;
  const hasChildren = children && React.Children.toArray(children).filter(Boolean).length > 0;

  const eventDataString = React.useMemo(() => {
    if (!eventData) return null;

    try {
      return safeStringify(eventData);
    } catch {
      return null;
    }
  }, [eventData]);

  const infoIcon = eventDataString ? (
    <Tooltip>
      <Tooltip.Trigger>
        <Box
          as="span"
          className={styles.infoIcon}
          cursor="pointer"
          display="inline-flex"
          alignItems="center"
        >
          <InfoIcon size={16} color={ICON_COLOR} />
        </Box>
      </Tooltip.Trigger>
      <Tooltip.Content side="bottom">
        <Tooltip.Arrow />
        <Box __maxWidth="400px" __maxHeight="300px" overflowY="auto" __whiteSpace="pre-wrap">
          <Text size={2} fontFamily="Geist Mono" wordBreak="break-all">
            {eventDataString}
          </Text>
        </Box>
      </Tooltip.Content>
    </Tooltip>
  ) : null;

  return (
    <Box display="flex" width="100%" position="relative" className={styles.eventRow}>
      {/* Vertical connecting line - hidden for last item in group */}
      {!isLastInGroup && (
        <Box
          position="absolute"
          __left="19px"
          __top="32px"
          __bottom="-20px"
          __width="1px"
          backgroundColor="default1Hovered"
        />
      )}

      <Box display="flex" marginBottom={5} width="100%">
        {hasChildren ? (
          <Accordion
            className={sprinkles({
              width: "100%",
            })}
          >
            <Accordion.Item value="accordionItemId">
              <Box display="flex" gap={2} alignItems="center" width="100%" __minHeight="32px">
                {/* Icon */}
                <Box
                  width={10}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexShrink="0"
                  position="relative"
                  __zIndex="1"
                >
                  <EventIcon eventType={eventType} />
                </Box>
                {/* Chevron */}
                <Accordion.Trigger
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    color: ICON_COLOR,
                    height: "32px",
                  }}
                >
                  <Box
                    as="span"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    __width="20px"
                    __height="20px"
                    className={styles.chevron}
                  >
                    <ChevronDownIcon size={16} color="currentColor" />
                  </Box>
                </Accordion.Trigger>
                {/* Header */}
                <Box __flex="1" display="flex" alignItems="center" __minHeight="32px">
                  <TimelineEventHeader
                    title={title}
                    date={date}
                    titleElements={titleElements}
                    hasPlainDate={hasPlainDate}
                    actor={actor}
                    tooltip={infoIcon}
                  />
                </Box>
              </Box>
              <Accordion.Content>
                <Box
                  __marginLeft="48px"
                  marginTop={3}
                  paddingY={3}
                  paddingX={4}
                  borderRadius={4}
                  borderStyle="solid"
                  borderWidth={1}
                  borderColor="default1"
                  backgroundColor="default1"
                >
                  {children}
                </Box>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        ) : (
          <Box display="flex" alignItems="center" width="100%" gap={2}>
            <Box
              width={10}
              display="flex"
              justifyContent="center"
              flexShrink="0"
              position="relative"
              __zIndex="1"
            >
              <EventIcon eventType={eventType} />
            </Box>
            <Box width="100%" display="flex" alignItems="center" __minHeight="32px">
              <TimelineEventHeader
                title={title}
                titleElements={titleElements}
                date={date}
                hasPlainDate={hasPlainDate}
                actor={actor}
                tooltip={infoIcon}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};
TimelineEvent.displayName = "TimelineEvent";
