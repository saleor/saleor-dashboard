import { useCountryListQuery } from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import React from "react";

import CountryTaxesPage from "../components/CountryTaxesPage";
import { countryListUrl } from "../urls";

export interface CountryTaxesParams {
  code: string;
}

export const CountryTaxes: React.FC<CountryTaxesParams> = ({ code }) => {
  const navigate = useNavigator();

  const { data } = useCountryListQuery({
    displayLoader: true
  });

  const country = data?.shop.countries.find(country => country.code === code);

  return (
    <CountryTaxesPage
      countryName={country?.country}
      taxCategories={country?.vat.reducedRates}
      onBack={() => navigate(countryListUrl)}
    />
  );
};
export default CountryTaxes;
