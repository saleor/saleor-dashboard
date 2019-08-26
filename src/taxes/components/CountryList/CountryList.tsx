import Card from "@material-ui/core/Card";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import classNames from "classnames";
import React from "react";
import { FormattedMessage } from "react-intl";

import Skeleton from "@saleor/components/Skeleton";
import { maybe, renderCollection } from "../../../misc";
import { CountryList_shop_countries } from "../../types/CountryList";

const styles = createStyles({
  tableRow: {
    cursor: "pointer"
  },
  textRight: {
    textAlign: "right"
  }
});

interface CountryListProps extends WithStyles<typeof styles> {
  countries: CountryList_shop_countries[];
  onRowClick: (code: string) => void;
}

const CountryList = withStyles(styles, { name: "CountryList" })(
  ({ classes, onRowClick, countries }: CountryListProps) => (
    <Card>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <FormattedMessage defaultMessage="Country Code" />
            </TableCell>
            <TableCell>
              <FormattedMessage defaultMessage="Country Name" />
            </TableCell>
            <TableCell className={classes.textRight}>
              <FormattedMessage defaultMessage="Reduced Tax Rates" />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {renderCollection(
            countries,
            country => (
              <TableRow
                className={classNames({
                  [classes.tableRow]: !!country
                })}
                hover={!!country}
                onClick={!!country ? () => onRowClick(country.code) : undefined}
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
                    <Skeleton />
                  )}
                </TableCell>
              </TableRow>
            ),
            () => (
              <TableRow>
                <TableCell colSpan={3}>
                  <FormattedMessage defaultMessage="No countries found" />
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </Card>
  )
);
CountryList.displayName = "CountryList";
export default CountryList;
