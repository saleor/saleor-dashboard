// @ts-strict-ignore
import { FetchResult } from "@apollo/client";
import {
  ChannelData,
  ChannelPriceAndPreorderData,
  ChannelPriceArgs,
} from "@dashboard/channels/utils";
import {
  ProductChannelListingAddInput,
  ProductVariantFragment,
  VariantMediaAssignMutation,
  VariantMediaAssignMutationVariables,
  VariantMediaUnassignMutation,
  VariantMediaUnassignMutationVariables,
} from "@dashboard/graphql";
import { FormChange, UseFormResult } from "@dashboard/hooks/useForm";
import { diff } from "fast-array-diff";
import moment from "moment";

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

export const getChannelsInput = (channels: ChannelPriceAndPreorderData[]) =>
  channels?.map(channel => ({
    data: channel,
    id: channel.id,
    label: channel.name,
    value: {
      costPrice: channel.costPrice || "",
      price: channel.price || "",
      preorderThreshold: channel.preorderThreshold || null,
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

export const createPreorderEndDateChangeHandler =
  (
    form: UseFormResult<{ preorderEndDateTime?: string }>,
    triggerChange: () => void,
    preorderPastDateErrorMessage: string,
  ): FormChange =>
  event => {
    form.change(event);

    if (moment(event.target.value).isSameOrBefore(Date.now())) {
      form.setError("preorderEndDateTime", preorderPastDateErrorMessage);
    } else {
      form.clearErrors("preorderEndDateTime");
    }

    triggerChange();
  };

export const createMediaChangeHandler =
  (form: UseFormResult<{ media: string[] }>, triggerChange: () => void) => (ids: string[]) => {
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
