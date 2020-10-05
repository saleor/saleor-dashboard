import { ChannelVoucherData } from "@saleor/channels/utils";
import { FormData } from "@saleor/discounts/components/VoucherDetailsPage";
import { RequirementsPicker } from "@saleor/discounts/types";
import { diff } from "fast-array-diff";
export interface ChannelInput {
  discountValue: number;
  minSpent: number;
}

export function createChannelsChangeHandler(
  channelListing: ChannelVoucherData[],
  updateChannels: (data: ChannelVoucherData[]) => void,
  triggerChange: () => void
) {
  return (id: string, input: ChannelInput) => {
    const channelIndex = channelListing.findIndex(channel => channel.id === id);
    const channel = channelListing[channelIndex];

    const updatedChannels = [
      ...channelListing.slice(0, channelIndex),
      {
        ...channel,
        ...input
      },
      ...channelListing.slice(channelIndex + 1)
    ];
    updateChannels(updatedChannels);
    triggerChange();
  };
}

export const getChannelsVariables = (
  id: string,
  formData: FormData,
  prevChannels?: ChannelVoucherData[]
) => {
  const removeChannels = prevChannels
    ? diff(
        prevChannels,
        formData.channelListing,
        (a, b) => a.id === b.id
      ).removed?.map(removedChannel => removedChannel.id)
    : [];

  return {
    id,
    input: {
      addChannels:
        formData.channelListing?.map(channel => ({
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
