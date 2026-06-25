// @ts-strict-ignore
import { type ChannelShippingData } from "@dashboard/channels/utils";
import {
  type CountryFragment,
  type CreateShippingRateMutationVariables,
  PostalCodeRuleInclusionTypeEnum,
  type ShippingMethodChannelListingUpdateMutationVariables,
  ShippingMethodTypeEnum,
  type ShippingMethodTypeFragment,
  type ShippingPostalCodeRulesCreateInputRange,
  type UpdateShippingRateMutationVariables,
  useCreateShippingRateMutation,
  useDeleteShippingRateMutation,
  useShippingMethodChannelListingUpdateMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import { extractMutationErrors, getMutationState } from "@dashboard/misc";
import { getParsedDataForJsonStringField } from "@dashboard/utils/richText/misc";
import differenceBy from "lodash/differenceBy";
import { useIntl } from "react-intl";

import { type ShippingZoneRateCommonFormData } from "./components/ShippingZoneRatesPage/types";
import { shippingRateEditUrl } from "./urls";
import { type ChannelPriceValue, normalizeChannelPriceValue } from "./utils/channelPricingState";

export const createChannelsChangeHandler =
  (
    selectedChannels: ChannelShippingData[],
    setSelectedChannels: (channels: ChannelShippingData[]) => void,
    triggerChange: () => void,
  ) =>
  (channelId: string, value: ChannelPriceValue) => {
    const itemIndex = selectedChannels.findIndex(item => item.id === channelId);
    const channel = selectedChannels[itemIndex];
    const updatedChannels = [
      ...selectedChannels.slice(0, itemIndex),
      {
        ...channel,
        maxValue: normalizeChannelPriceValue(value.maxValue),
        minValue: normalizeChannelPriceValue(value.minValue),
        price: normalizeChannelPriceValue(value.price),
      },
      ...selectedChannels.slice(itemIndex + 1),
    ];

    setSelectedChannels(updatedChannels);
    triggerChange();
  };

const parseOptionalOrderPrice = (value: string): string | null => {
  const trimmed = value.trim();

  return trimmed ? trimmed : null;
};

const parseOptionalOrderWeight = (value: string): number | null => {
  if (!value.trim()) {
    return null;
  }

  const parsed = parseFloat(value);

  return Number.isNaN(parsed) ? null : parsed;
};

const getPostalCodeRulesToAdd = (rules: ShippingMethodTypeFragment["postalCodeRules"]) =>
  rules
    .filter(code => !code.id || code.id === "0")
    .map(
      code =>
        ({
          end: code.end,
          start: code.start,
        }) as ShippingPostalCodeRulesCreateInputRange,
    );

function getCreateShippingPriceRateVariables(
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
      taxClass: data.taxClassId,
    },
  };
}

function getCreateShippingWeightRateVariables(
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
      maximumOrderWeight: parseOptionalOrderWeight(data.maxValue),
      minimumDeliveryDays: parsedMinDays,
      minimumOrderWeight: parseOptionalOrderWeight(data.minValue),
      name: data.name,
      shippingZone: id,
      type: ShippingMethodTypeEnum.WEIGHT,
      description: getParsedDataForJsonStringField(data.description),
      taxClass: data.taxClassId,
    },
  };
}

const resolvePostalCodeInclusionType = (
  postalCodeRules: ShippingMethodTypeFragment["postalCodeRules"] | undefined,
  inclusionType?: PostalCodeRuleInclusionTypeEnum,
): PostalCodeRuleInclusionTypeEnum =>
  postalCodeRules?.[0]?.inclusionType ?? inclusionType ?? PostalCodeRuleInclusionTypeEnum.EXCLUDE;

