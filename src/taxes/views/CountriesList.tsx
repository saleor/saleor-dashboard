import { useTaxCountriesListQuery } from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import useShop from "@saleor/hooks/useShop";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import React from "react";

import TaxCountriesPage from "../pages/TaxCountriesPage";
import {
  taxCountriesListUrl,
  TaxesUrlDialog,
  TaxesUrlQueryParams,
  TaxTab,
  taxTabPath
} from "../urls";
import { useTaxUrlRedirect } from "../utils/useTaxUrlRedirect";

interface CountriesListProps {
  id: string | undefined;
  params: TaxesUrlQueryParams | undefined;
}

export const CountriesList: React.FC<CountriesListProps> = ({ id, params }) => {
  const navigate = useNavigator();

  const handleTabChange = (tab: TaxTab) => {
    navigate(taxTabPath(tab));
  };

  const shop = useShop();

  const [openDialog, closeDialog] = createDialogActionHandlers<
    TaxesUrlDialog,
    TaxesUrlQueryParams
  >(navigate, params => taxCountriesListUrl(id, params), params);

  const { data } = useTaxCountriesListQuery();
  const taxCountryConfigurations = data?.taxCountryConfigurations;

  useTaxUrlRedirect({
    id,
    data: taxCountryConfigurations,
    navigate,
    urlFunction: taxCountriesListUrl
  });

  if (id === "undefined" && taxCountryConfigurations?.length) {
    return null;
  }

  return (
    <TaxCountriesPage
      countryTaxesData={taxCountryConfigurations}
      selectedCountryId={id!}
      handleTabChange={handleTabChange}
      allCountries={shop?.countries}
      isDialogOpen={params?.action === "add-country"}
      openDialog={openDialog}
      closeDialog={closeDialog}
    />
  );
};

export default CountriesList;
