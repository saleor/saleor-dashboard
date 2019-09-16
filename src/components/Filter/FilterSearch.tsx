import { Theme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import { FormattedMessage } from "react-intl";

import { SearchPageProps } from "../../types";
import Debounce from "../Debounce";
import { FilterActionsOnlySearch } from "../Filter/FilterActions";
import Hr from "../Hr";
import Link from "../Link";

export interface FilterSearchProps extends SearchPageProps {
  displaySearchAction: "save" | "delete" | null;
  searchPlaceholder: string;
  onSearchDelete?: () => void;
  onSearchSave?: () => void;
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    tabAction: {
      display: "inline-block"
    },
    tabActionContainer: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      display: "flex",
      justifyContent: "flex-end",
      marginTop: theme.spacing.unit,
      padding: `0 ${theme.spacing.unit * 3}px ${theme.spacing.unit}px`
    }
  }),
  {
    name: "FilterSearch"
  }
);

const FilterSearch: React.FC<FilterSearchProps> = props => {
  const {
    displaySearchAction,
    initialSearch,
    onSearchChange,
    onSearchDelete,
    onSearchSave,
    searchPlaceholder
  } = props;
  const classes = useStyles(props);
  const [search, setSearch] = React.useState(initialSearch);
  React.useEffect(() => setSearch(initialSearch), [initialSearch]);

  return (
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
            {!!displaySearchAction ? (
              <div className={classes.tabActionContainer}>
                <div className={classes.tabAction}>
                  {displaySearchAction === "save" ? (
                    <Link onClick={onSearchSave}>
                      <FormattedMessage
                        defaultMessage="Save Custom Search"
                        description="button"
                      />
                    </Link>
                  ) : (
                    <Link onClick={onSearchDelete}>
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
  );
};

FilterSearch.displayName = "FilterSearch";
export default FilterSearch;
