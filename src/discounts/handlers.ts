import { ChannelSaleData, ChannelVoucherData } from "@saleor/channels/utils";
import { SaleDetailsPageFormData } from "@saleor/discounts/components/SaleDetailsPage";
import { VoucherDetailsPageFormData } from "@saleor/discounts/components/VoucherDetailsPage";
import { RequirementsPicker } from "@saleor/discounts/types";
import { RequireOnlyOne } from "@saleor/misc";
import { diff } from "fast-array-diff";
export interface ChannelArgs {
  discountValue: string;
  minSpent: string;
}

export type ChannelInput = RequireOnlyOne<
  ChannelArgs,
  "discountValue" | "minSpent"
>;

export function createChannelsChangeHandler(
  channelListings: ChannelVoucherData[],
  updateChannels: (data: ChannelVoucherData[]) => void,
  triggerChange: () => void
) {
  return (id: string, input: ChannelInput) => {
    const channelIndex = channelListings.findIndex(
      channel => channel.id === id
    );
    const channel = channelListings[channelIndex];
    const { discountValue, minSpent } = input;
    const updatedChannels = [
      ...channelListings.slice(0, channelIndex),
      {
        ...channel,
        ...(minSpent !== undefined
          ? { minSpent }
          : {
              discountValue
            })
      },
      ...channelListings.slice(channelIndex + 1)
    ];
    updateChannels(updatedChannels);
    triggerChange();
  };
}

export function createSaleChannelsChangeHandler(
  channelListings: ChannelSaleData[],
  updateChannels: (data: ChannelSaleData[]) => void,
  triggerChange: () => void
) {
  return (id: string, discountValue: string) => {
    const channelIndex = channelListings.findIndex(
      channel => channel.id === id
    );
    const channel = channelListings[channelIndex];

    const updatedChannels = [
      ...channelListings.slice(0, channelIndex),
      {
        ...channel,
        discountValue
      },
      ...channelListings.slice(channelIndex + 1)
    ];
    updateChannels(updatedChannels);
    triggerChange();
  };
}

export const getChannelsVariables = (
  id: string,
  formData: VoucherDetailsPageFormData,
  prevChannels?: ChannelVoucherData[]
) => {
  const removeChannels = prevChannels
    ? diff(
        prevChannels,
        formData.channelListings,
        (a, b) => a.id === b.id
      ).removed?.map(removedChannel => removedChannel.id)
    : [];

  return {
    id,
    input: {
      addChannels:
        formData.channelListings?.map(channel => ({
          channelId: channel.id,
          discountValue:
            formData.discountType.toString() === "SHIPPING"
              ? 100
              : channel.discountValue,
          minAmountSpent:
            formData.requirementsPicker === RequirementsPicker.NONE
              ? null
              : formData.requirementsPicker === RequirementsPicker.ITEM
              ? 0
              : channel.minSpent
        })) || [],
      removeChannels
    }
  };
};

export const getSaleChannelsVariables = (
  id: string,
  formData: SaleDetailsPageFormData,
  prevChannels?: ChannelSaleData[]
) => {
  const removeChannels = prevChannels
    ? diff(
        prevChannels,
        formData.channelListings,
        (a, b) => a.id === b.id
      ).removed?.map(removedChannel => removedChannel.id)
    : [];

  return {
    id,
    input: {
      addChannels:
        formData.channelListings?.map(channel => ({
          channelId: channel.id,
          discountValue: channel.discountValue
        })) || [],
      removeChannels
    }
  };
};
