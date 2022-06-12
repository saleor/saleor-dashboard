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
import { CountryFragment, TaxClassFragment } from "@saleor/graphql";
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
import {
  getDefaultTaxRateInCountry,
  mapCountryNamesToCountryRates,
  NamedTaxRate
} from "@saleor/taxes/utils/utils";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import TaxInput from "../../components/TaxInput";
import TaxClassesMenu from "./TaxClassesMenu";

interface TaxClassesPageProps {
  taxClasses: TaxClassFragment[] | undefined;
  countryNames: CountryFragment[] | undefined;
  selectedTaxClassId: string;
  handleTabChange: (tab: string) => void;
}

const useStyles = makeStyles(
  () => ({
    searchPadding: {
      padding: "16px 0 16px 0"
    },
    namePadding: {
      padding: "16px"
    }
  }),
  { name: "TaxClassesPage" }
);

export const TaxClassesPage: React.FC<TaxClassesPageProps> = props => {
  const {
    taxClasses,
    countryNames,
    selectedTaxClassId,
    handleTabChange
  } = props;
  const intl = useIntl();
  const classes = useStyles();

  const [query, setQuery] = React.useState("");

  const currentTaxClass = React.useMemo(
    () => taxClasses?.find(taxClass => taxClass.id === selectedTaxClassId),
    [selectedTaxClassId, taxClasses]
  );

  const filteredRates: NamedTaxRate[] = React.useMemo(
    () =>
      mapCountryNamesToCountryRates(
        currentTaxClass?.countries,
        countryNames
      ).filter(
        country => country.name?.search(new RegExp(parseQuery(query), "i")) >= 0
      ),
    [currentTaxClass, countryNames, query]
  );

  return (
    <Container>
      <PageHeader title={intl.formatMessage(sectionNames.taxes)} />
      <PageTabs value="tax-classes" onChange={handleTabChange}>
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
        <TaxClassesMenu
          taxClasses={taxClasses}
          selectedTaxClassId={selectedTaxClassId}
          onTaxClassDelete={() => null}
        />
        <div>
          <Card>
            <CardTitle
              title={intl.formatMessage(taxesMessages.generalInformation)}
            />
            <CardContent>
              <TextField
                value={currentTaxClass.name}
                onChange={() => null}
                variant="outlined"
                placeholder={intl.formatMessage(taxesMessages.taxRateName)}
                fullWidth
                inputProps={{ className: classes.namePadding }}
                disabled={currentTaxClass.isDefault}
              />
            </CardContent>
          </Card>
          <VerticalSpacer spacing={3} />
          <Card>
            <CardTitle
              title={intl.formatMessage(taxesMessages.taxClassRates)}
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
                inputProps={{ className: classes.searchPadding }}
              />
            </CardContent>
            <List gridTemplate={["5fr 2fr"]}>
              <ListHeader>
                <ListItem>
                  <ListItemCell>
                    <FormattedMessage {...taxesMessages.countryNameHeader} />
                  </ListItemCell>
                  <ListItemCell>
                    <FormattedMessage {...taxesMessages.taxRateHeader} />
                  </ListItemCell>
                </ListItem>
              </ListHeader>
              {(countryNames &&
                filteredRates?.map(rate => (
                  <ListItem key={rate.country.countryCode} hover={false}>
                    <ListItemCell>{rate.name}</ListItemCell>
                    <ListItemCell>
                      <TaxInput
                        placeholder={getDefaultTaxRateInCountry(
                          taxClasses,
                          rate.country
                        )}
                        value={(rate.country.rate * 100).toString()}
                        change={() => null} // TODO: add change function from form
                      />
                    </ListItemCell>
                  </ListItem>
                ))) ?? <Skeleton />}
            </List>
          </Card>
        </div>
      </Grid>
    </Container>
  );
};

export default TaxClassesPage;
