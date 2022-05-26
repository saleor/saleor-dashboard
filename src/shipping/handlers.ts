import { ChannelShippingData } from "@saleor/channels/utils";
import {
  CountryFragment,
  CreateShippingRateMutationVariables,
  PostalCodeRuleInclusionTypeEnum,
  ShippingMethodChannelListingUpdateMutationVariables,
  ShippingMethodTypeEnum,
  ShippingMethodTypeFragment,
  ShippingPostalCodeRulesCreateInputRange,
  UpdateShippingRateMutationVariables,
  useCreateShippingRateMutation,
  useDeleteShippingRateMutation,
  useShippingMethodChannelListingUpdateMutation,
} from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import { extractMutationErrors, getMutationState } from "@saleor/misc";
import { getParsedDataForJsonStringField } from "@saleor/utils/richText/misc";
import differenceBy from "lodash/differenceBy";
import { useIntl } from "react-intl";

import { ShippingZoneRateCommonFormData } from "./components/ShippingZoneRatesPage/types";
import { shippingRateEditUrl } from "./urls";

export const createChannelsChangeHandler = (
  selectedChannels: ChannelShippingData[],
  setSelectedChannels: (channels: ChannelShippingData[]) => void,
  triggerChange: () => void,
) => (
  channelId: string,
  value: { maxValue: string; minValue: string; price: string },
) => {
  const itemIndex = selectedChannels.findIndex(item => item.id === channelId);
  const channel = selectedChannels[itemIndex];
  setSelectedChannels([
    ...selectedChannels.slice(0, itemIndex),
    {
      ...channel,
      maxValue: value.maxValue,
      minValue: value.minValue,
      price: value.price,
    },
    ...selectedChannels.slice(itemIndex + 1),
  ]);
  triggerChange();
};

const getPostalCodeRulesToAdd = (
  rules: ShippingMethodTypeFragment["postalCodeRules"],
) =>
  rules
    .filter(code => !code.id || code.id === "0")
    .map(
      code =>
        ({
          end: code.end,
          start: code.start,
        } as ShippingPostalCodeRulesCreateInputRange),
    );

export function getCreateShippingPriceRateVariables(
  data: ShippingZoneRateCommonFormData,
  id: string,
  addPostalCodeRules: ShippingMethodTypeFragment["postalCodeRules"],
  inclusionType: PostalCodeRuleInclusionTypeEnum,
): CreateShippingRateMutationVariables {
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
      type: ShippingMethodTypeEnum.PRICE,
      description: getParsedDataForJsonStringField(data.description),
    },
  };
}

export function getCreateShippingWeightRateVariables(
  data: ShippingZoneRateCommonFormData,
  id: string,
  addPostalCodeRules: ShippingMethodTypeFragment["postalCodeRules"],
  inclusionType: PostalCodeRuleInclusionTypeEnum,
): CreateShippingRateMutationVariables {
  const parsedMinValue = parseFloat(data.minValue);
  const parsedMaxValue = parseFloat(data.maxValue);
  const parsedMinDays = parseInt(data.minDays, 10);
  const parsedMaxDays = parseInt(data.maxDays, 10);
  const isWeightSet = data.orderValueRestricted;
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
      type: ShippingMethodTypeEnum.WEIGHT,
      description: getParsedDataForJsonStringField(data.description),
    },
  };
}

export function getUpdateShippingPriceRateVariables(
  data: ShippingZoneRateCommonFormData,
  id: string,
  rateId: string,
  addPostalCodeRules: ShippingMethodTypeFragment["postalCodeRules"],
  deletePostalCodeRules: string[],
): UpdateShippingRateMutationVariables {
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
      type: ShippingMethodTypeEnum.PRICE,
      description: getParsedDataForJsonStringField(data.description),
    },
  };
}

