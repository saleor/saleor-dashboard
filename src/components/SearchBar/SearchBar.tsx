import React from "react";
import { useIntl } from "react-intl";

import { SearchPageProps, TabPageProps } from "@saleor/types";
import FilterSearch from "../Filter/FilterSearch";
import FilterTabs, { FilterTab } from "../TableFilter";

export interface SearchBarProps extends SearchPageProps, TabPageProps {
  allTabLabel: string;
  searchPlaceholder: string;
}

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
  const intl = useIntl();

  const isCustom = currentTab === tabs.length + 1;

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
      <FilterSearch
        displaySearchAction={
          !!initialSearch ? (isCustom ? "save" : "delete") : null
        }
        initialSearch={initialSearch}
        searchPlaceholder={searchPlaceholder}
        onSearchChange={onSearchChange}
        onSearchDelete={onTabDelete}
        onSearchSave={onTabSave}
      />
    </>
  );
};

SearchBar.displayName = "SearchBar";
export default SearchBar;
