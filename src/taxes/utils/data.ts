// @ts-strict-ignore
import {
  CountryCode,
  CountryRateInput,
  TaxClassCreateInput,
  TaxClassFragment,
  TaxClassUpdateInput,
} from "@dashboard/graphql";
import { FormsetAtomicData } from "@dashboard/hooks/useFormset";
import { mapMetadataItemToInput } from "@dashboard/utils/maps";

import { TaxClassesPageFormData } from "../types";

export const getTaxClassInitialFormData = (taxClass?: TaxClassFragment): TaxClassesPageFormData => {
  const initialCountries = taxClass?.countries
    .map(item => ({
      id: item.country.code,
      label: item.country.country,
      value: item.rate?.toString() ?? "",
      data: null,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return {
    id: taxClass?.id,
    name: taxClass?.name ?? "",
    metadata: taxClass?.metadata?.map(mapMetadataItemToInput),
    privateMetadata: taxClass?.privateMetadata?.map(mapMetadataItemToInput),
    updateTaxClassRates: initialCountries,
  };
};

const createCountryRateInput = ({ id, value }: FormsetAtomicData): CountryRateInput => ({
  countryCode: id as CountryCode,
  rate: parseFloat(value),
});

export const createTaxClassCreateInput = (data: TaxClassesPageFormData): TaxClassCreateInput => ({
  name: data.name,
  createCountryRates: data.updateTaxClassRates.flatMap(item => {
    if (!item.value) {
      return [];
    }

    return createCountryRateInput(item);
  }),
});

export const createTaxClassUpdateInput = (data: TaxClassesPageFormData): TaxClassUpdateInput => ({
  name: data.name,
  updateCountryRates: data.updateTaxClassRates.flatMap(createCountryRateInput),
});
