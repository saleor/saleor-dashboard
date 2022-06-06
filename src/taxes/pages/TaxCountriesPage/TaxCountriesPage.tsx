import {
  Card,
  CardContent,
  InputAdornment,
  TextField
} from "@material-ui/core";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import CardTitle from "@saleor/components/CardTitle";
import Container from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import Skeleton from "@saleor/components/Skeleton";
import {
  CountryFragment,
  TaxCountryConfigurationFragment
} from "@saleor/graphql";
import { sectionNames } from "@saleor/intl";
import {
  List,
  ListHeader,
  ListItem,
  ListItemCell,
  makeStyles,
  PageTab,
  PageTabs,
  SearchIcon
} from "@saleor/macaw-ui";
import { parseQuery } from "@saleor/orders/components/OrderCustomerAddressesEditDialog/utils";
import { taxesMessages } from "@saleor/taxes/messages";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import TaxInput from "../../components/TaxInput";
import TaxCountriesMenu from "./TaxCountriesMenu";

interface TaxCountriesPageProps {
  countryTaxesData: TaxCountryConfigurationFragment[] | undefined;
  countries: CountryFragment[] | undefined;
  selectedCountryId: string;
  handleTabChange: (tab: string) => void;
}

const useStyles = makeStyles(
  () => ({
    inputPadding: {
      padding: "16px 0 16px 0"
    }
  }),
  { name: "TaxCountriesPage" }
);

export const TaxCountriesPage: React.FC<TaxCountriesPageProps> = props => {
  const {
    countryTaxesData,
    countries,
    selectedCountryId,
    handleTabChange
  } = props;
  const intl = useIntl();
  const classes = useStyles();

  const [query, setQuery] = React.useState("");

  const currentCountry = React.useMemo(
    () =>
      countryTaxesData?.find(
        country => country.countryCode === selectedCountryId
      ),
    [selectedCountryId, countryTaxesData]
  );

  const filteredRates = React.useMemo(
    () =>
      currentCountry?.taxClassCountryRates.filter(
        rate =>
          rate.taxClass.name.search(new RegExp(parseQuery(query), "i")) >= 0
      ),
    [currentCountry, query]
  );

  return (
    <Container>
      <PageHeader title={intl.formatMessage(sectionNames.taxes)} />
      <PageTabs value="countries" onChange={handleTabChange}>
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
        <TaxCountriesMenu
          countries={countryTaxesData}
          countryNames={countries}
          selectedCountryId={selectedCountryId}
          onCountryDelete={() => null}
        />
        <Card>
          <CardTitle
            title={intl.formatMessage(taxesMessages.taxClassRatesHeader)}
          />
          <CardContent>
            <TextField
              value={query}
              variant="outlined"
              onChange={e => setQuery(e.target.value)}
              placeholder={intl.formatMessage(taxesMessages.searchTaxClasses)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              inputProps={{ className: classes.inputPadding }}
            />
          </CardContent>
          <List gridTemplate={["5fr 2fr"]}>
            <ListHeader>
              <ListItem>
                <ListItemCell>
                  <FormattedMessage {...taxesMessages.taxNameHeader} />
                </ListItemCell>
                <ListItemCell>
                  <FormattedMessage {...taxesMessages.taxRateHeader} />
                </ListItemCell>
              </ListItem>
            </ListHeader>
            {filteredRates?.map(rate => (
              <ListItem key={rate.taxClass.id} hover={false}>
                <ListItemCell>{rate.taxClass.name}</ListItemCell>
                <ListItemCell>
                  <TaxInput
                    placeholder={filteredRates[0].rate}
                    value={(rate.rate * 100).toString()}
                    change={() => null} // TODO: add change function from form
                  />
                </ListItemCell>
              </ListItem>
            )) ?? <Skeleton />}
          </List>
        </Card>
      </Grid>
    </Container>
  );
};

export default TaxCountriesPage;
