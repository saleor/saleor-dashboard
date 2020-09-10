import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import React from "react";
import { useIntl } from "react-intl";

import { configurationMenuUrl } from "../../configuration";
import { maybe } from "../../misc";
import CountryListPage from "../components/CountryListPage";
import { TypedFetchTaxes, TypedUpdateTaxSettings } from "../mutations";
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

  return (
    <TypedUpdateTaxSettings onCompleted={handleUpdateTaxSettings}>
      {(updateTaxSettings, updateTaxSettingsOpts) => (
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
                  onSubmit={formData =>
                    updateTaxSettings({
                      variables: {
                        input: {
                          chargeTaxesOnShipping: formData.chargeTaxesOnShipping,
                          displayGrossPrices: formData.showGross,
                          includeTaxesInPrices: formData.includeTax
                        }
                      }
                    })
                  }
                  onTaxFetch={fetchTaxes}
                  saveButtonBarState={updateTaxSettingsOpts.status}
                  shop={maybe(() => ({
                    ...data.shop,
                    countries: data.shop.countries.filter(
                      country => country.vat
                    )
                  }))}
                />
              )}
            </TypedCountryListQuery>
          )}
        </TypedFetchTaxes>
      )}
    </TypedUpdateTaxSettings>
  );
};
export default CountryList;
