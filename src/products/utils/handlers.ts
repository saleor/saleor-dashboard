// @ts-strict-ignore
import { type FetchResult } from "@apollo/client";
import {
  type ChannelData,
  type ChannelPriceArgs,
  type VariantChannelPriceData,
} from "@dashboard/channels/utils";
import {
  type ProductChannelListingAddInput,
  type ProductVariantFragment,
  type VariantMediaAssignMutation,
  type VariantMediaAssignMutationVariables,
  type VariantMediaUnassignMutation,
  type VariantMediaUnassignMutationVariables,
} from "@dashboard/graphql";
import { type FormChange, type UseFormResult } from "@dashboard/hooks/useForm";
import { type FormsetData } from "@dashboard/hooks/useFormset";
import { type ProductStockFormsetData } from "@dashboard/products/components/ProductStocks";
import { diff } from "fast-array-diff";

export function createChannelsPriceChangeHandler(
  channelListings: ChannelData[],
  updateChannels: (data: ChannelData[]) => void,
  triggerChange: () => void,
) {
  return (id: string, priceData: ChannelPriceArgs) => {
    const { costPrice, price } = priceData;
    const updatedChannels = channelListings.map(channel =>
      channel.id === id ? { ...channel, costPrice, price } : channel,
    );

    updateChannels(updatedChannels);
    triggerChange();
  };
}

export function createChannelsReplaceHandler(
  channelListings: ChannelData[],
  updateChannels: (data: ChannelData[]) => void,
  triggerChange: () => void,
) {
  return (nextListings: ChannelData[]) => {
    const nextById = new Map(nextListings.map(listing => [listing.id, listing]));
    const updatedChannels = channelListings.map(channel => {
      const updated = nextById.get(channel.id);

      if (!updated) {
        return channel;
      }

      return {
        ...channel,
        costPrice: updated.costPrice,
        price: updated.price,
      };
    });

    updateChannels(updatedChannels);
    triggerChange();
  };
}

export function replaceFormsetChannelListings<
  TValue extends {
    price?: string;
    costPrice?: string;
  },
>(
  formsetRows: FormsetData<VariantChannelPriceData, TValue>,
  listings: ChannelData[],
): FormsetData<VariantChannelPriceData, TValue> {
  const nextById = new Map(listings.map(listing => [listing.id, listing]));

  return formsetRows.map(row => {
    const updated = nextById.get(row.id);

    if (!updated) {
      return row;
    }

    return {
      ...row,
      value: {
        ...row.value,
        price: updated.price ?? "",
        costPrice: updated.costPrice ?? "",
      },
    };
  });
}

export function replaceFormsetStockValues(
  formsetRows: FormsetData<ProductStockFormsetData, string, string>,
  updates: Array<{ id: string; value: string }>,
): FormsetData<ProductStockFormsetData, string, string> {
  const nextById = new Map(updates.map(stock => [stock.id, stock.value]));

  return formsetRows.map(row => {
    const value = nextById.get(row.id);

    if (value === undefined) {
      return row;
    }

    return {
      ...row,
      value,
    };
  });
}

export function createChannelsChangeHandler(
  channelsData: ChannelData[],
  updateChannels: (data: ChannelData[]) => void,
  triggerChange: () => void,
) {
  return (id: string, data: Omit<ChannelData, "name" | "price" | "currency" | "id">) => {
    const channelIndex = channelsData.findIndex(channel => channel.id === id);
    const channel = channelsData[channelIndex];
    const updatedChannels = [
      ...channelsData.slice(0, channelIndex),
      {
        ...channel,
        ...data,
      },
      ...channelsData.slice(channelIndex + 1),
    ];

    updateChannels(updatedChannels);
    triggerChange();
  };
}

export function createProductTypeSelectHandler(
  setProductType: (productTypeId: string) => void,
  triggerChange: () => void,
): FormChange {
  return (event: React.ChangeEvent<any>) => {
    const id = event.target.value;

    setProductType(id);
    triggerChange();
  };
}

export const getChannelsInput = (channels: VariantChannelPriceData[]) =>
  channels?.map(channel => ({
    data: channel,
    id: channel.id,
    label: channel.name,
    value: {
      costPrice: channel.costPrice || "",
      price: channel.price || "",
    },
  }));

export const getAvailabilityVariables = (
  channels: ChannelData[],
): ProductChannelListingAddInput[] =>
  channels.map(channel => {
    const {
      isAvailableForPurchase,
      availableForPurchaseAt,
      isPublished,
      publishedAt,
      visibleInListings,
    } = channel;
    const isAvailable =
      availableForPurchaseAt && !isAvailableForPurchase ? true : isAvailableForPurchase;

    return {
      availableForPurchaseAt:
        isAvailableForPurchase || availableForPurchaseAt === "" ? null : availableForPurchaseAt,
      channelId: channel.id,
      isAvailableForPurchase: isAvailable,
      isPublished,
      publishedAt,
      visibleInListings,
    };
  });

export const areMediaSelectionsEqual = (left: string[] = [], right: string[] = []): boolean => {
  if (left.length !== right.length) {
    return false;
  }

  const rightIds = new Set(right);

  return left.every(id => rightIds.has(id));
};

export const createMediaChangeHandler =
  (form: UseFormResult<{ media: string[] }>, triggerChange: () => void) => (ids: string[]) => {
    if (areMediaSelectionsEqual(form.data.media, ids)) {
      return;
    }

    form.change({
      target: {
        name: "media",
        value: ids,
      },
    });
    triggerChange();
  };

export const handleAssignMedia = async <T extends Pick<ProductVariantFragment, "id" | "media">>(
  media: string[],
  variant: T,
  assignMedia: (
    variables: VariantMediaAssignMutationVariables,
  ) => Promise<FetchResult<VariantMediaAssignMutation>>,
  unassignMedia: (
    variables: VariantMediaUnassignMutationVariables,
  ) => Promise<FetchResult<VariantMediaUnassignMutation>>,
) => {
  const { added, removed } = diff(
    variant.media.map(mediaObj => mediaObj.id),
    media,
  );
  const assignResults = await Promise.all(
    added.map(mediaId =>
      assignMedia({
        mediaId,
        variantId: variant.id,
      }),
    ),
  );
  const unassignResults = await Promise.all(
    removed.map(mediaId =>
      unassignMedia({
        mediaId,
        variantId: variant.id,
      }),
    ),
  );
  const assignErrors = assignResults.reduce(
    (errors, result) => [...errors, ...(result.data?.variantMediaAssign.errors || [])],
    [],
  );
  const unassignErrors = unassignResults.reduce(
    (errors, result) => [...errors, ...(result.data?.variantMediaUnassign.errors || [])],
    [],
  );

  return [...assignErrors, ...unassignErrors];
};
