import {
  Card,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { Backlink } from "@saleor/components/Backlink";
import { Container } from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import { CountryListQuery } from "@saleor/graphql";
import { sectionNames } from "@saleor/intl";
import { makeStyles } from "@saleor/macaw-ui";
import { countryListUrl } from "@saleor/taxes/urls";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe, renderCollection } from "../../../misc";

const useStyles = makeStyles(
  {
    wideColumn: {
      width: "80%",
    },
  },
  { name: "CountryTaxesPage" },
);

export interface CountryTaxesPageProps {
  countryName: string;
  taxCategories: CountryListQuery["shop"]["countries"][0]["vat"]["reducedRates"];
}

const CountryTaxesPage: React.FC<CountryTaxesPageProps> = props => {
  const { countryName, taxCategories } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <Container>
      <Backlink href={countryListUrl}>
        {intl.formatMessage(sectionNames.taxes)}
      </Backlink>
      <PageHeader
        title={
          countryName
            ? intl.formatMessage(
                {
                  id: "QHB48n",
                  defaultMessage: "Tax Rates in {countryName}",
                  description: "header",
                },
                {
                  countryName,
                },
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
                    <FormattedMessage id="ccXLVi" defaultMessage="Category" />
                  </TableCell>
                  <TableCell>
                    <FormattedMessage id="la9cZ4" defaultMessage="Tax Rate" />
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
                          <Skeleton />,
                        )}
                      </TableCell>
                    </TableRow>
                  ),
                  () => (
                    <TableRow>
                      <TableCell colSpan={2}>
                        <FormattedMessage
                          id="Ubath+"
                          defaultMessage="No reduced tax categories found"
                        />
                      </TableCell>
                    </TableRow>
                  ),
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
