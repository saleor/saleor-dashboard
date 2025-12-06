// @ts-strict-ignore
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import TableRowLink from "@dashboard/components/TableRowLink";
import { CountryFragment } from "@dashboard/graphql";
import { TableBody, TableCell } from "@material-ui/core";
import { IconButton, makeStyles } from "@saleor/macaw-ui";
import { Button, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { ChevronDownIcon, Trash2 } from "lucide-react";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { getStringOrPlaceholder } from "../../misc";
import { DashboardCard } from "../Card";
import { groupCountriesByStartingLetter } from "./utils";

interface CountryListProps {
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
const CountryList = (props: CountryListProps) => {
  const { countries, disabled, emptyText, title, onCountryAssign, onCountryUnassign } = props;
  const classes = useStyles(props);
  const [isCollapsed, setCollapseStatus] = React.useState(true);
  const toggleCollapse = () => setCollapseStatus(!isCollapsed);

  function sortCountries(countries: CountryFragment[]): CountryFragment[] {
    return [...countries].sort((a, b) => a.country.localeCompare(b.country));
  }

  const sortedCountries = sortCountries(countries ?? []);
  const groupedCountries = groupCountriesByStartingLetter(sortedCountries);
  const hasCountriesToRender = sortedCountries.length > 0;

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>{title}</DashboardCard.Title>
        <DashboardCard.Toolbar>
          <Button
            disabled={disabled}
            onClick={onCountryAssign}
            data-test-id="assign-country"
            variant="secondary"
          >
            <FormattedMessage id="zZCCqz" defaultMessage="Assign countries" description="button" />
          </Button>
        </DashboardCard.Toolbar>
      </DashboardCard.Header>
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
                <ChevronDownIcon
                  data-test-id="countries-drop-down-icon"
                  className={clsx({
                    [classes.rotate]: !isCollapsed,
                  })}
                />
              </IconButton>
            </TableCell>
          </TableRowLink>
          {!isCollapsed && hasCountriesToRender ? (
            Object.keys(groupedCountries).map(letter => {
              const countries = groupedCountries[letter];

              return countries.map((country, countryIndex) => (
                <TableRowLink key={country ? country.code : "skeleton"}>
                  <TableCell className={classes.offsetCell}>
                    {countryIndex === 0 && (
                      <Text color="default2" display="inline-block" left={2} position="absolute">
                        {country.country[0]}
                      </Text>
                    )}
                    {country.country}
                  </TableCell>
                  <TableCell className={clsx(classes.textRight, classes.iconCell)}>
                    <IconButton
                      data-test-id="delete-icon"
                      variant="secondary"
                      disabled={!country || disabled}
                      onClick={() => onCountryUnassign(country.code)}
                    >
                      <Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
                    </IconButton>
                  </TableCell>
                </TableRowLink>
              ));
            })
          ) : (
            <TableRowLink>
              <TableCell className={classes.toLeft} colSpan={2}>
                {emptyText}
              </TableCell>
            </TableRowLink>
          )}
        </TableBody>
      </ResponsiveTable>
    </DashboardCard>
  );
};

export default CountryList;
