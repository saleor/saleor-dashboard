import {
  AddressValidationRulesQuery,
  CountryCode,
  useAddressValidationRulesQuery,
} from "@dashboard/graphql";
import { ChoiceValue } from "@saleor/sdk/dist/apollo/types";

interface AreaChoices {
  label: string;
  value: string;
  raw: string;
}

const prepareChoices = (values: ChoiceValue[]): AreaChoices[] =>
  values.map(v => ({
    label: v.verbose,
    value: v.verbose,
    raw: v.raw,
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

const useDisplayValues = (areas: AreaChoices[]) => {
  const isProvinceCode = (code: string) =>
    code.length === 2 && code.toLocaleUpperCase() === code;

  const getDisplayValue = (value: string) => {
    if (isProvinceCode(value)) {
      const area = areas.find(area => area.raw === value);

      return area.value;
    }

    return value;
  };

  return { getDisplayValue };
};

export const useAddressValidation = (country?: string) => {
  const { data, loading } = useValidationRules(country);
  const areas = useAreas(data);
  const { isAllowed } = useAllowedFields(data);
  const { getDisplayValue } = useDisplayValues(areas);

  return {
    areas,
    isFieldAllowed: isAllowed,
    getDisplayValue,
    loading,
  };
};
