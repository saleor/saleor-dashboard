import { useTaxCountriesListQuery } from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import React from "react";

import TaxCountriesPage from "../pages/TaxCountriesPage";
import { countriesListUrl, TaxTab, taxTabPath } from "../urls";
import { useTaxUrlRedirect } from "../utils/useTaxUrlRedirect";

interface CountriesListProps {
  id: string | undefined;
}

export const CountriesList: React.FC<CountriesListProps> = ({ id }) => {
  const navigate = useNavigator();

  const handleTabChange = (tab: TaxTab) => {
    navigate(taxTabPath(tab));
  };

  const { data } = useTaxCountriesListQuery();
  const taxCountryConfigurations = data?.taxCountryConfigurations;

  useTaxUrlRedirect({
    id,
    data: taxCountryConfigurations,
    navigate,
    urlFunction: countriesListUrl
  });

  if (id === "undefined" && taxCountryConfigurations?.length) {
    return null;
  }

  return (
    <TaxCountriesPage
      countryTaxesData={taxCountryConfigurations}
      selectedCountryId={id!}
      handleTabChange={handleTabChange}
    />
  );
};

export default CountriesList;
