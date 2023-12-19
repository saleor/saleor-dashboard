// @ts-strict-ignore
import { getCurrencyDecimalPoints } from "@dashboard/components/PriceField/utils";
import {
  FulfillmentStatus,
  OrderDetailsFragment,
  TransactionActionEnum,
} from "@dashboard/graphql";
import { getById } from "@dashboard/misc";
import { Node } from "@dashboard/types";
import { MessageDescriptor } from "react-intl";

import { PaymentSubmitCardValuesProps } from "./components/PaymentSubmitCard/PaymentSubmitCardValues";
import { submitCardMessages } from "./components/TransactionSubmitCard/messages";
import {
  FormsetQuantityData,
  FormsetReplacementData,
  LineItemOptions,
} from "./form";

type OrderLine = OrderDetailsFragment["lines"][0];
type FulfillmentLine = OrderDetailsFragment["fulfillments"][0]["lines"][0];
type ParsedFulfillmentLine = OrderLine & { orderLineId: string };

const fulfiledStatuses = [
  FulfillmentStatus.FULFILLED,
  FulfillmentStatus.REFUNDED,
];

export const getOrderUnfulfilledLines = (order: OrderDetailsFragment) =>
  order?.lines.filter(line => line.quantityToFulfill > 0) || [];

export const getFulfilledFulfillment = (
  fulfillment: OrderDetailsFragment["fulfillments"][0],
) => fulfiledStatuses.includes(fulfillment.status);

export const getFulfilledFulfillemnts = (order?: OrderDetailsFragment) =>
  order?.fulfillments.filter(getFulfilledFulfillment) || [];

export const getWaitingFulfillments = (order: OrderDetailsFragment) =>
  order?.fulfillments.filter(
    f => f.status === FulfillmentStatus.WAITING_FOR_APPROVAL,
  ) || [];

export const getUnfulfilledLines = (order?: OrderDetailsFragment) =>
  order?.lines.filter(line => line.quantityToFulfill > 0) || [];

export const getAllOrderFulfilledLines = (order?: OrderDetailsFragment) =>
  getFulfilledFulfillemnts(order).reduce(
    (result, { lines }) => [...result, ...getParsedLines(lines)],
    [],
  );

export const getAllOrderWaitingLines = (order?: OrderDetailsFragment) =>
  getWaitingFulfillments(order).reduce(
    (result, { lines }) => [...result, ...getParsedLines(lines)],
    [],
  );

export function getLineItem<T>(
  line: FulfillmentLine | ParsedFulfillmentLine | OrderLine,
  {
    initialValue,
    isFulfillment = false,
    isRefunded = false,
  }: LineItemOptions<T>,
) {
  return {
    data: {
      isFulfillment,
      isRefunded,
      orderLineId: "orderLineId" in line ? line.orderLineId : line.id,
    },
    id: line.id,
    label: null,
    value: initialValue,
  };
}

export function getParsedLineData<T>({
  initialValue,
  isFulfillment = false,
  isRefunded = false,
}: LineItemOptions<T>) {
  return (item: ParsedFulfillmentLine | OrderLine) =>
    getLineItem(item, { initialValue, isFulfillment, isRefunded });
}

export function getParsedLineDataForFulfillmentStatus<T>(
  order: OrderDetailsFragment,
  fulfillmentStatus: FulfillmentStatus,
  lineItemOptions: LineItemOptions<T>,
) {
  return getParsedLinesOfFulfillments(
    getFulfillmentsWithStatus(order, fulfillmentStatus),
  ).map(getParsedLineData(lineItemOptions));
}

export const getFulfillmentsWithStatus = (
  order: OrderDetailsFragment,
  fulfillmentStatus: FulfillmentStatus,
) =>
  order?.fulfillments.filter(({ status }) => status === fulfillmentStatus) ||
  [];

