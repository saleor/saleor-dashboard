// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { DashboardCard } from "@dashboard/components/Card";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Grid from "@dashboard/components/Grid";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { ResponsiveTable } from "@dashboard/components/ResponsiveTable";
import { Savebar } from "@dashboard/components/Savebar";
import TableRowLink from "@dashboard/components/TableRowLink";
import VerticalSpacer from "@dashboard/components/VerticalSpacer";
import { configurationMenuUrl } from "@dashboard/configuration";
import {
  CountryCode,
  TaxClassRateInput,
  TaxCountryConfigurationFragment,
} from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { parseQuery } from "@dashboard/orders/components/OrderCustomerAddressesEditDialog/utils";
import TaxPageTitle from "@dashboard/taxes/components/TaxPageTitle";
import { taxesMessages } from "@dashboard/taxes/messages";
import { TableBody, TableCell, TableHead } from "@material-ui/core";
import { PageTab, PageTabs } from "@saleor/macaw-ui";
import { Box } from "@saleor/macaw-ui-next";
import { useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import TaxInput from "../../components/TaxInput";
import TaxCountriesForm from "./form";
import { TaxCountriesMenu } from "./TaxCountriesMenu";

interface TaxCountriesPageProps {
  countryTaxesData: TaxCountryConfigurationFragment[] | undefined;
  selectedCountryId: string;
  handleTabChange: (tab: string) => void;
  openDialog: (action?: string) => void;
  onSubmit: (input: TaxClassRateInput[]) => SubmitPromise;
  onDeleteConfiguration: (countryCode: CountryCode) => SubmitPromise;
  savebarState: ConfirmButtonTransitionState;
  disabled: boolean;
}

const TaxCountriesPage = (props: TaxCountriesPageProps) => {
  const {
    countryTaxesData,
    selectedCountryId,
    handleTabChange,
    openDialog,
    onSubmit,
    onDeleteConfiguration,
    savebarState,
    disabled,
  } = props;
  const intl = useIntl();
  const navigate = useNavigator();
  const [query, setQuery] = useState("");
  const currentCountry = useMemo(
    () => countryTaxesData?.find(country => country.country.code === selectedCountryId),
    [selectedCountryId, countryTaxesData],
  );

  return (
    <TaxCountriesForm country={currentCountry} onSubmit={onSubmit} disabled={disabled}>
      {({ data, handlers, submit }) => {
        const filteredRates = data?.filter(
          rate => rate.label.search(new RegExp(parseQuery(query), "i")) >= 0,
        );

        return (
          <DetailPageLayout gridTemplateColumns={1}>
            <TopNav title={<TaxPageTitle />} href={configurationMenuUrl} />
            <DetailPageLayout.Content>
              <Box padding={6}>
                <PageTabs value="countries" onChange={handleTabChange}>
                  <PageTab
                    label={intl.formatMessage(taxesMessages.channelsSection)}
                    value="channels"
                    data-test-id="channels-tab"
                  />
                  <PageTab
                    label={intl.formatMessage(taxesMessages.countriesSection)}
                    value="countries"
                    data-test-id="countries-tab"
                  />
                  <PageTab
                    label={intl.formatMessage(taxesMessages.taxClassesSection)}
                    value="tax-classes"
                    data-test-id="tax-classes-tab"
                  />
                </PageTabs>
                <VerticalSpacer spacing={2} />
                <Grid variant="inverted">
                  <TaxCountriesMenu
                    configurations={countryTaxesData}
                    selectedCountryId={selectedCountryId}
                    onCountryDelete={onDeleteConfiguration}
                    onCountryAdd={() => openDialog("add-country")}
                  />
                  {currentCountry && (
                    <DashboardCard>
                      <DashboardCard.Header paddingX={4}>
                        <DashboardCard.Title>
                          {intl.formatMessage(taxesMessages.taxClassRatesHeader, {
                            country: currentCountry?.country?.country,
                          })}
                        </DashboardCard.Title>
                      </DashboardCard.Header>
                      <DashboardCard.Content paddingX={0}>
                        <ResponsiveTable
                          search={{
                            placeholder: intl.formatMessage(taxesMessages.searchTaxClasses),
                            initialValue: query,
                            onSearchChange: setQuery,
                          }}
                          filteredItemsCount={filteredRates?.length}
                        >
                          <TableHead>
                            <TableRowLink>
                              <TableCell>
                                <FormattedMessage {...taxesMessages.taxNameHeader} />
                              </TableCell>
                              <TableCell>
                                <FormattedMessage {...taxesMessages.taxRateHeader} />
                              </TableCell>
                            </TableRowLink>
                          </TableHead>
                          <TableBody>
                            {filteredRates?.map(rate => (
                              <TableRowLink key={rate.id} data-test-id={rate.label}>
                                <TableCell>{rate.label}</TableCell>
                                <TableCell>
                                  <TaxInput
                                    placeholder={data[0]?.rate}
                                    value={rate?.value}
                                    change={e => handlers.handleRateChange(rate.id, e.target.value)}
                                  />
                                </TableCell>
                              </TableRowLink>
                            ))}
                          </TableBody>
                        </ResponsiveTable>
                      </DashboardCard.Content>
                    </DashboardCard>
                  )}
                </Grid>
              </Box>
              <Savebar>
                <Savebar.Spacer />
                <Savebar.CancelButton onClick={() => navigate(configurationMenuUrl)} />
                <Savebar.ConfirmButton
                  transitionState={savebarState}
                  onClick={submit}
                  disabled={disabled}
                />
              </Savebar>
            </DetailPageLayout.Content>
          </DetailPageLayout>
        );
      }}
    </TaxCountriesForm>
  );
};

export default TaxCountriesPage;
