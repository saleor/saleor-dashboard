// @ts-strict-ignore
import Link from "@dashboard/components/Link";
import Money from "@dashboard/components/Money";
import { TimelineEvent } from "@dashboard/components/Timeline/TimelineEvent";
import { customerPath } from "@dashboard/customers/urls";
import { ExtensionsPaths, ExtensionsUrls } from "@dashboard/extensions/urls";
import { type GiftCardDetailsQuery, GiftCardEventsEnum } from "@dashboard/graphql";
import { orderUrl } from "@dashboard/orders/urls";
import { staffMemberDetailsUrl } from "@dashboard/staff/urls";
import { type IntlShape, useIntl } from "react-intl";

import { giftCardHistoryTimelineMessages as timelineMessages } from "./messages";

type GiftCardEventType = GiftCardDetailsQuery["giftCard"]["events"][0];

const getUserOrApp = (event: GiftCardEventType): string | null => {
  if (event.user) {
    const { firstName, lastName, email } = event.user;

    if (lastName === "" || firstName === "") {
      return email;
    }

    return `${firstName} ${lastName}`;
  }

  if (event.app) {
    return event.app.name;
  }

  return null;
};
const getUserOrAppUrl = (event: GiftCardEventType): string => {
  if (event.user) {
    return staffMemberDetailsUrl(event.user.id);
  }

  if (event.app) {
    return ExtensionsUrls.resolveViewManifestExtensionUrl(event.app.id);
  }

  return null;
};
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

  return customerId ? <Link href={customerPath(customerId)}>{email}</Link> : <span>{email}</span>;
};

