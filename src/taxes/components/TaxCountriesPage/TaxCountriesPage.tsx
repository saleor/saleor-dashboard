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
import { taxesMessages } from "@saleor/taxes/messages";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import TaxCountriesMenu from "../TaxCountriesMenu";
import TaxInput from "../TaxInput";

interface TaxCountriesPageProps {
  data: any;
  taxClasses: any;
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
  const { data, taxClasses, selectedCountryId, handleTabChange } = props;

  const intl = useIntl();
  const classes = useStyles();

  const [query, setQuery] = React.useState("");

  const [vals, setVals] = React.useState<any[]>(
    taxClasses.map(item => item?.rate?.toString() ?? "")
  );

  // @TODO: handle special characters in query
  const filteredTaxClasses = taxClasses.filter(taxClass =>
    taxClass.name.includes(query)
  );

  return (
    <Container>
      <PageHeader title={intl.formatMessage(sectionNames.taxes)} />
      <PageTabs value="countries" onChange={handleTabChange}>
        <PageTab label={"Channels"} value="channels" />
        <PageTab label={"Countries"} value="countries" />
        <PageTab label={"Tax classes"} value="classes" />
      </PageTabs>
      <VerticalSpacer spacing={2} />
      <Grid variant="inverted">
        <TaxCountriesMenu
          countries={data}
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
            {filteredTaxClasses.map((taxClass, classIndex) => (
              <ListItem key={taxClass.id} hover={false}>
                <ListItemCell>{taxClass.name}</ListItemCell>
                <ListItemCell>
                  <TaxInput
                    placeholder={taxClasses[0].rate}
                    value={vals[classIndex]}
                    setVal={val => {
                      const newVals = [...vals];
                      newVals[classIndex] = val;
                      setVals(newVals);
                    }}
                  />
                </ListItemCell>
              </ListItem>
            ))}
          </List>
        </Card>
      </Grid>
    </Container>
  );
};

export default TaxCountriesPage;
