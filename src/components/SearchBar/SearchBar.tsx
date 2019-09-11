import { Theme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { SearchPageProps, TabPageProps } from "@saleor/types";
import Debounce from "../Debounce";
import { FilterActionsOnlySearch } from "../Filter/FilterActions";
import Hr from "../Hr";
import Link from "../Link";
import FilterTabs, { FilterTab } from "../TableFilter";

export interface SearchBarProps extends SearchPageProps, TabPageProps {
  allTabLabel: string;
  searchPlaceholder: string;
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    tabAction: {
      display: "inline-block"
    },
    tabActionContainer: {
      borderBottom: "1px solid #e8e8e8",
      display: "flex",
      justifyContent: "flex-end",
      marginTop: theme.spacing.unit,
      padding: `0 ${theme.spacing.unit * 3}px ${theme.spacing.unit}px`
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
  const [search, setSearch] = React.useState(initialSearch);
  const intl = useIntl();
  React.useEffect(() => setSearch(initialSearch), [initialSearch]);

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
            <>
              <FilterActionsOnlySearch
                {...props}
                placeholder={searchPlaceholder}
                search={search}
                onSearchChange={handleSearchChange}
              />
              {!!search || (tabs && tabs.length > 0) ? (
                <div className={classes.tabActionContainer}>
                  <div className={classes.tabAction}>
                    {isCustom ? (
                      <Link onClick={onTabSave}>
                        <FormattedMessage
                          defaultMessage="Save Custom Search"
                          description="button"
                        />
                      </Link>
                    ) : (
                      <Link onClick={onTabDelete}>
                        <FormattedMessage
                          defaultMessage="Delete Search"
                          description="button"
                        />
                      </Link>
                    )}
                  </div>
                </div>
              ) : (
                <Hr />
              )}
            </>
          );
        }}
      </Debounce>
    </>
  );
};

SearchBar.displayName = "SearchBar";
export default SearchBar;
