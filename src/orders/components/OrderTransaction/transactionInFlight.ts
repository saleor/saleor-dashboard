import {
  type OrderDetailsFragment,
  TransactionActionEnum,
  TransactionEventTypeEnum,
} from "@dashboard/graphql";

const REQUEST_EVENT_TYPES: TransactionEventTypeEnum[] = [
  TransactionEventTypeEnum.CHARGE_REQUEST,
  TransactionEventTypeEnum.REFUND_REQUEST,
  TransactionEventTypeEnum.CANCEL_REQUEST,
];

/** The `*_REQUEST` event an action triggers, for matching against transaction events. */
const ACTION_REQUEST_EVENT: Record<TransactionActionEnum, TransactionEventTypeEnum> = {
  [TransactionActionEnum.CHARGE]: TransactionEventTypeEnum.CHARGE_REQUEST,
  [TransactionActionEnum.REFUND]: TransactionEventTypeEnum.REFUND_REQUEST,
  [TransactionActionEnum.CANCEL]: TransactionEventTypeEnum.CANCEL_REQUEST,
};

const isRequestEvent = (
  type: TransactionEventTypeEnum | null,
  requestTypes: TransactionEventTypeEnum[],
): boolean => !!type && requestTypes.includes(type);

/**
 * Any SUCCESS/FAILURE event resolves the request sharing its pspReference — even
 * across action types. A CHARGE_REQUEST can legitimately be resolved by an
 * AUTHORIZATION_SUCCESS, so we must not look only for a same-action resolution.
 */
const isResolutionEvent = (type: TransactionEventTypeEnum | null): boolean =>
  !!type && (String(type).endsWith("_SUCCESS") || String(type).endsWith("_FAILURE"));

/** Minimal event shape both real (TransactionItemFragment) and order-level events satisfy. */
interface InFlightEvent {
  type: TransactionEventTypeEnum | null;
  pspReference: string | null;
}

/**
 * True when the events contain a request of one of `requestTypes` whose pspReference
 * group has no matching SUCCESS/FAILURE event yet.
 */
const transactionHasUnresolvedRequest = (
  events: readonly InFlightEvent[],
  requestTypes: TransactionEventTypeEnum[] = REQUEST_EVENT_TYPES,
): boolean => {
  const byPspReference = new Map<string, InFlightEvent[]>();

  events.forEach(event => {
    const key = event.pspReference ?? "";
    const group = byPspReference.get(key);

    if (group) {
      group.push(event);
    } else {
      byPspReference.set(key, [event]);
    }
  });

  for (const group of byPspReference.values()) {
    const hasRequest = group.some(event => isRequestEvent(event.type, requestTypes));
    const hasResolution = group.some(event => isResolutionEvent(event.type));

    if (hasRequest && !hasResolution) {
      return true;
    }
  }

  return false;
};

/**
 * An order has an async transaction action in flight when one of its transactions
 * has a charge/refund/cancel REQUEST event not yet resolved by a SUCCESS/FAILURE
 * event sharing its pspReference.
 *
 * We key off events rather than the pending *amount* fields: Saleor Core creates the
 * REQUEST event synchronously but only folds it into the pending amount once the app
 * responds (include_in_calculations), so right after the user triggers an action the
 * pending amount is still 0 — the event is the only signal available immediately.
 *
 * Resolution is matched per pspReference (not by counting event types), because a
 * request can be resolved by a different action's success event, and an order can
 * carry unrelated successes from earlier operations.
 *
 * Authorize requests are excluded: authorization is not an action we trigger here.
 */
export const orderHasInFlightTransactionAction = (
  order: Pick<OrderDetailsFragment, "transactions"> | null | undefined,
): boolean =>
  (order?.transactions ?? []).some(transaction =>
    transactionHasUnresolvedRequest(transaction.events ?? []),
  );

/**
 * True when a specific action (capture/cancel/refund) is in flight on the given
 * transaction — i.e. it has a matching `*_REQUEST` event not yet resolved by a
 * SUCCESS/FAILURE event sharing its pspReference. Used to disable the corresponding
 * action button so the user cannot submit the same action twice while it is pending
 * (Saleor Core does not guard against this server-side).
 */
export const transactionActionInFlight = (
  events: readonly InFlightEvent[] | null | undefined,
  action: TransactionActionEnum,
): boolean => transactionHasUnresolvedRequest(events ?? [], [ACTION_REQUEST_EVENT[action]]);