export function getUpdateShippingWeightRateVariables(
  data: ShippingZoneRateCommonFormData,
  id: string,
  rateId: string,
  addPostalCodeRules: ShippingMethodTypeFragment["postalCodeRules"],
  deletePostalCodeRules: string[],
): UpdateShippingRateMutationVariables {
  const parsedMinValue = parseFloat(data.minValue);
  const parsedMaxValue = parseFloat(data.maxValue);
  const parsedMinDays = parseInt(data.minDays, 10);
  const parsedMaxDays = parseInt(data.maxDays, 10);
  const isWeightSet = data.orderValueRestricted;
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
      type: ShippingMethodTypeEnum.WEIGHT,
      description: getParsedDataForJsonStringField(data.description),
    },
  };
}
export function getShippingMethodChannelVariables(
  id: string,
  orderValueRestricted: boolean,
  formChannels: ChannelShippingData[],
  prevChannels?: ChannelShippingData[],
): ShippingMethodChannelListingUpdateMutationVariables {
  const removeChannels = prevChannels
    ? differenceBy(prevChannels, formChannels, "id").map(({ id }) => id)
    : [];

  return {
    id,
    input: {
      addChannels:
        formChannels?.map(channel => ({
          channelId: channel.id,
          maximumOrderPrice:
            channel.maxValue && orderValueRestricted ? channel.maxValue : null,
          minimumOrderPrice:
            channel.minValue && orderValueRestricted ? channel.minValue : null,
          price: channel.price || null,
        })) || [],
      removeChannels,
    },
  };
}

export function useShippingRateCreator(
  shippingZoneId: string,
  type: ShippingMethodTypeEnum,
  postalCodes: ShippingMethodTypeFragment["postalCodeRules"],
  inclusionType: PostalCodeRuleInclusionTypeEnum,
) {
  const intl = useIntl();
  const notify = useNotifier();
  const navigate = useNavigator();
  const [
    createBaseShippingRate,
    createBaseShippingRateOpts,
  ] = useCreateShippingRateMutation({});
  const [
    updateShippingMethodChannelListing,
    updateShippingMethodChannelListingOpts,
  ] = useShippingMethodChannelListingUpdateMutation({});
  const [deleteShippingRate] = useDeleteShippingRateMutation({});

  const getVariables =
    type === ShippingMethodTypeEnum.PRICE
      ? getCreateShippingPriceRateVariables
      : getCreateShippingWeightRateVariables;

  const createShippingRate = async (data: ShippingZoneRateCommonFormData) => {
    const response = await createBaseShippingRate({
      variables: getVariables(data, shippingZoneId, postalCodes, inclusionType),
    });

    const createErrors = response.data.shippingPriceCreate.errors;

    if (createErrors.length > 0) {
      return createErrors;
    }

    const rateId = response.data.shippingPriceCreate.shippingMethod.id;

    const errors = await extractMutationErrors(
      updateShippingMethodChannelListing({
        variables: getShippingMethodChannelVariables(
          rateId,
          data.orderValueRestricted,
          data.channelListings,
        ),
      }),
    );

    if (errors.length > 0) {
      deleteShippingRate({
        variables: {
          id: rateId,
        },
      });

      notify({
        status: "error",
        text: intl.formatMessage(commonMessages.somethingWentWrong),
      });

      return errors;
    } else {
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges),
      });
      navigate(shippingRateEditUrl(shippingZoneId, rateId));
      return [];
    }
  };

  const called =
    createBaseShippingRateOpts.called ||
    updateShippingMethodChannelListingOpts.called;
  const loading =
    createBaseShippingRateOpts.loading ||
    updateShippingMethodChannelListingOpts.loading;
  const errors = [
    ...(createBaseShippingRateOpts.data?.shippingPriceCreate.errors || []),
  ];
  const channelErrors =
    updateShippingMethodChannelListingOpts.data
      ?.shippingMethodChannelListingUpdate.errors || [];

  return {
    channelErrors,
    createShippingRate,
    errors,
    status: getMutationState(called, loading, [...errors, ...channelErrors]),
  };
}

export function getCountrySelectionMap(
  countries?: CountryFragment[],
  countriesSelected?: string[],
) {
  return (
    countriesSelected &&
    countries?.reduce((acc, country) => {
      acc[country.code] = !!countriesSelected.find(
        selectedCountries => selectedCountries === country.code,
      );
      return acc;
    }, {} as Map<string, boolean>)
  );
}

export function isRestWorldCountriesSelected(
  restWorldCountries?: string[],
  countrySelectionMap?: Map<string, boolean>,
) {
  return (
    countrySelectionMap &&
    restWorldCountries?.every(countryCode => countrySelectionMap[countryCode])
  );
}
