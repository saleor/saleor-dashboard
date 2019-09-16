import ButtonBase from "@material-ui/core/ButtonBase";
import { Theme } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import Typography from "@material-ui/core/Typography";
import ClearIcon from "@material-ui/icons/Clear";
import { makeStyles, useTheme } from "@material-ui/styles";
import React from "react";
import { FormattedMessage } from "react-intl";

import Filter from "../Filter";
import FilterActions, { FilterActionsProps } from "../Filter/FilterActions";
import Hr from "../Hr";
import Link from "../Link";

export interface Filter {
  label: string;
  onClick: () => void;
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    filterButton: {
      alignItems: "center",
      backgroundColor: fade(theme.palette.primary.main, 0.8),
      borderRadius: "19px",
      display: "flex",
      height: "38px",
      justifyContent: "space-around",
      margin: `0 ${theme.spacing.unit * 2}px ${theme.spacing.unit}px`,
      marginLeft: 0,
      padding: `0 ${theme.spacing.unit * 2}px`
    },
    filterChipContainer: {
      display: "flex",
      flex: 1,
      flexWrap: "wrap"
    },
    filterContainer: {
      "& a": {
        paddingBottom: 10
      },
      borderBottom: `1px solid ${theme.palette.divider}`,
      display: "flex",
      marginTop: theme.spacing.unit,
      padding: `0 ${theme.spacing.unit * 3}px ${theme.spacing.unit}px`
    },
    filterIcon: {
      color: theme.palette.common.white,
      height: 16,
      width: 16
    },
    filterIconContainer: {
      WebkitAppearance: "none",
      background: "transparent",
      border: "none",
      borderRadius: "100%",
      cursor: "pointer",
      height: 32,
      marginRight: -13,
      padding: 8,
      width: 32
    },
    filterLabel: {
      marginBottom: theme.spacing.unit
    },
    filterText: {
      color: theme.palette.common.white,
      fontSize: 14,
      fontWeight: 400 as 400,
      lineHeight: "38px"
    }
  }),
  {
    name: "FilterChips"
  }
);

interface FilterChipProps extends FilterActionsProps {
  displayTabAction: "save" | "delete" | null;
  filtersList: Filter[];
  search: string;
  isCustomSearch: boolean;
  onFilterDelete: () => void;
  onFilterSave: () => void;
}

export const FilterChips: React.FC<FilterChipProps> = ({
  currencySymbol,
  displayTabAction,
  filtersList,
  menu,
  filterLabel,
  placeholder,
  onSearchChange,
  search,
  onFilterAdd,
  onFilterSave,
  onFilterDelete
}) => {
  const theme = useTheme();
  const classes = useStyles({ theme });

  return (
    <>
      <FilterActions
        currencySymbol={currencySymbol}
        menu={menu}
        filterLabel={filterLabel}
        placeholder={placeholder}
        search={search}
        onSearchChange={onSearchChange}
        onFilterAdd={onFilterAdd}
      />
      {search || (filtersList && filtersList.length > 0) ? (
        <div className={classes.filterContainer}>
          <div className={classes.filterChipContainer}>
            {filtersList.map(filter => (
              <div className={classes.filterButton} key={filter.label}>
                <Typography className={classes.filterText}>
                  {filter.label}
                </Typography>
                <ButtonBase
                  className={classes.filterIconContainer}
                  onClick={filter.onClick}
                >
                  <ClearIcon className={classes.filterIcon} />
                </ButtonBase>
              </div>
            ))}
          </div>
          {displayTabAction === "save" ? (
            <Link onClick={onFilterSave}>
              <FormattedMessage
                defaultMessage="Save Custom Search"
                description="button"
              />
            </Link>
          ) : (
            displayTabAction === "delete" && (
              <Link onClick={onFilterDelete}>
                <FormattedMessage
                  defaultMessage="Delete Search"
                  description="button"
                />
              </Link>
            )
          )}
        </div>
      ) : (
        <Hr />
      )}
    </>
  );
};

export default FilterChips;
