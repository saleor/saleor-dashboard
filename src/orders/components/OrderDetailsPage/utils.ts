// @ts-strict-ignore
import { type MetadataIdSchema } from "@dashboard/components/Metadata";
import { type OrderDetailsFragment } from "@dashboard/graphql";
import { type ChangeEvent } from "@dashboard/hooks/useForm";

import {
  getFulfilledFulfillemnts,
  getUnfulfilledLines,
  getWaitingFulfillments,
} from "../OrderReturnPage/utils";

export const hasAnyItemsReplaceable = (order?: OrderDetailsFragment) => {
  if (!order) {
    return false;
  }

  const hasAnyUnfulfilledItems = getUnfulfilledLines(order).length > 0;
  const hasAnyWaitingLines = getWaitingFulfillments(order).length > 0;
  const hasAnyFulfilmentsToReturn = getFulfilledFulfillemnts(order).length > 0;

  return hasAnyUnfulfilledItems || hasAnyFulfilmentsToReturn || hasAnyWaitingLines;
};

// Order and fulfillment metadata are no longer fetched eagerly with order details
// (they are loaded on demand by their dedicated dialogs). The page-level confirm form
// keeps the id-keyed schema shape, but with empty metadata since it is not edited inline.
export const createOrderMetadataIdSchema = (order: OrderDetailsFragment): MetadataIdSchema => ({
  [order?.id]: {
    metadata: [],
    privateMetadata: [],
  },
  ...order?.fulfillments.reduce((p, c) => {
    p[c.id] = {
      metadata: [],
      privateMetadata: [],
    };

    return p;
  }, {}),
});

export const createMetadataHandler =
  (
    currentData: MetadataIdSchema,
    set: (newData: Partial<MetadataIdSchema>) => void,
    triggerChange: () => void,
  ) =>
  (event: ChangeEvent, objectId: string) => {
    const metadataType = event.target.name;

    set({
      [objectId]: {
        ...currentData[objectId],
        [metadataType]: [...event.target.value],
      },
    });
    triggerChange();
  };
