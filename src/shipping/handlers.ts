import { ChannelShippingData } from "@saleor/channels/utils";
import { ShippingMethodFragment_postalCodeRules } from "@saleor/fragments/types/ShippingMethodFragment";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import { getMutationErrors, getMutationState } from "@saleor/misc";
import { FormData as ShippingZoneRatesPageFormData } from "@saleor/shipping/components/ShippingZoneRatesPage";
import { CreateShippingRateVariables } from "@saleor/shipping/types/CreateShippingRate";
import { ShippingMethodChannelListingUpdateVariables } from "@saleor/shipping/types/ShippingMethodChannelListingUpdate";
import { UpdateShippingRateVariables } from "@saleor/shipping/types/UpdateShippingRate";
import {
  PostalCodeRuleInclusionTypeEnum,
  ShippingMethodTypeEnum,
  ShippingPostalCodeRulesCreateInputRange
} from "@saleor/types/globalTypes";
import { diff } from "fast-array-diff";
import { useIntl } from "react-intl";

import {
  useShippingMethodChannelListingUpdate,
  useShippingRateCreate,
  useShippingRateDelete
} from "./mutations";
import { shippingPriceRatesEditUrl, shippingWeightRatesEditUrl } from "./urls";

export const createChannelsChangeHandler = (
  selectedChannels: ChannelShippingData[],
  setSelectedChannels: (channels: ChannelShippingData[]) => void,
  triggerChange: () => void
) => (
  channelId: string,
  value: { maxValue: string; minValue: string; price: string }
) => {
  const itemIndex = selectedChannels.findIndex(item => item.id === channelId);
  const channel = selectedChannels[itemIndex];
  setSelectedChannels([
    ...selectedChannels.slice(0, itemIndex),
    {
      ...channel,
      maxValue: value.maxValue,
      minValue: value.minValue,
      price: value.price
    },
    ...selectedChannels.slice(itemIndex + 1)
  ]);
  triggerChange();
};

const getPostalCodeRulesToAdd = (
  rules: ShippingMethodFragment_postalCodeRules[]
) =>
  rules
    .filter(code => !code.id || code.id === "0")
    .map(
      code =>
        ({
          end: code.end,
          start: code.start
        } as ShippingPostalCodeRulesCreateInputRange)
    );

export function getCreateShippingPriceRateVariables(
  data: ShippingZoneRatesPageFormData,
  id: string,
  addPostalCodeRules: ShippingMethodFragment_postalCodeRules[],
  inclusionType: PostalCodeRuleInclusionTypeEnum
): CreateShippingRateVariables {
  const parsedMinDays = parseInt(data.minDays, 10);
  const parsedMaxDays = parseInt(data.maxDays, 10);
  const postalCodeRules = getPostalCodeRulesToAdd(addPostalCodeRules);
  return {
    input: {
      addPostalCodeRules: postalCodeRules,
      inclusionType,
      maximumDeliveryDays: parsedMaxDays,
      minimumDeliveryDays: parsedMinDays,
      name: data.name,
      shippingZone: id,
      type: ShippingMethodTypeEnum.PRICE
    }
  };
}

