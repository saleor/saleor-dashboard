import Card from "@material-ui/core/Card";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import AppHeader from "@saleor/components/AppHeader";
import { Container } from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import Skeleton from "@saleor/components/Skeleton";
import { sectionNames } from "@saleor/intl";
import { maybe, renderCollection, translatedTaxRates } from "../../../misc";
import { CountryList_shop_countries_vat_reducedRates } from "../../types/CountryList";

const styles = createStyles({
  wideColumn: {
    width: "80%"
  }
});

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

    const taxRates = translatedTaxRates();
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
                            () => taxRates[taxCategory.rateType],
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
