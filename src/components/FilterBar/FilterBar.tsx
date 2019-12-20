import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";

import { FilterProps } from "../../types";
import { IFilter } from "../Filter/types";
import FilterTabs, { FilterTab } from "../TableFilter";
import { SearchBarProps } from "../SearchBar";
import SearchInput from "../SearchBar/SearchInput";
import Filter from "../Filter";

export interface FilterBarProps<TKeys extends string = string>
  extends FilterProps<TKeys>,
    SearchBarProps {
  filterStructure: IFilter<TKeys>;
}

const useStyles = makeStyles(
  theme => ({
    root: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      display: "flex",
      flexWrap: "wrap",
      padding: theme.spacing(1, 3)
    },
    tabActionButton: {
      marginLeft: theme.spacing(2),
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3)
    }
  }),
  {
    name: "FilterBar"
  }
);

const FilterBar: React.FC<FilterBarProps> = props => {
  const {
    allTabLabel,
    currencySymbol,
    filterStructure,
    currentTab,
    initialSearch,
    searchPlaceholder,
    tabs,
    onAll,
    onSearchChange,
    onFilterChange,
    onTabChange,
    onTabDelete,
    onTabSave
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  const isCustom = currentTab === tabs.length + 1;
  const displayTabAction = isCustom
    ? "save"
    : currentTab === 0
    ? null
    : "delete";

  return (
    <>
      <FilterTabs currentTab={currentTab}>
        <FilterTab label={allTabLabel} onClick={onAll} />
        {tabs.map((tab, tabIndex) => (
          <FilterTab
            onClick={() => onTabChange(tabIndex + 1)}
            label={tab}
            key={tabIndex}
          />
        ))}
        {isCustom && (
          <FilterTab
            onClick={() => undefined}
            label={intl.formatMessage({
              defaultMessage: "Custom Filter"
            })}
          />
        )}
      </FilterTabs>
      <div className={classes.root}>
        <Filter
          currencySymbol={currencySymbol}
          menu={filterStructure}
          onFilterAdd={onFilterChange}
        />
        <SearchInput
          initialSearch={initialSearch}
          placeholder={searchPlaceholder}
          onSearchChange={onSearchChange}
        />
        {displayTabAction &&
          (displayTabAction === "save" ? (
            <Button
              className={classes.tabActionButton}
              color="primary"
              onClick={onTabSave}
            >
              <FormattedMessage
                defaultMessage="Save Search"
                description="button"
              />
            </Button>
          ) : (
            displayTabAction === "delete" && (
              <Button
                className={classes.tabActionButton}
                color="primary"
                onClick={onTabDelete}
              >
                <FormattedMessage
                  defaultMessage="Delete Search"
                  description="button"
                />
              </Button>
            )
          ))}
      </div>
    </>
  );
};
FilterBar.displayName = "FilterBar";
export default FilterBar;
