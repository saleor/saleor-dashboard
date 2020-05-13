import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import classNames from "classnames";
import React from "react";
import { FormattedMessage } from "react-intl";

import { maybe, renderCollection } from "../../../misc";
import { CountryList_shop_countries } from "../../types/CountryList";

const useStyles = makeStyles(
  {
    tableRow: {
      cursor: "pointer"
    },
    textRight: {
      textAlign: "right"
    }
  },
  { name: "CountryList" }
);

interface CountryListProps {
  countries: CountryList_shop_countries[];
  onRowClick: (code: string) => void;
}

const CountryList: React.FC<CountryListProps> = props => {
  const { onRowClick, countries } = props;

  const classes = useStyles(props);

  return (
    <Card>
      <ResponsiveTable>
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
      </ResponsiveTable>
    </Card>
  );
};
CountryList.displayName = "CountryList";
export default CountryList;
