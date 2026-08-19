import Money from "@dashboard/components/Money";
import { TimelineEvent } from "@dashboard/components/Timeline/TimelineEvent";
import { TimelineLink } from "@dashboard/components/Timeline/TimelineLink";
import { getActorDisplayName, toActor } from "@dashboard/components/Timeline/utils";
import { customerPath } from "@dashboard/customers/urls";
import { type GiftCardDetailsQuery, GiftCardEventsEnum } from "@dashboard/graphql";
import { orderUrl } from "@dashboard/orders/urls";
import { type IMoney } from "@dashboard/utils/intl";
import { Text } from "@saleor/macaw-ui-next";
import {
  Ban,
  Calendar,
  Gift,
  type LucideIcon,
  Mail,
  Package,
  Tags,
  User,
  Wallet,
} from "lucide-react";
import { type ReactNode } from "react";
import { type IntlShape, useIntl } from "react-intl";

import { giftCardHistoryTimelineMessages as timelineMessages } from "./messages";

type GiftCardEventType = NonNullable<GiftCardDetailsQuery["giftCard"]>["events"][number];

/**
 * Small shared set — group related events rather than one glyph per enum value.
 * Notes use TimelineNote’s speech bubble; unmapped types keep the default dot.
 */
const giftCardEventIconMap: Partial<Record<GiftCardEventsEnum, LucideIcon>> = {
  [GiftCardEventsEnum.ISSUED]: Gift,
  [GiftCardEventsEnum.ACTIVATED]: Gift,
  [GiftCardEventsEnum.DEACTIVATED]: Ban,
  [GiftCardEventsEnum.ASSIGNED_TO_USER]: User,
  [GiftCardEventsEnum.UNASSIGNED_FROM_USER]: User,
  [GiftCardEventsEnum.BALANCE_ADJUSTED]: Wallet,
  [GiftCardEventsEnum.BALANCE_RESET]: Wallet,
  [GiftCardEventsEnum.TAGS_UPDATED]: Tags,
  [GiftCardEventsEnum.EXPIRY_DATE_UPDATED]: Calendar,
  [GiftCardEventsEnum.BOUGHT]: Package,
  [GiftCardEventsEnum.USED_IN_ORDER]: Package,
  [GiftCardEventsEnum.REFUNDED_IN_ORDER]: Package,
  [GiftCardEventsEnum.RESENT]: Mail,
  [GiftCardEventsEnum.SENT_TO_CUSTOMER]: Mail,
};

const OrderLink = ({ orderId, orderNumber }: { orderId: string; orderNumber: string | number }) => (
  <TimelineLink href={orderUrl(orderId)} entity="order">
    #{orderNumber}
  </TimelineLink>
);

const BalanceAmount = ({ money }: { money: IMoney }) => (
  <Text as="span" size={3} fontWeight="medium">
    <Money money={money} />
  </Text>
);

// Renders the assigned customer email as a link to the customer (when the user
// has permission to see the customer id), otherwise as a plain span. Falls back
// to "a customer" when the email is not available.
const getAssignmentCustomer = (
  email: string | null | undefined,
  customerId: string | null | undefined,
  intl: IntlShape,
) => {
  if (!email) {
    return intl.formatMessage(timelineMessages.assignmentCustomerFallback);
  }

  return customerId ? (
    <TimelineLink href={customerPath(customerId)} entity="customer">
      {email}
    </TimelineLink>
  ) : (
    <span>{email}</span>
  );
};

const getBuyerDisplayName = (event: GiftCardEventType): string | null => {
  if (event.user) {
    const { firstName, lastName, email } = event.user;

    if (lastName === "" || firstName === "") {
      return email;
    }

    return `${firstName} ${lastName}`;
  }

  if (event.app?.name) {
    return event.app.name;
  }

  return null;
};

/**
 * Buyer on USED_IN_ORDER is a customer (not staff). Shared Actor attribution
 * would link to the staff URL — keep a secondary inline clause instead.
 */
const getUsedInOrderTitle = (event: GiftCardEventType, intl: IntlShape): ReactNode => {
  if (!event.orderId || !event.orderNumber) {
    return intl.formatMessage(timelineMessages.usedInOrderNoLink);
  }

  const orderLink = <OrderLink orderId={event.orderId} orderNumber={event.orderNumber} />;
  const primary = intl.formatMessage(timelineMessages.usedInOrderAnonymous, { orderLink });

  if (event.app && !event.user) {
    return primary;
  }

  const buyerName = getBuyerDisplayName(event);

  if (!event.user || !buyerName) {
    return primary;
  }

  return (
    <>
      {primary}
      <Text size={3} color="default2" as="span" marginLeft={1}>
        by{" "}
        <TimelineLink href={customerPath(event.user.id)} entity="customer" color="default2">
          {buyerName}
        </TimelineLink>
      </Text>
    </>
  );
};

