import {
  useCountryListQuery,
  useFetchTaxesMutation,
  useUpdateTaxSettingsMutation
} from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import React from "react";
import { useIntl } from "react-intl";

import { configurationMenuUrl } from "../../configuration";
import { extractMutationErrors, maybe } from "../../misc";
import CountryListPage, {
  TaxesConfigurationFormData
} from "../components/CountryListPage";
import { countryTaxRatesUrl } from "../urls";

export const CountryList: React.FC = () => {
  const intl = useIntl();
  const navigate = useNavigator();
  const notify = useNotifier();

  const { data, loading } = useCountryListQuery({
    displayLoader: true
  });

  const [fetchTaxes, fetchTaxesOpts] = useFetchTaxesMutation({
    onCompleted: data => {
      if (data.shopFetchTaxRates.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            defaultMessage: "Successfully fetched tax rates"
          })
        });
      } else {
        notify({
          status: "error",
          text: intl.formatMessage(commonMessages.somethingWentWrong)
        });
      }
    }
  });

  const [
    updateTaxSettings,
    updateTaxSettingsOpts
  ] = useUpdateTaxSettingsMutation({
    onCompleted: data => {
      if (data.shopSettingsUpdate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
      }
    }
  });

  const handleSubmit = (data: TaxesConfigurationFormData) =>
    extractMutationErrors(
      updateTaxSettings({
        variables: {
          input: {
            chargeTaxesOnShipping: data.chargeTaxesOnShipping,
            displayGrossPrices: data.showGross,
            includeTaxesInPrices: data.includeTax
          }
        }
      })
    );

  return (
    <CountryListPage
      disabled={
        loading || fetchTaxesOpts.loading || updateTaxSettingsOpts.loading
      }
      onBack={() => navigate(configurationMenuUrl)}
      onRowClick={code => navigate(countryTaxRatesUrl(code))}
      onSubmit={handleSubmit}
      onTaxFetch={fetchTaxes}
      saveButtonBarState={updateTaxSettingsOpts.status}
      shop={maybe(() => ({
        ...data.shop,
        countries: data.shop.countries.filter(country => country.vat)
      }))}
    />
  );
};

export default CountryList;
