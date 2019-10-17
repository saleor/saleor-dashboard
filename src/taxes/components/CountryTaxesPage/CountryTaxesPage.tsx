import Card from "@material-ui/core/Card";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";

import AppHeader from "@saleor/components/AppHeader";
import { Container } from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import Skeleton from "@saleor/components/Skeleton";
import { sectionNames } from "@saleor/intl";
import { TaxRateType } from "@saleor/types/globalTypes";
import { maybe, renderCollection } from "../../../misc";
import { CountryList_shop_countries_vat_reducedRates } from "../../types/CountryList";

const styles = createStyles({
  wideColumn: {
    width: "80%"
  }
});

function translateTaxRates(intl: IntlShape): Record<TaxRateType, string> {
  return {
    [TaxRateType.ACCOMMODATION]: intl.formatMessage({
      defaultMessage: "Accommodation",
      description: "tax rate"
    }),
    [TaxRateType.ADMISSION_TO_CULTURAL_EVENTS]: intl.formatMessage({
      defaultMessage: "Admission to cultural events",
      description: "tax rate"
    }),
    [TaxRateType.ADMISSION_TO_ENTERTAINMENT_EVENTS]: intl.formatMessage({
      defaultMessage: "Admission to entertainment events",
      description: "tax rate"
    }),
    [TaxRateType.ADMISSION_TO_SPORTING_EVENTS]: intl.formatMessage({
      defaultMessage: "Admission to sporting events",
      description: "tax rate"
    }),
    [TaxRateType.ADVERTISING]: intl.formatMessage({
      defaultMessage: "Advertising",
      description: "tax rate"
    }),
    [TaxRateType.AGRICULTURAL_SUPPLIES]: intl.formatMessage({
      defaultMessage: "Agricultural supplies",
      description: "tax rate"
    }),
    [TaxRateType.BABY_FOODSTUFFS]: intl.formatMessage({
      defaultMessage: "Baby foodstuffs",
      description: "tax rate"
    }),
    [TaxRateType.BIKES]: intl.formatMessage({
      defaultMessage: "Bikes",
      description: "tax rate"
    }),
    [TaxRateType.BOOKS]: intl.formatMessage({
      defaultMessage: "Books",
      description: "tax rate"
    }),
    [TaxRateType.CHILDRENS_CLOTHING]: intl.formatMessage({
      defaultMessage: "Children's clothing",
      description: "tax rate"
    }),
    [TaxRateType.DOMESTIC_FUEL]: intl.formatMessage({
      defaultMessage: "Domestic fuel",
      description: "tax rate"
    }),
    [TaxRateType.DOMESTIC_SERVICES]: intl.formatMessage({
      defaultMessage: "Domestic services",
      description: "tax rate"
    }),
    [TaxRateType.E_BOOKS]: intl.formatMessage({
      defaultMessage: "E-books",
      description: "tax rate"
    }),
    [TaxRateType.FOODSTUFFS]: intl.formatMessage({
      defaultMessage: "Foodstuffs",
      description: "tax rate"
    }),
    [TaxRateType.HOTELS]: intl.formatMessage({
      defaultMessage: "Hotels",
      description: "tax rate"
    }),
    [TaxRateType.MEDICAL]: intl.formatMessage({
      defaultMessage: "Medical",
      description: "tax rate"
    }),
    [TaxRateType.NEWSPAPERS]: intl.formatMessage({
      defaultMessage: "Newspapers",
      description: "tax rate"
    }),
    [TaxRateType.PASSENGER_TRANSPORT]: intl.formatMessage({
      defaultMessage: "Passenger transport",
      description: "tax rate"
    }),
    [TaxRateType.PHARMACEUTICALS]: intl.formatMessage({
      defaultMessage: "Pharmaceuticals",
      description: "tax rate"
    }),
    [TaxRateType.PROPERTY_RENOVATIONS]: intl.formatMessage({
      defaultMessage: "Property renovations",
      description: "tax rate"
    }),
    [TaxRateType.RESTAURANTS]: intl.formatMessage({
      defaultMessage: "Restaurants",
      description: "tax rate"
    }),
    [TaxRateType.SOCIAL_HOUSING]: intl.formatMessage({
      defaultMessage: "Social housing",
      description: "tax rate"
    }),
    [TaxRateType.STANDARD]: intl.formatMessage({
      defaultMessage: "Standard",
      description: "tax rate"
    }),
    [TaxRateType.WATER]: intl.formatMessage({
      defaultMessage: "Water",
      description: "tax rate"
    }),
    [TaxRateType.WINE]: intl.formatMessage({
      defaultMessage: "Wine",
      description: "tax rate"
    })
  };
}

export interface CountryTaxesPageProps {
  countryName: string;
  taxCategories: CountryList_shop_countries_vat_reducedRates[];
  onBack: () => void;
}

const CountryTaxesPage = withStyles(styles, { name: "CountryTaxesPage" })(
  ({
    classes,
    countryName,
    taxCategories,
    onBack
  }: CountryTaxesPageProps & WithStyles<typeof styles>) => {
    const intl = useIntl();
    const translatedTaxRates = translateTaxRates(intl);

    return (
      <Container>
        <AppHeader onBack={onBack}>
          {intl.formatMessage(sectionNames.taxes)}
        </AppHeader>
        <PageHeader
          title={
            countryName
              ? intl.formatMessage(
                  {
                    defaultMessage: "Tax Rates in {countryName}",
                    description: "header"
                  },
                  {
                    countryName
                  }
                )
              : undefined
          }
        />
        <Grid>
          <div>
            <Card>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.wideColumn}>
                      <FormattedMessage defaultMessage="Category" />
                    </TableCell>
                    <TableCell>
                      <FormattedMessage defaultMessage="Tax Rate" />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {renderCollection(
                    taxCategories,
                    taxCategory => (
                      <TableRow
                        key={taxCategory ? taxCategory.rateType : "skeleton"}
                      >
                        <TableCell>
                          {maybe<React.ReactNode>(
                            () => translatedTaxRates[taxCategory.rateType],
                            <Skeleton />
                          )}
                        </TableCell>
                        <TableCell>
                          {maybe<React.ReactNode>(
                            () => taxCategory.rate,
                            <Skeleton />
                          )}
                        </TableCell>
                      </TableRow>
                    ),
                    () => (
                      <TableRow>
                        <TableCell colSpan={2}>
                          <FormattedMessage defaultMessage="No reduced tax categories found" />
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>
        </Grid>
      </Container>
    );
  }
);
CountryTaxesPage.displayName = "CountryTaxesPage";
export default CountryTaxesPage;