export function getCreateShippingWeightRateVariables(
  data: ShippingZoneRatesPageFormData,
  id: string,
  addPostalCodeRules: ShippingMethodFragment_postalCodeRules[],
  inclusionType: PostalCodeRuleInclusionTypeEnum
): CreateShippingRateVariables {
  const parsedMinValue = parseFloat(data.minValue);
  const parsedMaxValue = parseFloat(data.maxValue);
  const parsedMinDays = parseInt(data.minDays, 10);
  const parsedMaxDays = parseInt(data.maxDays, 10);
  const isWeightSet = !data.noLimits;
  const postalCodeRules = getPostalCodeRulesToAdd(addPostalCodeRules);
  return {
    input: {
      addPostalCodeRules: postalCodeRules,
      inclusionType,
      maximumDeliveryDays: parsedMaxDays,
      maximumOrderWeight: isWeightSet ? parsedMaxValue : null,
      minimumDeliveryDays: parsedMinDays,
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
  rateId: string,
  addPostalCodeRules: ShippingMethodFragment_postalCodeRules[],
  deletePostalCodeRules: string[]
): UpdateShippingRateVariables {
  const parsedMinDays = parseInt(data.minDays, 10);
  const parsedMaxDays = parseInt(data.maxDays, 10);
  const postalCodeRules = getPostalCodeRulesToAdd(addPostalCodeRules);
  return {
    id: rateId,
    input: {
      addPostalCodeRules: postalCodeRules,
      deletePostalCodeRules,
      inclusionType:
        addPostalCodeRules[0]?.inclusionType ||
        PostalCodeRuleInclusionTypeEnum.EXCLUDE,
      maximumDeliveryDays: parsedMaxDays,
      minimumDeliveryDays: parsedMinDays,
      name: data.name,
      shippingZone: id,
      type: ShippingMethodTypeEnum.PRICE
    }
  };
}

export function getUpdateShippingWeightRateVariables(
  data: ShippingZoneRatesPageFormData,
  id: string,
  rateId: string,
  addPostalCodeRules: ShippingMethodFragment_postalCodeRules[],
  deletePostalCodeRules: string[]
): UpdateShippingRateVariables {
  const parsedMinValue = parseFloat(data.minValue);
  const parsedMaxValue = parseFloat(data.maxValue);
  const parsedMinDays = parseInt(data.minDays, 10);
  const parsedMaxDays = parseInt(data.maxDays, 10);
  const isWeightSet = !data.noLimits;
  const postalCodeRules = getPostalCodeRulesToAdd(addPostalCodeRules);
  return {
    id: rateId,
    input: {
      addPostalCodeRules: postalCodeRules,
      deletePostalCodeRules,
      inclusionType:
        addPostalCodeRules[0]?.inclusionType ||
        PostalCodeRuleInclusionTypeEnum.EXCLUDE,
      maximumDeliveryDays: parsedMaxDays,
      maximumOrderWeight: isWeightSet ? parsedMaxValue : null,
      minimumDeliveryDays: parsedMinDays,
      minimumOrderWeight: isWeightSet ? parsedMinValue : null,
      name: data.name,
      shippingZone: id,
      type: ShippingMethodTypeEnum.WEIGHT
    }
  };
}
export function getShippingMethodChannelVariables(
  id: string,
  noLimits: boolean,
  formChannels: ChannelShippingData[],
  prevChannels?: ChannelShippingData[]
): ShippingMethodChannelListingUpdateVariables {
  const removeChannels = prevChannels
    ? diff(prevChannels, formChannels, (a, b) => a.id === b.id).removed?.map(
        removedChannel => removedChannel.id
      )
    : [];

  return {
    id,
    input: {
      addChannels:
        formChannels?.map(channel => ({
          channelId: channel.id,
          maximumOrderPrice:
            channel.maxValue && !noLimits ? channel.maxValue : null,
          minimumOrderPrice:
            channel.minValue && !noLimits ? channel.minValue : null,
          price: channel.price || null
        })) || [],
      removeChannels
    }
  };
}

export function useShippingRateCreator(
  shippingZoneId: string,
  type: ShippingMethodTypeEnum,
  postalCodes: ShippingMethodFragment_postalCodeRules[],
  inclusionType: PostalCodeRuleInclusionTypeEnum
) {
  const intl = useIntl();
  const notify = useNotifier();
  const navigate = useNavigator();
  const [
    createBaseShippingRate,
    createBaseShippingRateOpts
  ] = useShippingRateCreate({});
  const [
    updateShippingMethodChannelListing,
    updateShippingMethodChannelListingOpts
  ] = useShippingMethodChannelListingUpdate({});
  const [deleteShippingRate] = useShippingRateDelete({});

  const getVariables =
    type === ShippingMethodTypeEnum.PRICE
      ? getCreateShippingPriceRateVariables
      : getCreateShippingWeightRateVariables;
  const getUrl =
    type === ShippingMethodTypeEnum.PRICE
      ? shippingPriceRatesEditUrl
      : shippingWeightRatesEditUrl;

  const createShippingRate = async (data: ShippingZoneRatesPageFormData) => {
    const response = await createBaseShippingRate({
      variables: getVariables(data, shippingZoneId, postalCodes, inclusionType)
    });

    const createErrors = response.data.shippingPriceCreate.errors;
    if (createErrors.length === 0) {
      const rateId = response.data.shippingPriceCreate.shippingMethod.id;

      const mutationResults = await Promise.all([
        updateShippingMethodChannelListing({
          variables: getShippingMethodChannelVariables(
            rateId,
            data.noLimits,
            data.channelListings
          )
        })
      ]);

      if (
        mutationResults.find(
          result => getMutationErrors(result.data as any).length > 0
        )
      ) {
        deleteShippingRate({
          variables: {
            id: rateId
          }
        });
      } else {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
        navigate(getUrl(shippingZoneId, rateId));
      }
    }
  };

  const called =
    createBaseShippingRateOpts.called ||
    updateShippingMethodChannelListingOpts.called;
  const loading =
    createBaseShippingRateOpts.loading ||
    updateShippingMethodChannelListingOpts.loading;
  const errors = [
    ...(createBaseShippingRateOpts.data?.shippingPriceCreate.errors || [])
  ];
  const channelErrors =
    updateShippingMethodChannelListingOpts.data
      ?.shippingMethodChannelListingUpdate.errors || [];

  return {
    channelErrors,
    createShippingRate,
    errors,
    status: getMutationState(called, loading, [...errors, ...channelErrors])
  };
}
