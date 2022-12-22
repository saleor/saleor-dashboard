import {
  AddressValidationRulesQuery,
  CountryCode,
  useAddressValidationRulesQuery,
} from "@saleor/graphql";
import { ChoiceValue } from "@saleor/sdk/dist/apollo/types";

const prepareChoices = (values: ChoiceValue[]) =>
  values.map(v => ({
    label: v.verbose,
    value: v.verbose,
  }));

const selectRules = (data: AddressValidationRulesQuery) =>
  data
    ? data.addressValidationRules
    : { countryAreaChoices: [], allowedFields: [] };

const useValidationRules = (country?: string) => {
  const countryCode = CountryCode[country];
  const { data, loading } = useAddressValidationRulesQuery({
    variables: { countryCode },
    skip: !countryCode,
  });

  return { data, loading };
};

const useAreas = (data: AddressValidationRulesQuery) => {
  const rawChoices = selectRules(data).countryAreaChoices;
  const choices = prepareChoices(rawChoices);

  return choices;
};

const useAllowedFields = (data: AddressValidationRulesQuery) => {
  const isAllowed = (fieldName: string) => {
    if (!data) {
      return false;
    }

    return selectRules(data).allowedFields.includes(fieldName);
  };

  return { isAllowed };
};

export const useAddressValidation = (country?: string) => {
  const { data, loading } = useValidationRules(country);
  const areas = useAreas(data);
  const { isAllowed } = useAllowedFields(data);

  return {
    areas,
    isFieldAllowed: isAllowed,
    loading,
  };
};
