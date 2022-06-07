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
  PageTab,
  PageTabs,
  SearchIcon
} from "@saleor/macaw-ui";
import { taxesMessages } from "@saleor/taxes/messages";
import { getDefaultTaxRateInCountry } from "@saleor/taxes/utils/utils";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import TaxInput from "../../components/TaxInput";

interface TaxClassesPageProps {
  taxClasses: TaxClassFragment[] | undefined;
  countryNames: CountryFragment[] | undefined;
  selectedTaxClassId: string;
  handleTabChange: (tab: string) => void;
}

export const TaxClassesPage: React.FC<TaxClassesPageProps> = props => {
  const {
    taxClasses,
    countryNames,
    selectedTaxClassId,
    handleTabChange
  } = props;
  const intl = useIntl();

  const [query, setQuery] = React.useState("");

  const currentTaxClass = React.useMemo(
    () => taxClasses?.find(taxClass => taxClass.id === selectedTaxClassId),
    [selectedTaxClassId, taxClasses]
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
        {/* <TaxClassesMenu
            countries={countryTaxesData}
            countryNames={countries}
            selectedCountryId={selectedCountryId}
            onCountryDelete={() => null}
          /> */}
        <Card>{/* Menu */}</Card>
        <div>
          <Card>
            <CardTitle
              title={intl.formatMessage(taxesMessages.generalInformation)}
            />
            <CardContent>
              <TextField
                value={""}
                onChange={() => null}
                variant="outlined"
                placeholder={intl.formatMessage(taxesMessages.taxRateName)}
                fullWidth
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
                // inputProps={{ className: classes.inputPadding }}
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
                currentTaxClass?.countries.map(country => (
                  <ListItem key={country.countryCode} hover={false}>
                    <ListItemCell>
                      {
                        countryNames.find(
                          countryName =>
                            countryName.code === country.countryCode
                        ).country
                      }
                    </ListItemCell>
                    <ListItemCell>
                      <TaxInput
                        placeholder={getDefaultTaxRateInCountry(
                          taxClasses,
                          country
                        )}
                        value={(country.rate * 100).toString()}
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
