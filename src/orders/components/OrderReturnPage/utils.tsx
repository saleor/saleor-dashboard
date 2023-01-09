import { FulfillmentStatus, OrderDetailsFragment } from "@saleor/graphql";
import { getById } from "@saleor/misc";
import { Node } from "@saleor/types";

import {
  FormsetQuantityData,
  FormsetReplacementData,
  LineItemOptions,
} from "./form";

const fulfiledStatuses = [
  FulfillmentStatus.FULFILLED,
  FulfillmentStatus.REFUNDED,
];

export const getOrderUnfulfilledLines = (order: OrderDetailsFragment) =>
  order?.lines.filter(line => line.quantityToFulfill > 0) || [];

export const getFulfilledFulfillment = fulfillment =>
  fulfiledStatuses.includes(fulfillment.status);

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
  { id }: Node,
  {
    initialValue,
    isFulfillment = false,
    isRefunded = false,
  }: LineItemOptions<T>,
) {
  return {
    data: { isFulfillment, isRefunded },
    id,
    label: null,
    value: initialValue,
  };
}

export function getParsedLineData<T>({
  initialValue,
  isFulfillment = false,
  isRefunded = false,
}: LineItemOptions<T>) {
  return (item: Node) =>
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
) =>
  fullfillments.reduce(
    (result, { lines }) => [...result, ...getParsedLines(lines)],
    [],
  );

export const getParsedLines = (
  lines: OrderDetailsFragment["fulfillments"][0]["lines"],
) =>
  lines.map(({ id, quantity, orderLine }) => ({
    ...orderLine,
    id,
    quantity,
  }));

const isIncludedInIds = function<T extends Node>(
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
