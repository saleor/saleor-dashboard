import { type OrderDetailsFragment } from "@dashboard/graphql";
import useFormset, { type FormsetData } from "@dashboard/hooks/useFormset";
import { useEffect, useRef } from "react";

import { type LineItemData } from "./form";
import {
  getItemsFulfilled,
  getItemsWaiting,
  getOrderUnfulfilledLines,
  getParsedLineData,
  getParsedLines,
  type LineItem,
} from "./utils";

const mapWithLabel = (line: LineItem<number>) => ({ ...line, label: line.label ?? "" });

const getMaxReturnQuantity = (
  order: OrderDetailsFragment,
  item: FormsetData<LineItemData, number>[number],
): number => {
  if (!item.data.isFulfillment) {
    const line = order.lines.find(orderLine => orderLine.id === item.data.orderLineId);

    return line?.quantityToFulfill ?? 0;
  }

  const fulfillmentLine = order.fulfillments
    .flatMap(fulfillment => getParsedLines(fulfillment.lines))
    .find(line => line.id === item.id);

  return fulfillmentLine?.quantity ?? 0;
};

const prefillReturnQuantitiesForLine = (
  items: FormsetData<LineItemData, number>,
  order: OrderDetailsFragment,
  lineId: string,
): FormsetData<LineItemData, number> =>
  items.map(item =>
    item.data.orderLineId === lineId ? { ...item, value: getMaxReturnQuantity(order, item) } : item,
  );

export const useFulfillmentFormset = ({
  order,
  formData,
  prefilledOrderLineId,
}: {
  order: OrderDetailsFragment;
  formData: { refundShipmentCosts: boolean; amount: number };
  prefilledOrderLineId?: string;
}) => {
  const fulfiledItemsQuatities = useFormset<LineItemData, number>(
    getItemsFulfilled(order).map(mapWithLabel),
  );
  const waitingItemsQuantities = useFormset<LineItemData, number>(
    getItemsWaiting(order).map(mapWithLabel),
  );
  const unfulfiledItemsQuantites = useFormset<LineItemData, number>(
    getOrderUnfulfilledLines(order)
      .map(getParsedLineData({ initialValue: 0 }))
      .map(mapWithLabel),
  );
  const hasPrefilledLine = useRef(false);

  useEffect(
    function prefillReturnLineFromUrl() {
      if (!prefilledOrderLineId || hasPrefilledLine.current) {
        return;
      }

      const fulfilledItems = prefillReturnQuantitiesForLine(
        fulfiledItemsQuatities.data,
        order,
        prefilledOrderLineId,
      );
      const waitingItems = prefillReturnQuantitiesForLine(
        waitingItemsQuantities.data,
        order,
        prefilledOrderLineId,
      );
      const unfulfilledItems = prefillReturnQuantitiesForLine(
        unfulfiledItemsQuantites.data,
        order,
        prefilledOrderLineId,
      );

      if (
        fulfilledItems.some(item => item.value > 0) ||
        waitingItems.some(item => item.value > 0) ||
        unfulfilledItems.some(item => item.value > 0)
      ) {
        fulfiledItemsQuatities.set(fulfilledItems);
        waitingItemsQuantities.set(waitingItems);
        unfulfiledItemsQuantites.set(unfulfilledItems);
        hasPrefilledLine.current = true;
      }
    },
    [
      prefilledOrderLineId,
      order,
      fulfiledItemsQuatities,
      waitingItemsQuantities,
      unfulfiledItemsQuantites,
    ],
  );

  const hasAnyItemsSelected =
    fulfiledItemsQuatities.data.some(({ value }) => !!value) ||
    waitingItemsQuantities.data.some(({ value }) => !!value) ||
    unfulfiledItemsQuantites.data.some(({ value }) => !!value);
  const disabled = !hasAnyItemsSelected && !formData.refundShipmentCosts && !formData.amount;

  return {
    fulfiledItemsQuatities,
    waitingItemsQuantities,
    unfulfiledItemsQuantites,
    disabled,
  };
};
