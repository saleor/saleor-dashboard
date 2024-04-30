// @ts-strict-ignore
import { MetadataIdSchema } from "@dashboard/components/Metadata";
import { OrderDetailsFragment } from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { mapMetadataItemToInput } from "@dashboard/utils/maps";

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

export interface ConditionalItem {
  shouldExist: boolean;
  item: any;
}

export const filteredConditionalItems = (items: ConditionalItem[]) =>
  items.filter(({ shouldExist }) => shouldExist).map(({ item }) => item);

export const createOrderMetadataIdSchema = (order: OrderDetailsFragment): MetadataIdSchema => ({
  [order?.id]: {
    metadata: order?.metadata.map(mapMetadataItemToInput),
    privateMetadata: order?.privateMetadata.map(mapMetadataItemToInput),
  },
  ...order?.fulfillments.reduce((p, c) => {
    p[c.id] = {
      metadata: c?.metadata.map(mapMetadataItemToInput),
      privateMetadata: c?.privateMetadata.map(mapMetadataItemToInput),
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
