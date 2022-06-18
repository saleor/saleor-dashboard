import { Card, CardContent } from "@material-ui/core";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import CardTitle from "@saleor/components/CardTitle";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import Savebar from "@saleor/components/Savebar";
import Skeleton from "@saleor/components/Skeleton";
import {
  CountryFragment,
  TaxConfigurationFragment,
  TaxConfigurationUpdateInput
} from "@saleor/graphql";
import { sectionNames } from "@saleor/intl";
import {
  Button,
  List,
  ListHeader,
  ListItem,
  ListItemCell,
  PageTab,
  PageTabs
} from "@saleor/macaw-ui";
import TaxCountryDialog from "@saleor/taxes/components/TaxCountryDialog";
import { taxesMessages } from "@saleor/taxes/messages";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import TaxChannelsMenu from "./TaxChannelsMenu";
import TaxCountryExceptionListItem from "./TaxCountryExceptionListItem";
import TaxSettingsCard from "./TaxSettingsCard";

interface TaxChannelsPageProps {
  taxConfigurations: TaxConfigurationFragment[] | undefined;
  selectedConfigurationId: string;
  handleTabChange: (tab: string) => void;
  allCountries: CountryFragment[] | undefined;
  dialogOpen: boolean;
}

export const TaxChannelsPage: React.FC<TaxChannelsPageProps> = props => {
  const {
    taxConfigurations,
    selectedConfigurationId,
    handleTabChange,
    allCountries,
    dialogOpen
  } = props;

  const intl = useIntl();

  const currentTaxConfiguration = taxConfigurations?.find(
    taxConfigurations => taxConfigurations.id === selectedConfigurationId
  );

  const initialForm: TaxConfigurationUpdateInput = {
    chargeTaxes: currentTaxConfiguration?.chargeTaxes ?? false,
    displayGrossPrices: currentTaxConfiguration?.displayGrossPrices ?? false,
    pricesEnteredWithTax:
      currentTaxConfiguration?.pricesEnteredWithTax ?? false,
    updateCountriesConfiguration: [],
    removeCountriesConfiguration: []
  };

  return (
    <Form initial={initialForm} onSubmit={() => null}>
      {({ data, change, submit }) => (
        <Container>
          <PageHeader title={intl.formatMessage(sectionNames.taxes)} />
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
            <TaxChannelsMenu
              configurations={taxConfigurations}
              selectedConfigurationId={selectedConfigurationId}
            />
            <div>
              <TaxSettingsCard values={data} onChange={change} />
              <VerticalSpacer spacing={3} />
              <Card>
                <CardTitle
                  title={intl.formatMessage(taxesMessages.countryExceptions)}
                  toolbar={
                    <Button variant="secondary">
                      <FormattedMessage {...taxesMessages.addCountryLabel} />
                    </Button>
                  }
                />
                {currentTaxConfiguration?.countries.length === 0 ? (
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
                        <ListItemCell>
                          <FormattedMessage
                            {...taxesMessages.chargeTaxesHeader}
                          />
                        </ListItemCell>
                        <ListItemCell>
                          <FormattedMessage
                            {...taxesMessages.showGrossHeader}
                          />
                        </ListItemCell>
                      </ListItem>
                    </ListHeader>
                    {currentTaxConfiguration?.countries.map(country => (
                      <TaxCountryExceptionListItem
                        country={country.country}
                        key={country.country.code}
                      />
                    )) ?? <Skeleton />}
                  </List>
                )}
                <VerticalSpacer />
              </Card>
            </div>
          </Grid>
          <Savebar
            state={"default"}
            disabled={false}
            onSubmit={submit}
            onCancel={() => null}
          />
          {allCountries && (
            <TaxCountryDialog
              open={true}
              countries={allCountries}
              // eslint-disable-next-line no-console
              onConfirm={countries => console.log(countries)}
            />
          )}
        </Container>
      )}
    </Form>
  );
};
export default TaxChannelsPage;