const getEventMessage = (event: GiftCardEventType, intl: IntlShape) => {
  const user = getUserOrApp(event);
  const userUrl = getUserOrAppUrl(event);

  switch (event.type) {
    case GiftCardEventsEnum.ACTIVATED:
      return user
        ? intl.formatMessage(timelineMessages.activated, {
            activatedBy: <Link href={userUrl}>{user}</Link>,
          })
        : intl.formatMessage(timelineMessages.activatedAnonymous);
    case GiftCardEventsEnum.BALANCE_RESET: {
      const oldBalance = event.balance?.oldCurrentBalance;
      const newBalance = event.balance?.currentBalance;
      const hasAmounts = !!(oldBalance && newBalance);

      if (user) {
        return hasAmounts
          ? intl.formatMessage(timelineMessages.balanceResetWithAmount, {
              oldBalance: <Money money={oldBalance} />,
              newBalance: <Money money={newBalance} />,
              resetBy: <Link href={userUrl}>{user}</Link>,
            })
          : intl.formatMessage(timelineMessages.balanceReset, {
              resetBy: <Link href={userUrl}>{user}</Link>,
            });
      }

      return hasAmounts
        ? intl.formatMessage(timelineMessages.balanceResetWithAmountAnonymous, {
            oldBalance: <Money money={oldBalance} />,
            newBalance: <Money money={newBalance} />,
          })
        : intl.formatMessage(timelineMessages.balanceResetAnonymous);
    }
    case GiftCardEventsEnum.BALANCE_ADJUSTED: {
      const oldBalance = event.balance?.oldCurrentBalance;
      const newBalance = event.balance?.currentBalance;
      const hasAmounts = !!(oldBalance && newBalance);

      if (user) {
        return hasAmounts
          ? intl.formatMessage(timelineMessages.balanceAdjustedWithAmount, {
              oldBalance: <Money money={oldBalance} />,
              newBalance: <Money money={newBalance} />,
              adjustedBy: <Link href={userUrl}>{user}</Link>,
            })
          : intl.formatMessage(timelineMessages.balanceAdjusted, {
              adjustedBy: <Link href={userUrl}>{user}</Link>,
            });
      }

      return hasAmounts
        ? intl.formatMessage(timelineMessages.balanceAdjustedWithAmountAnonymous, {
            oldBalance: <Money money={oldBalance} />,
            newBalance: <Money money={newBalance} />,
          })
        : intl.formatMessage(timelineMessages.balanceAdjustedAnonymous);
    }
    case GiftCardEventsEnum.BOUGHT:
      return intl.formatMessage(timelineMessages.bought, {
        orderNumber: <Link href={orderUrl(event.orderId)}>#{event.orderNumber}</Link>,
      });
    case GiftCardEventsEnum.DEACTIVATED:
      return user
        ? intl.formatMessage(timelineMessages.deactivated, {
            deactivatedBy: <Link href={userUrl}>{user}</Link>,
          })
        : intl.formatMessage(timelineMessages.deactivatedAnonymous);
    case GiftCardEventsEnum.EXPIRY_DATE_UPDATED:
      return user
        ? intl.formatMessage(timelineMessages.expiryDateUpdate, {
            expiryUpdatedBy: <Link href={userUrl}>{user}</Link>,
          })
        : intl.formatMessage(timelineMessages.expiryDateUpdateAnonymous);
    case GiftCardEventsEnum.ISSUED:
      return user
        ? intl.formatMessage(timelineMessages.issued, {
            issuedBy: <Link href={userUrl}>{user}</Link>,
          })
        : intl.formatMessage(timelineMessages.issuedAnonymous);
    case GiftCardEventsEnum.REFUNDED_IN_ORDER:
      return event.orderId && event.orderNumber
        ? intl.formatMessage(timelineMessages.refundedInOrder, {
            orderLink: <Link href={orderUrl(event.orderId)}>#{event.orderNumber}</Link>,
          })
        : intl.formatMessage(timelineMessages.refundedInOrderNoLink);
    case GiftCardEventsEnum.ASSIGNED_TO_USER: {
      const customer = getAssignmentCustomer(
        event.assignedTo?.currentAssignedToEmail,
        event.assignedTo?.currentAssignedTo?.id,
        intl,
      );

      return user
        ? intl.formatMessage(timelineMessages.assignedToUserBy, {
            customer,
            assignedBy: <Link href={userUrl}>{user}</Link>,
          })
        : intl.formatMessage(timelineMessages.assignedToUser, { customer });
    }
    case GiftCardEventsEnum.UNASSIGNED_FROM_USER: {
      const customer = getAssignmentCustomer(
        event.assignedTo?.oldAssignedToEmail,
        event.assignedTo?.oldAssignedTo?.id,
        intl,
      );

      return user
        ? intl.formatMessage(timelineMessages.unassignedFromUserBy, {
            customer,
            unassignedBy: <Link href={userUrl}>{user}</Link>,
          })
        : intl.formatMessage(timelineMessages.unassignedFromUser, { customer });
    }
    case GiftCardEventsEnum.RESENT:
      return intl.formatMessage(timelineMessages.resent);
    case GiftCardEventsEnum.SENT_TO_CUSTOMER:
      return intl.formatMessage(timelineMessages.sentToCustomer);
    case GiftCardEventsEnum.TAGS_UPDATED:
      return intl.formatMessage(timelineMessages.tagsUpdated);
    case GiftCardEventsEnum.UPDATED:
      return intl.formatMessage(timelineMessages.tagsUpdated);
    case GiftCardEventsEnum.USED_IN_ORDER:
      return user
        ? intl.formatMessage(timelineMessages.usedInOrder, {
            orderLink: <Link href={orderUrl(event.orderId)}>#{event.orderNumber}</Link>,
            buyer: content =>
              !!user && (
                <Link
                  href={
                    event.user
                      ? customerPath(event.user.id)
                      : ExtensionsPaths.resolveViewManifestExtension(event.app.id)
                  }
                >{`${content} ${user}`}</Link>
              ),
          })
        : intl.formatMessage(timelineMessages.usedInOrderAnonymous, {
            orderLink: <Link href={orderUrl(event.orderId)}>#{event.orderNumber}</Link>,
          });
  }
};

interface GiftCardTimelineEventProps {
  date: string;
  event: GiftCardEventType;
}

const GiftCardTimelineEvent = ({ date, event }: GiftCardTimelineEventProps) => {
  const intl = useIntl();
  const avatarUrl = event.user?.avatar?.url ?? event.app?.brand?.logo?.default ?? null;

  return (
    <TimelineEvent
      date={date}
      title={getEventMessage(event, intl)}
      hasPlainDate={false}
      avatar={avatarUrl ? { url: avatarUrl } : null}
    />
  );
};

export default GiftCardTimelineEvent;
