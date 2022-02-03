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
import { TypedFetchTaxes, useTaxSettingsUpdateMutation } from "../mutations";
import { TypedCountryListQuery } from "../queries";
import { FetchTaxes } from "../types/FetchTaxes";
import { UpdateTaxSettings } from "../types/UpdateTaxSettings";
import { countryTaxRatesUrl } from "../urls";

export const CountryList: React.FC = () => {
  const intl = useIntl();
  const navigate = useNavigator();
  const notify = useNotifier();

  const handleUpdateTaxSettings = (data: UpdateTaxSettings) => {
    if (data.shopSettingsUpdate.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges)
      });
    }
  };

  const handleFetchTaxes = (data: FetchTaxes) => {
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
  };

  const [
    updateTaxSettings,
    updateTaxSettingsOpts
  ] = useTaxSettingsUpdateMutation({ onCompleted: handleUpdateTaxSettings });

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
    <TypedFetchTaxes onCompleted={handleFetchTaxes}>
      {(fetchTaxes, fetchTaxesOpts) => (
        <TypedCountryListQuery displayLoader={true}>
          {({ data, loading }) => (
            <CountryListPage
              disabled={
                loading ||
                fetchTaxesOpts.loading ||
                updateTaxSettingsOpts.loading
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
          )}
        </TypedCountryListQuery>
      )}
    </TypedFetchTaxes>
  );
};

export default CountryList;
