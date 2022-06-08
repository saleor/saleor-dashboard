import useNavigator from "@saleor/hooks/useNavigator";
import useShop from "@saleor/hooks/useShop";
import React from "react";

import { taxCountryConfigurations } from "../fixtures";
import TaxCountriesPage from "../pages/TaxCountriesPage";
import { countriesListUrl, taxTabSectionUrl } from "../urls";
import { useTaxUrlRedirect } from "../utils/useTaxUrlRedirect";

interface CountriesListProps {
  id: string | undefined;
}

export const CountriesList: React.FC<CountriesListProps> = ({ id }) => {
  const navigate = useNavigator();
  const shop = useShop();

  const handleTabChange = (tab: string) => {
    navigate(taxTabSectionUrl(tab));
  };

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
      countries={shop?.countries}
      selectedCountryId={id!}
      handleTabChange={handleTabChange}
    />
  );
};

export default CountriesList;
