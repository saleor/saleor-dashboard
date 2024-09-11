import { OrderDetailsFragment } from "@dashboard/graphql";
import useFormset from "@dashboard/hooks/useFormset";

import { LineItemData } from "./form";
import {
  getItemsFulfilled,
  getItemsWaiting,
  getOrderUnfulfilledLines,
  getParsedLineData,
  LineItem,
} from "./utils";

const mapWithLabel = (line: LineItem<number>) => ({ ...line, label: line.label ?? "" });

export const useFulfillmentFormset = ({
  order,
  formData,
}: {
  order: OrderDetailsFragment;
  formData: { refundShipmentCosts: boolean; amount: number };
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
