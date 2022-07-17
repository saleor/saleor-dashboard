import {
  CountryCode,
  TaxCountryConfigurationFragment,
  useTaxClassesListQuery,
  useTaxClassUpdateMutation,
  useTaxCountriesListQuery,
  useTaxCountryConfigurationUpdateMutation
} from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import useShop from "@saleor/hooks/useShop";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import { mapEdgesToItems } from "@saleor/utils/maps";
import React from "react";

import TaxCountryDialog from "../components/TaxCountryDialog";
import TaxCountriesPage from "../pages/TaxCountriesPage";
import { taxCountriesList } from "../queries";
import {
  taxCountriesListUrl,
  TaxesUrlDialog,
  TaxesUrlQueryParams,
  TaxTab,
  taxTabPath
} from "../urls";
import { useTaxUrlRedirect } from "../utils/useTaxUrlRedirect";
import { filterChosenCountries } from "../utils/utils";

interface CountriesListProps {
  id: string | undefined;
  params: TaxesUrlQueryParams | undefined;
}

export const CountriesList: React.FC<CountriesListProps> = ({ id, params }) => {
  const navigate = useNavigator();

  const handleTabChange = (tab: TaxTab) => {
    navigate(taxTabPath(tab));
  };

  const [
    taxCountryConfigurationUpdateMutation,
    { status: mutationStatus, loading: mutationInProgress }
  ] = useTaxCountryConfigurationUpdateMutation();

  const shop = useShop();

  const [openDialog, closeDialog] = createDialogActionHandlers<
    TaxesUrlDialog,
    TaxesUrlQueryParams
  >(navigate, params => taxCountriesListUrl(id, params), params);

  const [newCountries, setNewCountries] = React.useState<
    TaxCountryConfigurationFragment[]
  >([]);

  const { data } = useTaxCountriesListQuery();
  const { data: taxClassesData } = useTaxClassesListQuery({
    variables: { first: 100 }
  });

  const taxCountryConfigurations = data?.taxCountryConfigurations;
  const taxClasses = mapEdgesToItems(taxClassesData?.taxClasses);

  useTaxUrlRedirect({
    id,
    data: taxCountryConfigurations,
    navigate,
    urlFunction: taxCountriesListUrl
  });

  const allCountryTaxes = [
    ...(taxCountryConfigurations ?? []),
    ...newCountries
  ];

  React.useEffect(() => {
    if (
      id === "undefined" &&
      newCountries.length > 0 &&
      taxCountryConfigurations.length === 0
    ) {
      navigate(taxCountriesListUrl(newCountries[0].country.code));
    }
  }, [newCountries]);

  if (id === "undefined" && allCountryTaxes?.length) {
    return null;
  }

  return (
    <>
      <TaxCountriesPage
        countryTaxesData={allCountryTaxes}
        selectedCountryId={id!}
        handleTabChange={handleTabChange}
        openDialog={openDialog}
        onSubmit={() => null}
        savebarState={mutationStatus}
        disabled={mutationInProgress}
      />
      {shop?.countries && (
        <TaxCountryDialog
          open={params?.action === "add-country"}
          countries={filterChosenCountries(
            shop?.countries,
            allCountryTaxes
          ).map(country => ({
            checked: false,
            ...country
          }))}
          onConfirm={data => {
            closeDialog();
            return setNewCountries(prevState => [
              ...prevState,
              ...data.map(country => ({
                country,
                taxClassCountryRates: taxClasses.map(taxClass => ({
                  __typename: "TaxClassCountryRate" as const,
                  rate: undefined,
                  taxClass
                })),
                __typename: "TaxCountryConfiguration" as const
              }))
            ]);
          }}
          onClose={closeDialog}
        />
      )}
    </>
  );
};

export default CountriesList;
