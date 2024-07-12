// @ts-strict-ignore
import { Button } from "@dashboard/components/Button";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import TableRowLink from "@dashboard/components/TableRowLink";
import { CountryFragment } from "@dashboard/graphql";
import { TableBody, TableCell } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { DeleteIcon, IconButton, makeStyles } from "@saleor/macaw-ui";
import { Skeleton } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import React from "react";
import { FormattedMessage } from "react-intl";

import { getStringOrPlaceholder, maybe, renderCollection } from "../../misc";
import { DashboardCard } from "../Card";

export interface CountryListProps {
  countries: CountryFragment[];
  disabled: boolean;
  emptyText: React.ReactNode;
  title: React.ReactNode;
  onCountryAssign: () => void;
  onCountryUnassign: (country: string) => void;
}

const useStyles = makeStyles(
  theme => ({
    iconCell: {
      "&:last-child": {
        paddingRight: theme.spacing(3),
        paddingLeft: 0,
      },
      width: `calc(48px + ${theme.spacing(4)})`,
    },
    indicator: {
      color: theme.palette.text.disabled,
      display: "inline-block",
      left: 0,
      marginRight: theme.spacing(0.5),
      position: "absolute",
    },
    offsetCell: {
      "&:first-child": {
        paddingLeft: theme.spacing(3),
      },
      position: "relative",
    },
    pointer: {
      cursor: "pointer",
    },
    root: {
      "&:last-child": {
        paddingBottom: 0,
      },
      paddingTop: 0,
    },
    rotate: {
      transform: "rotate(180deg)",
    },
    textRight: {
      textAlign: "right",
    },
    toLeft: {
      "&:first-child": {
        paddingLeft: 0,
      },
    },
    wideColumn: {
      width: "100%",
    },
  }),
  { name: "CountryList" },
);
const CountryList: React.FC<CountryListProps> = props => {
  const { countries, disabled, emptyText, title, onCountryAssign, onCountryUnassign } = props;
  const classes = useStyles(props);
  const [isCollapsed, setCollapseStatus] = React.useState(true);
  const toggleCollapse = () => setCollapseStatus(!isCollapsed);

  function sortCountries(countries: CountryFragment[]): CountryFragment[] {
    return [...countries].sort((a, b) => a.country.localeCompare(b.country));
  }

  return (
    <DashboardCard>
      <DashboardCard.Title>{title}</DashboardCard.Title>
      <DashboardCard.Toolbar>
        <Button disabled={disabled} onClick={onCountryAssign} data-test-id="assign-country">
          <FormattedMessage id="zZCCqz" defaultMessage="Assign countries" description="button" />
        </Button>
      </DashboardCard.Toolbar>
      <ResponsiveTable>
        <TableBody>
          <TableRowLink className={classes.pointer} onClick={toggleCollapse}>
            <TableCell className={clsx(classes.wideColumn, classes.toLeft)}>
              <FormattedMessage
                id="62Ywh2"
                defaultMessage="{number} Countries"
                description="number of countries"
                values={{
                  number: getStringOrPlaceholder(countries?.length.toString()),
                }}
              />
            </TableCell>
            <TableCell className={clsx(classes.textRight, classes.iconCell)}>
              <IconButton variant="secondary">
                <ArrowDropDownIcon
                  data-test-id="countries-drop-down-icon"
                  className={clsx({
                    [classes.rotate]: !isCollapsed,
                  })}
                />
              </IconButton>
            </TableCell>
          </TableRowLink>
          {!isCollapsed &&
            renderCollection(
              sortCountries(countries),
              (country, countryIndex) => (
                <TableRowLink key={country ? country.code : "skeleton"}>
                  <TableCell className={classes.offsetCell}>
                    {maybe<React.ReactNode>(
                      () => (
                        <>
                          {(countryIndex === 0 ||
                            countries[countryIndex].country[0] !==
                              countries[countryIndex - 1].country[0]) && (
                            <span className={classes.indicator}>{country.country[0]}</span>
                          )}
                          {country.country}
                        </>
                      ),
                      <Skeleton />,
                    )}
                  </TableCell>
                  <TableCell className={clsx(classes.textRight, classes.iconCell)}>
                    <IconButton
                      data-test-id="delete-icon"
                      variant="secondary"
                      disabled={!country || disabled}
                      onClick={() => onCountryUnassign(country.code)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRowLink>
              ),
              () => (
                <TableRowLink>
                  <TableCell className={classes.toLeft} colSpan={2}>
                    {emptyText}
                  </TableCell>
                </TableRowLink>
              ),
            )}
        </TableBody>
      </ResponsiveTable>
    </DashboardCard>
  );
};

export default CountryList;
