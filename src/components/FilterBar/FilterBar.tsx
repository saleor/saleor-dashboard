import React from "react";
import { useIntl } from "react-intl";

import { FilterProps } from "../../types";
import Debounce from "../Debounce";
import { IFilter } from "../Filter/types";
import FilterTabs, { FilterChips, FilterTab } from "../TableFilter";

export interface FilterBarProps<TKeys = string> extends FilterProps {
  filterMenu: IFilter<TKeys>;
}

const FilterBar: React.FC<FilterBarProps> = ({
  allTabLabel,
  currencySymbol,
  filterLabel,
  filtersList,
  filterMenu,
  currentTab,
  initialSearch,
  searchPlaceholder,
  tabs,
  onAll,
  onSearchChange,
  onFilterAdd,
  onTabChange,
  onTabDelete,
  onTabSave
}) => {
  const intl = useIntl();
  const [search, setSearch] = React.useState(initialSearch);
  React.useEffect(() => setSearch(initialSearch), [currentTab, initialSearch]);

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
      <Debounce debounceFn={onSearchChange}>
        {debounceSearchChange => {
          const handleSearchChange = (event: React.ChangeEvent<any>) => {
            const value = event.target.value;
            setSearch(value);
            debounceSearchChange(value);
          };

          return (
            <FilterChips
              currencySymbol={currencySymbol}
              displayTabAction={
                !!initialSearch ? (isCustom ? "save" : "delete") : null
              }
              menu={filterMenu}
              filtersList={filtersList}
              filterLabel={filterLabel}
              placeholder={searchPlaceholder}
              search={search}
              onSearchChange={handleSearchChange}
              onFilterAdd={onFilterAdd}
              onFilterSave={onTabSave}
              isCustomSearch={isCustom}
              onFilterDelete={onTabDelete}
            />
          );
        }}
      </Debounce>
    </>
  );
};
FilterBar.displayName = "FilterBar";
export default FilterBar;
