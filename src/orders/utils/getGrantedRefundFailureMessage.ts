import { TransactionEventTypeEnum } from "@dashboard/graphql";

type RefundFailureEvent = {
  type?: TransactionEventTypeEnum | null;
  message?: string | null;
  createdAt?: string | null;
};

export const getGrantedRefundFailureMessage = (
  events: RefundFailureEvent[] | null | undefined,
): string | null => {
  const failureEvents =
    events?.filter(
      event => event.type === TransactionEventTypeEnum.REFUND_FAILURE && event.message?.trim(),
    ) ?? [];

  if (failureEvents.length === 0) {
    return null;
  }

  const latestFailure = [...failureEvents].sort(
    (left, right) =>
      new Date(right.createdAt ?? 0).getTime() - new Date(left.createdAt ?? 0).getTime(),
  )[0];

  return latestFailure.message?.trim() ?? null;
};
