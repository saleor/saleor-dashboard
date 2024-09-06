import { OrderDetailsFragment } from "@dashboard/graphql";
import useFormset from "@dashboard/hooks/useFormset";

import { LineItemData } from "./form";
import {
  getItemsFulfilled,
  getItemsWaiting,
  getOrderUnfulfilledLines,
  getParsedLineData,
} from "./utils";

export const useFulfillmentFormset = ({
  order,
  formData,
}: {
  order: OrderDetailsFragment;
  formData: { refundShipmentCosts: boolean; amount: number };
}) => {
  const fulfiledItemsQuatities = useFormset<LineItemData, number>(getItemsFulfilled(order));
  const waitingItemsQuantities = useFormset<LineItemData, number>(getItemsWaiting(order));
  const unfulfiledItemsQuantites = useFormset<LineItemData, number>(
    getOrderUnfulfilledLines(order).map(getParsedLineData({ initialValue: 0 })),
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
