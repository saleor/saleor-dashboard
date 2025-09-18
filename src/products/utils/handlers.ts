// @ts-strict-ignore
import { FetchResult } from "@apollo/client";
import {
  ChannelData,
  ChannelPriceAndPreorderData,
  ChannelPriceArgs,
  ChannelPriceData,
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

/**
 * 创建一个用于更改渠道价格的处理程序。
 *
 * @param {ChannelData[]} channelListings - 渠道列表。
 * @param {(data: ChannelData[]) => void} updateChannels - 用于更新渠道的函数。
 * @param {() => void} triggerChange - 用于触发更改的函数。
 * @returns {(id: string, priceData: ChannelPriceArgs) => void} 一个处理函数。
 */
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

/**
 * 创建一个用于更改渠道数据的处理程序。
 *
 * @param {ChannelData[]} channelsData - 渠道数据列表。
 * @param {(data: ChannelData[]) => void} updateChannels - 用于更新渠道的函数。
 * @param {() => void} triggerChange - 用于触发更改的函数。
 * @returns {(id: string, data: Omit<ChannelData, "name" | "price" | "currency" | "id">) => void} 一个处理函数。
 */
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

/**
 * 创建一个用于更改变体渠道价格的处理程序。
 *
 * @param {ChannelPriceData[]} channelListings - 变体渠道列表。
 * @param {(data: ChannelPriceData[]) => void} setData - 用于设置数据的函数。
 * @param {() => void} triggerChange - 用于触发更改的函数。
 * @returns {(id: string, priceData: ChannelPriceArgs) => void} 一个处理函数。
 */
export function createVariantChannelsChangeHandler(
  channelListings: ChannelPriceData[],
  setData: (data: ChannelPriceData[]) => void,
  triggerChange: () => void,
) {
  return (id: string, priceData: ChannelPriceArgs) => {
    const { costPrice, price } = priceData;
    const channelIndex = channelListings.findIndex(channel => channel.id === id);
    const channel = channelListings[channelIndex];
    const updatedChannels = [
      ...channelListings.slice(0, channelIndex),
      {
        ...channel,
        costPrice,
        price,
      },
      ...channelListings.slice(channelIndex + 1),
    ];

    setData(updatedChannels);
    triggerChange();
  };
}

/**
 * 创建一个用于选择产品类型的处理程序。
 *
 * @param {(productTypeId: string) => void} setProductType - 用于设置产品类型的函数。
 * @param {() => void} triggerChange - 用于触发更改的函数。
 * @returns {FormChange} 一个处理函数。
 */
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

/**
 * 从渠道价格和预购数据列表中获取渠道输入。
 *
 * @param {ChannelPriceAndPreorderData[]} channels - 渠道价格和预购数据列表。
 * @returns {{data: ChannelPriceAndPreorderData; id: string; label: string; value: {costPrice: string; price: string; preorderThreshold: number | null;};}[]} 渠道输入。
 */
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

/**
 * 从渠道数据列表中获取可用性变量。
 *
 * @param {ChannelData[]} channels - 渠道数据列表。
 * @returns {ProductChannelListingAddInput[]} 可用性变量。
 */
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

/**
 * 创建一个用于更改预购结束日期的处理程序。
 *
 * @param {UseFormResult<{ preorderEndDateTime?: string }>} form - 表单结果。
 * @param {() => void} triggerChange - 用于触发更改的函数。
 * @param {string} preorderPastDateErrorMessage - 过去预购日期的错误消息。
 * @returns {FormChange} 一个处理函数。
 */
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

/**
 * 创建一个用于更改媒体的处理程序。
 *
 * @param {UseFormResult<{ media: string[] }>} form - 表单结果。
 * @param {() => void} triggerChange - 用于触发更改的函数。
 * @returns {(ids: string[]) => void} 一个处理函数。
 */
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

/**
 * 处理将媒体分配和取消分配给变体的操作。
 *
 * @template T
 * @param {string[]} media - 要分配的媒体 ID 列表。
 * @param {T} variant - 要将媒体分配给的变体。
 * @param {(variables: VariantMediaAssignMutationVariables) => Promise<FetchResult<VariantMediaAssignMutation>>} assignMedia - 用于分配媒体的函数。
 * @param {(variables: VariantMediaUnassignMutationVariables) => Promise<FetchResult<VariantMediaUnassignMutation>>} unassignMedia - 用于取消分配媒体的函数。
 * @returns {Promise<any[]>} 在此过程中发生的错误列表。
 */
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
