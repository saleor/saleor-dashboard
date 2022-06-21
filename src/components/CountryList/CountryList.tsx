import { Card, TableBody, TableCell, TableRow } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { Button } from "@saleor/components/Button";
import CardTitle from "@saleor/components/CardTitle";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import { CountryFragment } from "@saleor/graphql";
import { DeleteIcon, IconButton, makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";
import { FormattedMessage } from "react-intl";

import { getStringOrPlaceholder, maybe, renderCollection } from "../../misc";

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
        paddingRight: theme.spacing(2),
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
  const {
    countries,
    disabled,
    emptyText,
    title,
    onCountryAssign,
    onCountryUnassign,
  } = props;
  const classes = useStyles(props);

  const [isCollapsed, setCollapseStatus] = React.useState(true);
  const toggleCollapse = () => setCollapseStatus(!isCollapsed);

  function sortCountries(countries: CountryFragment[]): CountryFragment[] {
    return [...countries].sort((a, b) => a.country.localeCompare(b.country));
  }

  return (
    <Card>
      <CardTitle
        title={title}
        toolbar={
          <Button
            disabled={disabled}
            onClick={onCountryAssign}
            data-test-id="assign-country"
          >
            <FormattedMessage
              id="zZCCqz"
              defaultMessage="Assign countries"
              description="button"
            />
          </Button>
        }
      />
      <ResponsiveTable>
        <TableBody>
          <TableRow className={classes.pointer} onClick={toggleCollapse}>
            <TableCell
              className={classNames(classes.wideColumn, classes.toLeft)}
            >
              <FormattedMessage
                id="62Ywh2"
                defaultMessage="{number} Countries"
                description="number of countries"
                values={{
                  number: getStringOrPlaceholder(countries?.length.toString()),
                }}
              />
            </TableCell>
            <TableCell
              className={classNames(classes.textRight, classes.iconCell)}
            >
              <IconButton variant="secondary">
                <ArrowDropDownIcon
                  data-test-id="countries-drop-down-icon"
                  className={classNames({
                    [classes.rotate]: !isCollapsed,
                  })}
                />
              </IconButton>
            </TableCell>
          </TableRow>
          {!isCollapsed &&
            renderCollection(
              sortCountries(countries),
              (country, countryIndex) => (
                <TableRow key={country ? country.code : "skeleton"}>
                  <TableCell className={classes.offsetCell}>
                    {maybe<React.ReactNode>(
                      () => (
                        <>
                          {(countryIndex === 0 ||
                            countries[countryIndex].country[0] !==
                              countries[countryIndex - 1].country[0]) && (
                            <span className={classes.indicator}>
                              {country.country[0]}
                            </span>
                          )}
                          {country.country}
                        </>
                      ),
                      <Skeleton />,
                    )}
                  </TableCell>
                  <TableCell
                    className={classNames(classes.textRight, classes.iconCell)}
                  >
                    <IconButton
                      data-test-id="delete-icon"
                      color="primary"
                      disabled={!country || disabled}
                      onClick={() => onCountryUnassign(country.code)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ),
              () => (
                <TableRow>
                  <TableCell className={classes.toLeft} colSpan={2}>
                    {emptyText}
                  </TableCell>
                </TableRow>
              ),
            )}
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};
export default CountryList;