export const getParsedLinesOfFulfillments = (
  fullfillments: OrderDetailsFragment["fulfillments"],
): ParsedFulfillmentLine[] =>
  fullfillments.reduce(
    (result, { lines }) => [...result, ...getParsedLines(lines)],
    [],
  );

export const getParsedLines = (
  lines: OrderDetailsFragment["fulfillments"][0]["lines"],
): ParsedFulfillmentLine[] =>
  lines.map(({ id, quantity, orderLine }) => ({
    ...orderLine,
    id,
    orderLineId: orderLine.id,
    quantity,
  }));

const isIncludedInIds = function <T extends Node>(
  arrayToCompare: string[] | T[],
  obj: Node,
) {
  const isSimpleIdsArray = (arrayToCompare as string[]).every(
    value => typeof value === "string",
  );

  const idsToCompare = isSimpleIdsArray
    ? (arrayToCompare as string[])
    : ((arrayToCompare as T[]).map(({ id }) => id) as string[]);

  return idsToCompare.includes(obj.id);
};

export function getByIds<T extends Node>(arrayToCompare: string[] | T[]) {
  return (obj: Node) => isIncludedInIds(arrayToCompare, obj);
}

export function getByUnmatchingIds<T extends Node>(
  arrayToCompare: string[] | T[],
) {
  return (obj: Node) => !isIncludedInIds(arrayToCompare, obj);
}

export function getByType<TType, TObject extends { type: TType }>(
  typeToCompare: TType,
) {
  return (obj: TObject) => obj.type === typeToCompare;
}

export function getQuantityDataFromItems(
  itemsQuantities: FormsetQuantityData,
  id: string,
) {
  const quantityData = itemsQuantities.find(getById(id));

  if (!quantityData) {
    return {
      isRefunded: false,
      currentQuantity: 0,
    };
  }

  return {
    isRefunded: quantityData.data.isRefunded,
    currentQuantity: quantityData.value,
  };
}

export function getReplacementDataFromItems(
  itemsSelections: FormsetReplacementData,
  id: string,
) {
  const replacementData = itemsSelections.find(getById(id));

  if (!replacementData) {
    return {
      isSelected: false,
    };
  }

  return {
    isSelected: replacementData.value,
  };
}

export type CanSendRefund =
  | { value: false; reason: MessageDescriptor }
  | { value: true; reason: null };

export const canSendRefundDuringReturn = ({
  autoGrantRefund,
  transactions,
}: {
  autoGrantRefund: boolean | undefined;
  transactions: OrderDetailsFragment["transactions"];
}): CanSendRefund => {
  if (!autoGrantRefund) {
    return {
      value: false,
      reason: submitCardMessages.cantSendRefundGrantFirst,
    };
  }
  if (transactions.length === 0) {
    return {
      value: false,
      reason: submitCardMessages.cantSendRefundNoTransactions,
    };
  }
  if (transactions.length > 1) {
    return {
      value: false,
      reason: submitCardMessages.cantSendRefundMultipleTransactions,
    };
  }
  if (!transactions[0].actions.includes(TransactionActionEnum.REFUND)) {
    return {
      value: false,
      reason: submitCardMessages.cantSendRefundNonRefundable,
    };
  }
  return {
    value: true,
    reason: null,
  };
};

export const getReturnRefundValue = ({
  autoGrantRefund,
  isAmountDirty,
  customRefundValue,
  amountData,
}: {
  autoGrantRefund: boolean | undefined;
  isAmountDirty: boolean;
  customRefundValue: number | undefined;
  amountData: PaymentSubmitCardValuesProps | undefined;
}) => {
  if (!autoGrantRefund) {
    return "";
  }
  if (isAmountDirty) {
    return customRefundValue?.toString() ?? "";
  }
  return (
    amountData?.refundTotalAmount.amount
      .toFixed(
        getCurrencyDecimalPoints(amountData?.refundTotalAmount?.currency) ?? 2,
      )
      .toString() ?? ""
  );
};
