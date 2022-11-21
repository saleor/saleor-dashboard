import { useCountryListQuery } from "@saleor/graphql";
import React from "react";

import CountryTaxesPage from "../components/CountryTaxesPage";

export interface CountryTaxesParams {
  code: string;
}

export const CountryTaxes: React.FC<CountryTaxesParams> = ({ code }) => {
  const { data } = useCountryListQuery({
    displayLoader: true,
  });

  const country = data?.shop.countries.find(country => country.code === code);

  return (
    <CountryTaxesPage
      countryName={country?.country}
      taxCategories={country?.vat.reducedRates}
    />
  );
};
export default CountryTaxes;
