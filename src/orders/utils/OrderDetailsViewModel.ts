import {
  FulfillmentFragment,
  FulfillmentStatus,
  GiftCardEventsEnum,
  OrderAction,
  OrderDetailsFragment,
  OrderStatus,
} from "@dashboard/graphql";
import compact from "lodash/compact";

export interface OrderTotalAmounts {
  total: OrderDetailsFragment["total"];
  totalAuthorized: OrderDetailsFragment["totalAuthorized"];
  totalAuthorizePending: OrderDetailsFragment["totalAuthorizePending"];
  totalBalance: OrderDetailsFragment["totalBalance"];
  totalCanceled: OrderDetailsFragment["totalCanceled"];
  totalCancelPending: OrderDetailsFragment["totalCancelPending"];
  totalCaptured: OrderDetailsFragment["totalCaptured"];
  totalCharged: OrderDetailsFragment["totalCharged"];
  totalChargePending: OrderDetailsFragment["totalChargePending"];
  totalRefunded: OrderDetailsFragment["totalRefunded"];
}

export abstract class OrderDetailsViewModel {
  static shouldShowInvoiceList(orderStatus: OrderStatus): boolean {
    return orderStatus !== "UNCONFIRMED";
  }

  static shouldShowCustomerNote(orderCustomerNote: string | null): boolean {
    return !!orderCustomerNote;
  }

  static shouldShowFulfillments(fulfillments: FulfillmentFragment[]): boolean {
    return fulfillments.length > 0;
  }

  static shouldShowFulfillButton(orderStatus: OrderStatus): boolean {
    return orderStatus === "UNFULFILLED";
  }

  static shouldShowFulfillmentTrackingNumberButton(fulfillmentStatus: FulfillmentStatus): boolean {
    return fulfillmentStatus === "FULFILLED";
  }

  static canOrderBeMarkedAsPaid(orderActions: OrderAction[]): boolean {
    return orderActions.includes(OrderAction.MARK_AS_PAID);
  }

  static canOrderCapture(actions: OrderAction[]): boolean {
    return actions.includes(OrderAction.CAPTURE);
  }

  static canOrderVoid(actions: OrderAction[]): boolean {
    return actions.includes(OrderAction.VOID);
  }

  static canOrderRefund(actions: OrderAction[]): boolean {
    return actions.includes(OrderAction.REFUND);
  }

  static canGrantRefund(order: {
    transactions: OrderDetailsFragment["transactions"];
    payments: OrderDetailsFragment["payments"];
  }): boolean {
    return order.transactions.length > 0 || order.payments.length > 0;
  }

  static canSendRefund(grantedRefunds: OrderDetailsFragment["grantedRefunds"]): boolean {
    return grantedRefunds.length > 0;
  }

  static canAnyRefund(order: {
    transactions: OrderDetailsFragment["transactions"];
    payments: OrderDetailsFragment["payments"];
    grantedRefunds: OrderDetailsFragment["grantedRefunds"];
  }): boolean {
    return this.canGrantRefund(order) || this.canSendRefund(order.grantedRefunds);
  }

  static hasGiftCards(giftCardsAmount: number | null): boolean {
    return (giftCardsAmount ?? 0) > 0;
  }

  static hasNoPayment(args: {
    canAnyRefund: boolean;
    shouldDisplay: ReturnType<typeof OrderDetailsViewModel.getShouldDisplayAmounts>;
    hasGiftCards: boolean;
  }): boolean {
    return (
      !args.canAnyRefund &&
      !args.shouldDisplay.charged &&
      !args.shouldDisplay.authorized &&
      !args.hasGiftCards
    );
  }

  static getGiftCardsAmountUsed(args: {
    id: string;
    giftCards: OrderDetailsFragment["giftCards"];
  }): number | null {
    if (!args.giftCards) {
      return null;
    }

    const usedInOrderEvents = compact(
      args.giftCards.map(({ events }) =>
        events.find(
          ({ orderId, type }) => type === GiftCardEventsEnum.USED_IN_ORDER && orderId === args.id,
        ),
      ),
    );

    if (!usedInOrderEvents.length) {
      return null;
    }

    return usedInOrderEvents.reduce((resultAmount, { balance }) => {
      /**
       * Instead of uncaught access error, explicitly throw.
       * If this is actually an issue (not just wrong schema), Sentry will be notified and we can fix the issue properly
       */
      if (!balance || !balance.currentBalance || !balance.oldCurrentBalance) {
        throw new Error("[extractOrderGiftCardUsedAmount] Missing balance", {
          cause: JSON.stringify(balance),
        });
      }

      const { currentBalance, oldCurrentBalance } = balance;
      const amountToAdd = oldCurrentBalance.amount - currentBalance.amount;

      return resultAmount + amountToAdd;
    }, 0);
  }

  static getUsedGiftCards(giftCards: OrderDetailsFragment["giftCards"]) {
    if (giftCards && giftCards.length > 0) {
      return giftCards;
    }

    return null;
  }

  static getShouldDisplayAmounts(orderAmounts: OrderTotalAmounts | null): {
    authorized: boolean;
    charged: boolean;
    cancelled: boolean;
    authorizedPending: boolean;
    chargedPending: boolean;
    cancelledPending: boolean;
  } {
    if (!orderAmounts) {
      return {
        authorized: false,
        charged: false,
        cancelled: false,
        authorizedPending: false,
        chargedPending: false,
        cancelledPending: false,
      };
    }

    const authorized = orderAmounts.totalAuthorized?.amount ?? 0;
    const authorizePending = orderAmounts.totalAuthorizePending?.amount ?? 0;
    const charged = orderAmounts.totalCharged?.amount ?? 0;
    const chargePending = orderAmounts.totalChargePending?.amount ?? 0;
    const cancelled = orderAmounts.totalCanceled?.amount ?? 0;
    const cancelPending = orderAmounts.totalCancelPending?.amount ?? 0;
    const total = orderAmounts.total.gross?.amount ?? 0;
    const anyPending = authorizePending > 0 || chargePending > 0 || cancelPending > 0;

    if (anyPending) {
      return {
        authorized: !!authorized || !!authorizePending,
        charged: true,
        cancelled: true,
        authorizedPending: authorizePending > 0,
        chargedPending: chargePending > 0,
        cancelledPending: cancelPending > 0,
      };
    }

    if (authorized && charged) {
      return {
        authorized: true,
        charged: true,
        cancelled: !!cancelled,
        authorizedPending: false,
        chargedPending: false,
        cancelledPending: false,
      };
    }

    if (charged !== 0 && charged !== total) {
      return {
        authorized: false,
        charged: true,
        cancelled: !!cancelled,
        authorizedPending: false,
        chargedPending: false,
        cancelledPending: false,
      };
    }

    if (authorized !== 0) {
      return {
        authorized: true,
        charged: false,
        cancelled: !!cancelled,
        authorizedPending: false,
        chargedPending: false,
        cancelledPending: false,
      };
    }

    if (cancelled) {
      return {
        authorized: false,
        charged: false,
        cancelled: true,
        authorizedPending: false,
        chargedPending: false,
        cancelledPending: false,
      };
    }

    return {
      charged: false,
      authorized: false,
      cancelled: false,
      authorizedPending: false,
      chargedPending: false,
      cancelledPending: false,
    };
  }
}
