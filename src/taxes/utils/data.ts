import {
  CountryCode,
  CountryRateInput,
  TaxClassCreateInput,
  TaxClassUpdateInput,
} from "@saleor/graphql";
import { FormsetAtomicData } from "@saleor/hooks/useFormset";

import { TaxClassesPageFormData } from "../pages/TaxClassesPage/form";

const createCountryRateInput = ({
  id,
  value,
}: FormsetAtomicData): CountryRateInput => ({
  countryCode: id as CountryCode,
  rate: parseFloat(value),
});

export const createTaxClassCreateInput = (
  data: TaxClassesPageFormData,
): TaxClassCreateInput => ({
  name: data.name,
  createCountryRates: data.updateTaxClassRates.flatMap(item => {
    if (!item.value) {
      return [];
    }
    return createCountryRateInput(item);
  }),
});

export const createTaxClassUpdateInput = (
  data: TaxClassesPageFormData,
): TaxClassUpdateInput => ({
  name: data.name,
  updateCountryRates: data.updateTaxClassRates.flatMap(createCountryRateInput),
});