export function getUpdateShippingPriceRateVariables(
  data: ShippingZoneRateCommonFormData,
  id: string,
  rateId: string,
  addPostalCodeRules: ShippingMethodTypeFragment["postalCodeRules"],
  deletePostalCodeRules: string[],
  inclusionType?: PostalCodeRuleInclusionTypeEnum,
): UpdateShippingRateMutationVariables {
  const parsedMinDays = parseInt(data.minDays, 10);
  const parsedMaxDays = parseInt(data.maxDays, 10);
  const postalCodeRules = getPostalCodeRulesToAdd(addPostalCodeRules);

  return {
    id: rateId,
    input: {
      addPostalCodeRules: postalCodeRules,
      deletePostalCodeRules,
      inclusionType: resolvePostalCodeInclusionType(addPostalCodeRules, inclusionType),
      maximumDeliveryDays: parsedMaxDays,
      minimumDeliveryDays: parsedMinDays,
      name: data.name,
      shippingZone: id,
      type: ShippingMethodTypeEnum.PRICE,
      description: getParsedDataForJsonStringField(data.description),
      taxClass: data.taxClassId,
    },
  };
}

export function getUpdateShippingWeightRateVariables(
  data: ShippingZoneRateCommonFormData,
  id: string,
  rateId: string,
  addPostalCodeRules: ShippingMethodTypeFragment["postalCodeRules"],
  deletePostalCodeRules: string[],
  inclusionType?: PostalCodeRuleInclusionTypeEnum,
): UpdateShippingRateMutationVariables {
  const parsedMinDays = parseInt(data.minDays, 10);
  const parsedMaxDays = parseInt(data.maxDays, 10);
  const postalCodeRules = getPostalCodeRulesToAdd(addPostalCodeRules);

  return {
    id: rateId,
    input: {
      addPostalCodeRules: postalCodeRules,
      deletePostalCodeRules,
      inclusionType: resolvePostalCodeInclusionType(addPostalCodeRules, inclusionType),
      maximumDeliveryDays: parsedMaxDays,
      maximumOrderWeight: parseOptionalOrderWeight(data.maxValue),
      minimumDeliveryDays: parsedMinDays,
      minimumOrderWeight: parseOptionalOrderWeight(data.minValue),
      name: data.name,
      shippingZone: id,
      type: ShippingMethodTypeEnum.WEIGHT,
      description: getParsedDataForJsonStringField(data.description),
      taxClass: data.taxClassId,
    },
  };
}
export function getShippingMethodChannelVariables(
  id: string,
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
          maximumOrderPrice: parseOptionalOrderPrice(channel.maxValue),
          minimumOrderPrice: parseOptionalOrderPrice(channel.minValue),
          price: normalizeChannelPriceValue(channel.price),
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
  const [createBaseShippingRate, createBaseShippingRateOpts] = useCreateShippingRateMutation({
    disableErrorHandling: true,
  });
  const [updateShippingMethodChannelListing, updateShippingMethodChannelListingOpts] =
    useShippingMethodChannelListingUpdateMutation({ disableErrorHandling: true });
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
        variables: getShippingMethodChannelVariables(rateId, data.channelListings),
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
        text: intl.formatMessage({
          id: "nXGVlP",
          defaultMessage: "Shipping rate created",
        }),
      });
      navigate(shippingRateEditUrl(shippingZoneId, rateId));

      return [];
    }
  };
  const called = createBaseShippingRateOpts.called || updateShippingMethodChannelListingOpts.called;
  const loading =
    createBaseShippingRateOpts.loading || updateShippingMethodChannelListingOpts.loading;
  const errors = [...(createBaseShippingRateOpts.data?.shippingPriceCreate.errors || [])];
  const channelErrors =
    updateShippingMethodChannelListingOpts.data?.shippingMethodChannelListingUpdate.errors || [];

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
  if (!countriesSelected || !countries) {
    return {} as Record<string, boolean>;
  }

  return countries.reduce(
    (acc, country) => {
      acc[country.code] = !!countriesSelected.find(
        selectedCountries => selectedCountries === country.code,
      );

      return acc;
    },
    {} as Record<string, boolean>,
  );
}

export function isRestWorldCountriesSelected(
  restWorldCountries?: string[],
  countrySelectionMap?: Record<string, boolean>,
) {
  return (
    countrySelectionMap &&
    restWorldCountries?.every(countryCode => countrySelectionMap[countryCode])
  );
}
