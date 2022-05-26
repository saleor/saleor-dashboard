import {
  Card,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TableRowLink from "@saleor/components/TableRowLink";
import { CountryListQuery } from "@saleor/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import { countryTaxRatesUrl } from "@saleor/taxes/urls";
import classNames from "classnames";
import React from "react";
import { FormattedMessage } from "react-intl";

import { maybe, renderCollection } from "../../../misc";

const useStyles = makeStyles(
  {
    tableRow: {
      cursor: "pointer",
    },
    textRight: {
      textAlign: "right",
    },
  },
  { name: "CountryList" },
);

interface CountryListProps {
  countries: CountryListQuery["shop"]["countries"];
}

const CountryList: React.FC<CountryListProps> = props => {
  const { countries } = props;

  const classes = useStyles(props);

  return (
    <Card>
      <ResponsiveTable>
        <TableHead>
          <TableRow>
            <TableCell>
              <FormattedMessage id="07KB2d" defaultMessage="Country Code" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="0GJfWd" defaultMessage="Country Name" />
            </TableCell>
            <TableCell className={classes.textRight}>
              <FormattedMessage
                id="/JENWS"
                defaultMessage="Reduced Tax Rates"
              />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {renderCollection(
            countries,
            country => (
              <TableRowLink
                className={classNames({
                  [classes.tableRow]: !!country,
                })}
                hover={!!country}
                href={country && countryTaxRatesUrl(country.code)}
                key={country ? country.code : "skeleton"}
              >
                <TableCell>
                  {maybe<React.ReactNode>(() => country.code, <Skeleton />)}
                </TableCell>
                <TableCell>
                  {maybe<React.ReactNode>(() => country.country, <Skeleton />)}
                </TableCell>
                <TableCell className={classes.textRight}>
                  {maybe<React.ReactNode>(
                    () => country.vat.reducedRates.length,
                    <Skeleton />,
                  )}
                </TableCell>
              </TableRowLink>
            ),
            () => (
              <TableRow>
                <TableCell colSpan={3}>
                  <FormattedMessage
                    id="3BTtL2"
                    defaultMessage="No countries found"
                  />
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};
CountryList.displayName = "CountryList";
export default CountryList;