const getEventMessage = (event: GiftCardEventType, intl: IntlShape): ReactNode => {
  switch (event.type) {
    case GiftCardEventsEnum.ACTIVATED:
      return intl.formatMessage(timelineMessages.activatedAnonymous);
    case GiftCardEventsEnum.BALANCE_RESET: {
      const oldBalance = event.balance?.oldCurrentBalance;
      const newBalance = event.balance?.currentBalance;

      return oldBalance && newBalance
        ? intl.formatMessage(timelineMessages.balanceResetWithAmountAnonymous, {
            oldBalance: <BalanceAmount money={oldBalance} />,
            newBalance: <BalanceAmount money={newBalance} />,
          })
        : intl.formatMessage(timelineMessages.balanceResetAnonymous);
    }
    case GiftCardEventsEnum.BALANCE_ADJUSTED: {
      const oldBalance = event.balance?.oldCurrentBalance;
      const newBalance = event.balance?.currentBalance;

      return oldBalance && newBalance
        ? intl.formatMessage(timelineMessages.balanceAdjustedWithAmountAnonymous, {
            oldBalance: <BalanceAmount money={oldBalance} />,
            newBalance: <BalanceAmount money={newBalance} />,
          })
        : intl.formatMessage(timelineMessages.balanceAdjustedAnonymous);
    }
    case GiftCardEventsEnum.BOUGHT:
      return event.orderId && event.orderNumber
        ? intl.formatMessage(timelineMessages.bought, {
            orderNumber: <OrderLink orderId={event.orderId} orderNumber={event.orderNumber} />,
          })
        : intl.formatMessage(timelineMessages.bought, {
            orderNumber: event.orderNumber ? `#${event.orderNumber}` : "",
          });
    case GiftCardEventsEnum.DEACTIVATED:
      return intl.formatMessage(timelineMessages.deactivatedAnonymous);
    case GiftCardEventsEnum.EXPIRY_DATE_UPDATED:
      return intl.formatMessage(timelineMessages.expiryDateUpdateAnonymous);
    case GiftCardEventsEnum.ISSUED:
      return intl.formatMessage(timelineMessages.issuedAnonymous);
    case GiftCardEventsEnum.REFUNDED_IN_ORDER:
      return event.orderId && event.orderNumber
        ? intl.formatMessage(timelineMessages.refundedInOrder, {
            orderLink: <OrderLink orderId={event.orderId} orderNumber={event.orderNumber} />,
          })
        : intl.formatMessage(timelineMessages.refundedInOrderNoLink);
    case GiftCardEventsEnum.ASSIGNED_TO_USER:
      return intl.formatMessage(timelineMessages.assignedToUser, {
        customer: getAssignmentCustomer(
          event.assignedTo?.currentAssignedToEmail,
          event.assignedTo?.currentAssignedTo?.id,
          intl,
        ),
      });
    case GiftCardEventsEnum.UNASSIGNED_FROM_USER:
      return intl.formatMessage(timelineMessages.unassignedFromUser, {
        customer: getAssignmentCustomer(
          event.assignedTo?.oldAssignedToEmail,
          event.assignedTo?.oldAssignedTo?.id,
          intl,
        ),
      });
    case GiftCardEventsEnum.RESENT:
      return intl.formatMessage(timelineMessages.resent);
    case GiftCardEventsEnum.SENT_TO_CUSTOMER:
      return intl.formatMessage(timelineMessages.sentToCustomer);
    case GiftCardEventsEnum.TAGS_UPDATED:
    case GiftCardEventsEnum.UPDATED:
      return intl.formatMessage(timelineMessages.tagsUpdated);
    case GiftCardEventsEnum.USED_IN_ORDER:
      return getUsedInOrderTitle(event, intl);
    default:
      return null;
  }
};

const resolveActor = (event: GiftCardEventType) => {
  // Customer buyer must not use staff Actor links — handled in the title.
  if (event.type === GiftCardEventsEnum.USED_IN_ORDER && event.user) {
    return undefined;
  }

  // App-only buyer on used-in-order: shared Actor attribution is correct.
  return toActor(event.user, event.app);
};

interface GiftCardTimelineEventProps {
  date: string | null;
  event: GiftCardEventType;
  isLastInGroup?: boolean;
}

export const GiftCardTimelineEvent = ({
  date,
  event,
  isLastInGroup,
}: GiftCardTimelineEventProps): JSX.Element => {
  const intl = useIntl();
  const icon = event.type ? giftCardEventIconMap[event.type] : undefined;
  const actor = resolveActor(event);

  // Ensure display name is resolvable before passing (apps without name skip attribution).
  const actorForHeader = actor && getActorDisplayName(actor) ? actor : undefined;

  return (
    <TimelineEvent
      date={date ?? ""}
      title={getEventMessage(event, intl)}
      hasPlainDate={false}
      icon={icon}
      actor={actorForHeader}
      isLastInGroup={isLastInGroup}
    />
  );
};
