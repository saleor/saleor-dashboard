import {
  CountryCode,
  TaxCountryConfigurationFragment,
  useTaxClassesListQuery,
  useTaxCountriesListQuery,
  useTaxCountryConfigurationDeleteMutation,
  useTaxCountryConfigurationUpdateMutation,
} from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import { mapEdgesToItems } from "@saleor/utils/maps";
import React from "react";
import { useIntl } from "react-intl";

import TaxCountryDialog from "../components/TaxCountryDialog";
import TaxCountriesPage from "../pages/TaxCountriesPage";
import {
  taxCountriesListUrl,
  TaxesUrlDialog,
  TaxesUrlQueryParams,
  TaxTab,
  taxTabPath,
} from "../urls";
import {
  filterChosenCountries,
  mapUndefinedTaxRatesToCountries,
} from "../utils/utils";

interface CountriesListProps {
  id: string | undefined;
  params: TaxesUrlQueryParams | undefined;
}

export const CountriesList: React.FC<CountriesListProps> = ({ id, params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const handleTabChange = (tab: TaxTab) => {
    navigate(taxTabPath(tab));
  };

  const [
    taxCountryConfigurationUpdateMutation,
    { status: mutationStatus, loading: mutationInProgress },
  ] = useTaxCountryConfigurationUpdateMutation({
    onCompleted: data => {
      const errors = data?.taxCountryConfigurationUpdate?.errors;
      if (errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
      }
    },
  });
  const [
    taxCountryConfigurationDeleteMutation,
  ] = useTaxCountryConfigurationDeleteMutation({
    onCompleted: data => {
      const errors = data?.taxCountryConfigurationDelete?.errors;
      if (errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
      }
    },
  });

  const shop = useShop();

  const [openDialog, closeDialog] = createDialogActionHandlers<
    TaxesUrlDialog,
    TaxesUrlQueryParams
  >(navigate, params => taxCountriesListUrl(id, params), params);

  const [newCountries, setNewCountries] = React.useState<
    TaxCountryConfigurationFragment[]
  >([]);

  const {
    data,
    refetch,
    loading: queryInProgress,
  } = useTaxCountriesListQuery();
  const { data: taxClassesData } = useTaxClassesListQuery({
    variables: { first: 100 },
  });

  const taxCountryConfigurations = data?.taxCountryConfigurations;
  const taxClasses = mapEdgesToItems(taxClassesData?.taxClasses);

  const allCountryTaxes: TaxCountryConfigurationFragment[] = React.useMemo(
    () => [
      ...mapUndefinedTaxRatesToCountries(
        taxCountryConfigurations ?? [],
        taxClasses ?? [],
      ),
      ...newCountries,
    ],
    [taxCountryConfigurations, newCountries, taxClasses],
  );

  const handleDeleteConfiguration = async (countryCode: CountryCode) => {
    if (newCountries.some(config => config.country.code === countryCode)) {
      setNewCountries(
        newCountries.filter(config => config.country.code !== countryCode),
      );
      return;
    }
    const res = await taxCountryConfigurationDeleteMutation({
      variables: {
        countryCode,
      },
    });
    refetch();
    return res;
  };

  React.useEffect(() => {
    if (
      allCountryTaxes?.length > 0 &&
      (id === "undefined" ||
        allCountryTaxes.every(
          configuration => configuration.country.code !== id,
        ))
    ) {
      navigate(taxCountriesListUrl(allCountryTaxes[0].country.code));
    }
  }, [allCountryTaxes, id, navigate]);

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
        onSubmit={async data => {
          const res = await taxCountryConfigurationUpdateMutation({
            variables: {
              countryCode: id as CountryCode,
              updateTaxClassRates: data,
            },
          });
          refetch();
          setNewCountries(
            newCountries.filter(config => config.country.code !== id),
          );
          return res;
        }}
        onDeleteConfiguration={handleDeleteConfiguration}
        savebarState={mutationStatus}
        disabled={mutationInProgress || queryInProgress}
      />
      {shop?.countries && (
        <TaxCountryDialog
          open={params?.action === "add-country"}
          countries={filterChosenCountries(
            shop?.countries,
            allCountryTaxes,
          ).map(country => ({
            checked: false,
            ...country,
          }))}
          onConfirm={data => {
            closeDialog();
            return setNewCountries(prevState => [
              ...prevState,
              ...data.map(country => {
                const taxClassCountryRates = taxClasses.map(taxClass => ({
                  __typename: "TaxClassCountryRate" as const,
                  rate: undefined,
                  taxClass,
                }));
                taxClassCountryRates.unshift({
                  rate: undefined,
                  taxClass: null,
                  __typename: "TaxClassCountryRate" as const,
                });
                return {
                  country,
                  taxClassCountryRates,
                  __typename: "TaxCountryConfiguration" as const,
                };
              }),
            ]);
          }}
          onClose={closeDialog}
        />
      )}
    </>
  );
};

export default CountriesList;
