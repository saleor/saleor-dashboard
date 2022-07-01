import { Button } from "@saleor/components/Button";
import { makeStyles } from "@saleor/macaw-ui";
import { SearchPageProps, TabPageProps } from "@saleor/types";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import FilterTabs, { FilterTab } from "../TableFilter";
import SearchInput from "./SearchInput";

export interface SearchBarProps extends SearchPageProps, TabPageProps {
  allTabLabel: string;
  searchPlaceholder: string;
}

const useStyles = makeStyles(
  theme => ({
    root: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      display: "flex",
      flexWrap: "wrap",
      padding: theme.spacing(1, 4),
    },
    tabActionButton: {
      marginLeft: theme.spacing(2),
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
  }),
  {
    name: "SearchBar",
  },
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
    onTabSave,
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
              id: "qIgdO6",
              defaultMessage: "Custom Filter",
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
        {displayTabAction &&
          (displayTabAction === "save" ? (
            <Button className={classes.tabActionButton} onClick={onTabSave}>
              <FormattedMessage
                id="DEa1T1"
                defaultMessage="Save Search"
                description="button"
              />
            </Button>
          ) : (
            displayTabAction === "delete" && (
              <Button className={classes.tabActionButton} onClick={onTabDelete}>
                <FormattedMessage
                  id="QCwBUI"
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

SearchBar.displayName = "SearchBar";
export default SearchBar;
