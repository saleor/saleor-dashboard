import { Theme } from "@material-ui/core/styles";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/styles";
import React from "react";

import { FilterContentSubmitData, IFilter } from "../Filter";
import Filter from "./Filter";

const useInputStyles = makeStyles({
  input: {
    padding: "10px 12px"
  },
  root: {
    flex: 1
  }
});

const Search: React.FC<TextFieldProps> = props => {
  const classes = useInputStyles({});
  return (
    <TextField
      {...props}
      className={classes.root}
      inputProps={{
        className: classes.input
      }}
    />
  );
};

const useStyles = makeStyles(
  (theme: Theme) => ({
    actionContainer: {
      display: "flex",
      flexWrap: "wrap",
      padding: `${theme.spacing.unit * 1.5}px ${theme.spacing.unit * 3}px ${
        theme.spacing.unit
      }px`
    }
  }),
  {
    name: "FilterActions"
  }
);

export interface FilterActionsPropsSearch {
  placeholder: string;
  search: string;
  onSearchChange: (event: React.ChangeEvent<any>) => void;
}
export interface FilterActionsPropsFilters<TKeys = string> {
  currencySymbol: string;
  menu: IFilter<TKeys>;
  filterLabel: string;
  onFilterAdd: (filter: FilterContentSubmitData<TKeys>) => void;
}

export const FilterActionsOnlySearch: React.FC<
  FilterActionsPropsSearch
> = props => {
  const { onSearchChange, placeholder, search } = props;
  const classes = useStyles(props);

  return (
    <div className={classes.actionContainer}>
      <Search
        fullWidth
        placeholder={placeholder}
        value={search}
        onChange={onSearchChange}
      />
    </div>
  );
};

export type FilterActionsProps = FilterActionsPropsSearch &
  FilterActionsPropsFilters;
const FilterActions: React.FC<FilterActionsProps> = props => {
  const {
    currencySymbol,
    filterLabel,
    menu,
    onFilterAdd,
    onSearchChange,
    placeholder,
    search
  } = props;
  const classes = useStyles(props);

  return (
    <div className={classes.actionContainer}>
      <Filter
        currencySymbol={currencySymbol}
        menu={menu}
        filterLabel={filterLabel}
        onFilterAdd={onFilterAdd}
      />
      <Search
        fullWidth
        placeholder={placeholder}
        value={search}
        onChange={onSearchChange}
      />
    </div>
  );
};

FilterActions.displayName = "FilterActions";
export default FilterActions;
