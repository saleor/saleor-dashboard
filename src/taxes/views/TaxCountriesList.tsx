// @ts-strict-ignore
import {
  CountryCode,
  TaxCountryConfigurationFragment,
  useTaxClassesListQuery,
  useTaxCountriesListQuery,
  useTaxCountryConfigurationDeleteMutation,
  useTaxCountryConfigurationUpdateMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import useShop from "@dashboard/hooks/useShop";
import { commonMessages } from "@dashboard/intl";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { mapEdgesToItems } from "@dashboard/utils/maps";
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
import { useTaxUrlRedirect } from "../utils/useTaxUrlRedirect";
import { excludeExistingCountries, mapUndefinedTaxRatesToCountries } from "../utils/utils";

interface TaxCountriesListProps {
  id: string | undefined;
  params: TaxesUrlQueryParams | undefined;
}

export const TaxCountriesList = ({ id, params }: TaxCountriesListProps) => {
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
  const [taxCountryConfigurationDeleteMutation] = useTaxCountryConfigurationDeleteMutation({
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
  const [openDialog, closeDialog] = createDialogActionHandlers<TaxesUrlDialog, TaxesUrlQueryParams>(
    navigate,
    params => taxCountriesListUrl(id, params),
    params,
  );
  const [newCountry, setNewCountry] = React.useState<TaxCountryConfigurationFragment>();
  const { data, refetch, loading: queryInProgress } = useTaxCountriesListQuery();
  const { data: taxClassesData } = useTaxClassesListQuery({
    variables: { first: 100 },
  });
  const taxCountryConfigurations = data?.taxCountryConfigurations;
  const taxClasses = mapEdgesToItems(taxClassesData?.taxClasses);
  const allCountryTaxes: TaxCountryConfigurationFragment[] = React.useMemo(() => {
    if (taxClasses && taxCountryConfigurations) {
      return [
        ...(newCountry ? [newCountry] : []),
        ...mapUndefinedTaxRatesToCountries(taxCountryConfigurations ?? [], taxClasses ?? []),
      ];
    } else {
      return undefined;
    }
  }, [taxCountryConfigurations, newCountry, taxClasses]);
  const handleDeleteConfiguration = async (countryCode: CountryCode) => {
    if (newCountry?.country.code === countryCode) {
      setNewCountry(undefined);

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

  useTaxUrlRedirect({
    id,
    data: allCountryTaxes,
    navigate,
    urlFunction: taxCountriesListUrl,
  });

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
          setNewCountry(undefined);

          return res;
        }}
        onDeleteConfiguration={handleDeleteConfiguration}
        savebarState={mutationStatus}
        disabled={mutationInProgress || queryInProgress}
      />
      {shop?.countries && (
        <TaxCountryDialog
          open={params?.action === "add-country"}
          countries={excludeExistingCountries(shop?.countries, allCountryTaxes)}
          onConfirm={data => {
            closeDialog();

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
            setNewCountry({
              country: data,
              taxClassCountryRates,
              __typename: "TaxCountryConfiguration" as const,
            });
            navigate(taxCountriesListUrl(data.code));
          }}
          onClose={closeDialog}
        />
      )}
    </>
  );
};

export default TaxCountriesList;
