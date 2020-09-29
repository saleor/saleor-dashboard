import { ChannelShippingData } from "@saleor/channels/utils";
import { FormData as ShippingZoneRatesPageFormData } from "@saleor/shipping/components/ShippingZoneRatesPage";
import { CreateShippingRateVariables } from "@saleor/shipping/types/CreateShippingRate";
import { ShippingMethodChannelListingUpdateVariables } from "@saleor/shipping/types/ShippingMethodChannelListingUpdate";
import { UpdateShippingRateVariables } from "@saleor/shipping/types/UpdateShippingRate";
import { ShippingMethodTypeEnum } from "@saleor/types/globalTypes";
import { diff } from "fast-array-diff";

export const createChannelsChangeHandler = (
  data: ShippingZoneRatesPageFormData,
  updateChannels: (data: ShippingZoneRatesPageFormData) => void,
  triggerChange: () => void
) => (
  channelId: string,
  value: { maxValue: string; minValue: string; price: string }
) => {
  const { channelListing } = data;
  const itemIndex = channelListing.findIndex(item => item.id === channelId);
  const channel = channelListing[itemIndex];
  updateChannels({
    ...data,
    channelListing: [
      ...channelListing.slice(0, itemIndex),
      {
        ...channel,
        maxValue: value.maxValue,
        minValue: value.minValue,
        price: value.price
      },
      ...channelListing.slice(itemIndex + 1)
    ]
  });
  triggerChange();
};

export function getCreateShippingPriceRateVariables(
  data: ShippingZoneRatesPageFormData,
  id: string
): CreateShippingRateVariables {
  return {
    input: {
      name: data.name,
      shippingZone: id,
      type: ShippingMethodTypeEnum.PRICE
    }
  };
}

export function getCreateShippingWeightRateVariables(
  data: ShippingZoneRatesPageFormData,
  id: string
): CreateShippingRateVariables {
  const parsedMinValue = parseFloat(data.minValue);
  const parsedMaxValue = parseFloat(data.maxValue);
  const isWeightSet = !data.noLimits;
  return {
    input: {
      maximumOrderWeight: isWeightSet ? parsedMaxValue : null,
      minimumOrderWeight: isWeightSet ? parsedMinValue : null,
      name: data.name,
      shippingZone: id,
      type: ShippingMethodTypeEnum.WEIGHT
    }
  };
}

export function getUpdateShippingPriceRateVariables(
  data: ShippingZoneRatesPageFormData,
  id: string,
  rateId: string
): UpdateShippingRateVariables {
  return {
    id: rateId,
    input: {
      name: data.name,
      shippingZone: id,
      type: ShippingMethodTypeEnum.PRICE
    }
  };
}

export function getUpdateShippingWeightRateVariables(
  data: ShippingZoneRatesPageFormData,
  id: string,
  rateId: string
): UpdateShippingRateVariables {
  const parsedMinValue = parseFloat(data.minValue);
  const parsedMaxValue = parseFloat(data.maxValue);
  const isWeightSet = !data.noLimits;
  return {
    id: rateId,
    input: {
      maximumOrderWeight: isWeightSet ? parsedMaxValue : null,
      minimumOrderWeight: isWeightSet ? parsedMinValue : null,
      name: data.name,
      shippingZone: id,
      type: ShippingMethodTypeEnum.WEIGHT
    }
  };
}
export function getShippingMethodChannelVariables(
  id: string,
  shippingChannels?: ChannelShippingData[],
  formChannels?: ChannelShippingData[]
): ShippingMethodChannelListingUpdateVariables {
  const diffChannels = diff(
    shippingChannels,
    formChannels,
    (a, b) => a.id === b.id
  );

  return {
    id,
    input: {
      addChannels:
        formChannels?.map(channel => ({
          channelId: channel.id,
          maximumOrderPrice: channel.maxValue || null,
          minimumOrderPrice: channel.minValue || null,
          price: channel.price || null
        })) || [],
      removeChannels: diffChannels.removed
        ? diffChannels.removed.map(removedChannel => removedChannel.id)
        : []
    }
  };
}
