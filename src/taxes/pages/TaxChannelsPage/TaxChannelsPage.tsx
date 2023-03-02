import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardTitle from "@dashboard/components/CardTitle";
import Form from "@dashboard/components/Form";
import Grid from "@dashboard/components/Grid";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import Savebar from "@dashboard/components/Savebar";
import Skeleton from "@dashboard/components/Skeleton";
import VerticalSpacer from "@dashboard/components/VerticalSpacer";
import { configurationMenuUrl } from "@dashboard/configuration";
import {
  CountryCode,
  CountryFragment,
  TaxCalculationStrategy,
  TaxConfigurationFragment,
  TaxConfigurationPerCountryFragment,
  TaxConfigurationUpdateInput,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import TaxCountryDialog from "@dashboard/taxes/components/TaxCountryDialog";
import TaxPageTitle from "@dashboard/taxes/components/TaxPageTitle";
import { taxesMessages } from "@dashboard/taxes/messages";
import { isLastElement } from "@dashboard/taxes/utils/utils";
import { Card, CardContent, Divider } from "@material-ui/core";
import {
  Button,
  ConfirmButtonTransitionState,
  List,
  ListHeader,
  ListItem,
  ListItemCell,
  PageTab,
  PageTabs,
} from "@saleor/macaw-ui";
import { Box } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "./styles";
import TaxChannelsMenu from "./TaxChannelsMenu";
import TaxCountryExceptionListItem from "./TaxCountryExceptionListItem";
import TaxSettingsCard from "./TaxSettingsCard";

interface TaxChannelsPageProps {
  taxConfigurations: TaxConfigurationFragment[] | undefined;
  selectedConfigurationId: string;
  handleTabChange: (tab: string) => void;
  allCountries: CountryFragment[] | undefined;
  isDialogOpen: boolean;
  openDialog: (action?: string) => void;
  closeDialog: () => void;
  onSubmit: (input: TaxConfigurationUpdateInput) => void;
  savebarState: ConfirmButtonTransitionState;
  disabled: boolean;
}

export interface TaxConfigurationFormData {
  chargeTaxes: boolean;
  taxCalculationStrategy: TaxCalculationStrategy;
  displayGrossPrices: boolean;
  pricesEnteredWithTax: boolean;
  updateCountriesConfiguration: TaxConfigurationPerCountryFragment[];
  removeCountriesConfiguration: CountryCode[];
}

export const TaxChannelsPage: React.FC<TaxChannelsPageProps> = props => {
  const {
    taxConfigurations,
    selectedConfigurationId,
    handleTabChange,
    allCountries,
    isDialogOpen,
    openDialog,
    closeDialog,
    onSubmit,
    savebarState,
    disabled,
  } = props;

  const intl = useIntl();
  const classes = useStyles();
  const navigate = useNavigator();

  const currentTaxConfiguration = taxConfigurations?.find(
    taxConfigurations => taxConfigurations.id === selectedConfigurationId,
  );

  const initialForm: TaxConfigurationFormData = {
    chargeTaxes: currentTaxConfiguration?.chargeTaxes ?? false,
    taxCalculationStrategy: currentTaxConfiguration?.taxCalculationStrategy,
    displayGrossPrices: currentTaxConfiguration?.displayGrossPrices ?? false,
    pricesEnteredWithTax:
      currentTaxConfiguration?.pricesEnteredWithTax ?? false,
    updateCountriesConfiguration: currentTaxConfiguration?.countries ?? [],
    removeCountriesConfiguration: [],
  };

  const handleSubmit = (data: TaxConfigurationFormData) => {
    const { updateCountriesConfiguration, removeCountriesConfiguration } = data;
    const parsedUpdate: TaxConfigurationUpdateInput["updateCountriesConfiguration"] =
      updateCountriesConfiguration.map(config => ({
        countryCode: config.country.code as CountryCode,
        chargeTaxes: config.chargeTaxes,
        taxCalculationStrategy: config.taxCalculationStrategy,
        displayGrossPrices: config.displayGrossPrices,
      }));
    onSubmit({
      chargeTaxes: data.chargeTaxes,
      taxCalculationStrategy: data.chargeTaxes
        ? data.taxCalculationStrategy
        : null,
      displayGrossPrices: data.displayGrossPrices,
      pricesEnteredWithTax: data.pricesEnteredWithTax,
      updateCountriesConfiguration: parsedUpdate,
      removeCountriesConfiguration,
    });
  };

  const taxStrategyChoices = [
    {
      label: intl.formatMessage(taxesMessages.taxStrategyTaxApp),
      value: TaxCalculationStrategy.TAX_APP,
    },
    {
      label: intl.formatMessage(taxesMessages.taxStrategyFlatRates),
      value: TaxCalculationStrategy.FLAT_RATES,
    },
  ];

  return (
    <Form initial={initialForm} onSubmit={handleSubmit} mergeData={false}>
      {({ data, change, submit, set, triggerChange }) => {
        const countryExceptions = data.updateCountriesConfiguration;

        const handleExceptionChange = (event, index) => {
          const { name, value } = event.target;
          const currentExceptions = [...data.updateCountriesConfiguration];
          const exceptionToChange = {
            ...data.updateCountriesConfiguration[index],
            [name]: value,
          };
          currentExceptions[index] = exceptionToChange;
          triggerChange();
          set({ updateCountriesConfiguration: currentExceptions });
        };

        const handleCountryChange = (country: CountryFragment) => {
          closeDialog();
          const input: TaxConfigurationPerCountryFragment = {
            __typename: "TaxConfigurationPerCountry",
            country,
            chargeTaxes: data.chargeTaxes,
            displayGrossPrices: data.displayGrossPrices,
            taxCalculationStrategy: data.taxCalculationStrategy,
          };
          const currentExceptions = data.updateCountriesConfiguration;
          triggerChange();
          set({
            updateCountriesConfiguration: [input, ...currentExceptions],
          });
        };

        return (
          <DetailPageLayout gridTemplateColumns={1}>
            <TopNav title={<TaxPageTitle />} />
            <DetailPageLayout.Content>
              <Box padding={9}>
                <PageTabs value="channels" onChange={handleTabChange}>
                  <PageTab
                    label={intl.formatMessage(taxesMessages.channelsSection)}
                    value="channels"
                  />
                  <PageTab
                    label={intl.formatMessage(taxesMessages.countriesSection)}
                    value="countries"
                  />
                  <PageTab
                    label={intl.formatMessage(taxesMessages.taxClassesSection)}
                    value="tax-classes"
                  />
                </PageTabs>
                <VerticalSpacer spacing={2} />
                <Grid variant="inverted">
                  <div>
                    <TaxChannelsMenu
                      configurations={taxConfigurations}
                      selectedConfigurationId={selectedConfigurationId}
                    />
                  </div>
                  <div>
                    <TaxSettingsCard
                      values={data}
                      strategyChoices={taxStrategyChoices}
                      onChange={change}
                    />
                    <VerticalSpacer spacing={3} />
                    <Card>
                      <CardTitle
                        className={classes.toolbarMargin}
                        title={intl.formatMessage(
                          taxesMessages.countryExceptions,
                        )}
                        toolbar={
                          <Button
                            variant="secondary"
                            onClick={() => openDialog("add-country")}
                          >
                            <FormattedMessage
                              {...taxesMessages.addCountryLabel}
                            />
                          </Button>
                        }
                      />
                      {countryExceptions?.length === 0 ? (
                        <CardContent>
                          <FormattedMessage
                            {...taxesMessages.noExceptionsForChannel}
                          />
                        </CardContent>
                      ) : (
                        <List gridTemplate={["4fr 3fr 3fr 1fr"]}>
                          <ListHeader>
                            <ListItem>
                              <ListItemCell>
                                <FormattedMessage
                                  {...taxesMessages.countryNameHeader}
                                />
                              </ListItemCell>
                              <ListItemCell className={classes.left}>
                                <FormattedMessage
                                  {...taxesMessages.chargeTaxesHeader}
                                />
                              </ListItemCell>
                              <ListItemCell className={classes.center}>
                                <FormattedMessage
                                  {...taxesMessages.showGrossHeader}
                                />
                              </ListItemCell>
                              <ListItemCell>
                                {/* This is required for the header row to be aligned with list items */}
                                <div className={classes.dummy}></div>
                              </ListItemCell>
                            </ListItem>
                          </ListHeader>
                          <Divider />
                          {countryExceptions?.map((country, countryIndex) => (
                            <TaxCountryExceptionListItem
                              divider={
                                !isLastElement(countryExceptions, countryIndex)
                              }
                              strategyChoices={taxStrategyChoices}
                              country={country}
                              key={country.country.code}
                              onDelete={() => {
                                const currentRemovals =
                                  data.removeCountriesConfiguration;
                                const currentExceptions = [
                                  ...data.updateCountriesConfiguration,
                                ];
                                set({
                                  removeCountriesConfiguration: [
                                    ...currentRemovals,
                                    country.country.code as CountryCode,
                                  ],
                                  updateCountriesConfiguration:
                                    currentExceptions.filter(
                                      exception =>
                                        exception.country.code !==
                                        country.country.code,
                                    ),
                                });
                                triggerChange();
                              }}
                              onChange={event =>
                                handleExceptionChange(event, countryIndex)
                              }
                            />
                          )) ?? <Skeleton />}
                        </List>
                      )}
                    </Card>
                  </div>
                </Grid>

                {allCountries && (
                  <TaxCountryDialog
                    open={isDialogOpen}
                    countries={allCountries
                      .filter(
                        ({ code }) =>
                          !countryExceptions?.some(
                            ({ country }) => country.code === code,
                          ),
                      )
                      .map(country => ({ checked: false, ...country }))}
                    onConfirm={handleCountryChange}
                    onClose={closeDialog}
                  />
                )}
              </Box>
            </DetailPageLayout.Content>
            <Savebar
              state={savebarState}
              disabled={disabled}
              onSubmit={submit}
              onCancel={() => navigate(configurationMenuUrl)}
            />
          </DetailPageLayout>
        );
      }}
    </Form>
  );
};
export default TaxChannelsPage;
