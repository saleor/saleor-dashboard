import {
  AppAvatarFragment,
  OrderDetailsFragment,
  OrderGrantedRefundFragment,
  OrderGrantedRefundStatusEnum,
  StaffMemberAvatarFragment,
  TransactionActionEnum,
  TransactionEventFragment,
  TransactionEventTypeEnum,
} from "@dashboard/graphql";

export type OrderRefundDisplay = {
  id: string;
  type: "standard" | "manual";
  status: OrderGrantedRefundStatusEnum;
  amount: {
    amount: number;
    currency: string;
  };
  reason: string | null;
  createdAt: string;
  user: {
    email: string;
    firstName: string;
    lastName: string;
  } | null;
};

export type OrderRefundState =
  | "noTransactionsToRefund"
  | "allTransactionsNonRefundable"
  | "refundable";

export abstract class OrderRefundsViewModel {
  static getRefundState(transactions: OrderDetailsFragment["transactions"]): OrderRefundState {
    if (transactions.length === 0) {
      return "noTransactionsToRefund";
    }

    if (
      transactions.every(transaction => !transaction.actions.includes(TransactionActionEnum.REFUND))
    ) {
      return "allTransactionsNonRefundable";
    }

    return "refundable";
  }

  static canEditRefund(refund: OrderRefundDisplay): boolean {
    const isSuccessful = refund.status === OrderGrantedRefundStatusEnum.SUCCESS;
    const isPending = refund.status === OrderGrantedRefundStatusEnum.PENDING;
    const isManual = refund.type === "manual";

    // Can only edit refunds that are not successful, not pending, and not manual
    return !isSuccessful && !isPending && !isManual;
  }

  private static groupEventsByPspReference = (
    events: TransactionEventFragment[],
  ): Record<string, TransactionEventFragment[]> => {
    return events?.reduce<Record<string, TransactionEventFragment[]>>((acc, event) => {
      if (!acc[event.pspReference]) {
        acc[event.pspReference] = [];
      }

      acc[event.pspReference].push(event);

      return acc;
    }, {});
  };

  private static findLatestEventWithUserAuthor = (
    eventGroup: TransactionEventFragment[],
  ): TransactionEventFragment | null => {
    return eventGroup.find(event => event.createdBy?.__typename === "User") || null;
  };

  private static mapEventToRefundStatus = (
    event: TransactionEventFragment,
  ): OrderGrantedRefundStatusEnum => {
    switch (event.type) {
      case TransactionEventTypeEnum.REFUND_SUCCESS:
        return OrderGrantedRefundStatusEnum.SUCCESS;
      case TransactionEventTypeEnum.REFUND_FAILURE:
        return OrderGrantedRefundStatusEnum.FAILURE;
      case TransactionEventTypeEnum.REFUND_REQUEST:
        return OrderGrantedRefundStatusEnum.PENDING;
      default:
        return OrderGrantedRefundStatusEnum.NONE;
    }
  };

  private static determineCreatorDisplay = (
    creator: AppAvatarFragment | StaffMemberAvatarFragment | null,
  ): OrderRefundDisplay["user"] => {
    if (creator?.__typename === "User") {
      return {
        email: creator.email,
        firstName: creator.firstName,
        lastName: creator.lastName,
      };
    }

    return null;
  };

  private static mapEventGroupsToOrderRefunds = (
    eventsByPspReference: Record<string, TransactionEventFragment[]>,
  ): OrderRefundDisplay[] => {
    return Object.values(eventsByPspReference).map(eventGroup => {
      const sortedEvents = eventGroup.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      const latestEvent = sortedEvents[0];
      const latestEventWithAuthor =
        OrderRefundsViewModel.findLatestEventWithUserAuthor(sortedEvents);

      return {
        id: latestEvent.id,
        type: "manual" as const,
        status: OrderRefundsViewModel.mapEventToRefundStatus(latestEvent),
        amount: latestEvent.amount,
        createdAt: latestEvent.createdAt,
        user: OrderRefundsViewModel.determineCreatorDisplay(
          latestEventWithAuthor?.createdBy || null,
        ),
        reason: null,
      };
    });
  };

  private static convertManualRefundsToOrderRefunds(
    transactionsEvents: TransactionEventFragment[],
    grantedRefunds: OrderGrantedRefundFragment[],
  ): OrderRefundDisplay[] {
    const supportedRefunds = new Set([
      TransactionEventTypeEnum.REFUND_SUCCESS,
      TransactionEventTypeEnum.REFUND_FAILURE,
      TransactionEventTypeEnum.REFUND_REQUEST,
    ]);
    const refundEvents = transactionsEvents.filter(
      event => event.type && supportedRefunds.has(event.type),
    );

    const idsOfEventsAssociatedToGrantedRefunds = new Set(
      grantedRefunds.flatMap(refund => refund.transactionEvents?.map(te => te.id)),
    );

    const manualRefundEvents =
      refundEvents?.filter(event => !idsOfEventsAssociatedToGrantedRefunds.has(event.id)) ?? [];

    const eventsByPspReference =
      OrderRefundsViewModel.groupEventsByPspReference(manualRefundEvents);

    return OrderRefundsViewModel.mapEventGroupsToOrderRefunds(eventsByPspReference);
  }

  private static convertGrantedRefundsToOrderRefunds(
    grantedRefunds: OrderGrantedRefundFragment[],
  ): OrderRefundDisplay[] {
    return grantedRefunds.map(refund => ({ ...refund, type: "standard" }));
  }

  static prepareOrderRefundDisplayList(
    transactionsEvents: TransactionEventFragment[],
    grantedRefunds: OrderGrantedRefundFragment[],
  ): OrderRefundDisplay[] {
    return [
      ...OrderRefundsViewModel.convertGrantedRefundsToOrderRefunds(grantedRefunds),
      ...OrderRefundsViewModel.convertManualRefundsToOrderRefunds(
        transactionsEvents,
        grantedRefunds,
      ),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}
