import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import makeStyles from "@material-ui/core/styles/makeStyles";

import { SearchPageProps, TabPageProps } from "@saleor/types";
import FilterTabs, { FilterTab } from "../TableFilter";
import Link from "../Link";
import Hr from "../Hr";
import SearchInput from "./SearchInput";

export interface SearchBarProps extends SearchPageProps, TabPageProps {
  allTabLabel: string;
  searchPlaceholder: string;
}

const useStyles = makeStyles(
  theme => ({
    root: {
      display: "flex",
      flexWrap: "wrap",
      padding: theme.spacing(1, 3)
    },
    tabActions: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      padding: theme.spacing(1, 3, 2),
      textAlign: "right"
    }
  }),
  {
    name: "SearchBar"
  }
);

const SearchBar: React.FC<SearchBarProps> = props => {
  const {
    allTabLabel,
    currentTab,
    initialSearch,
    onSearchChange,
    searchPlaceholder,
    tabs,
    onAll,
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
        <SearchInput
          initialSearch={initialSearch}
          placeholder={searchPlaceholder}
          onSearchChange={onSearchChange}
        />
      </div>
      {displayTabAction === null ? (
        <Hr />
      ) : (
        <div className={classes.tabActions}>
          {displayTabAction === "save" ? (
            <Link onClick={onTabSave}>
              <FormattedMessage
                defaultMessage="Save Custom Search"
                description="button"
              />
            </Link>
          ) : (
            displayTabAction === "delete" && (
              <Link onClick={onTabDelete}>
                <FormattedMessage
                  defaultMessage="Delete Search"
                  description="button"
                />
              </Link>
            )
          )}
        </div>
      )}
    </>
  );
};

SearchBar.displayName = "SearchBar";
export default SearchBar;
