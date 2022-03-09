import {
  Card,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";
import { Container } from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import { CountryListQuery } from "@saleor/graphql";
import { sectionNames } from "@saleor/intl";
import { Backlink, makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe, renderCollection } from "../../../misc";

const useStyles = makeStyles(
  {
    wideColumn: {
      width: "80%"
    }
  },
  { name: "CountryTaxesPage" }
);

export interface CountryTaxesPageProps {
  countryName: string;
  taxCategories: CountryListQuery["shop"]["countries"][0]["vat"]["reducedRates"];
  onBack: () => void;
}

const CountryTaxesPage: React.FC<CountryTaxesPageProps> = props => {
  const { countryName, taxCategories, onBack } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <Container>
      <Backlink onClick={onBack}>
        {intl.formatMessage(sectionNames.taxes)}
      </Backlink>
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
            <ResponsiveTable>
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
                        {taxCategory?.rateType ?? <Skeleton />}
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
            </ResponsiveTable>
          </Card>
        </div>
      </Grid>
    </Container>
  );
};
CountryTaxesPage.displayName = "CountryTaxesPage";
export default CountryTaxesPage;
