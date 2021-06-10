import { Checkbox, FormControlLabel } from "@material-ui/core";
import { makeStyles } from "@saleor/theme";
import React from "react";

import { FilterReducerAction } from "../reducer";
import { IFilterElement } from "../types";

const useStyles = makeStyles(
  theme => ({
    container: {
      "&:not(:last-of-type)": {
        borderBottom: `1px solid ${theme.palette.divider}`
      },
      padding: theme.spacing(1, 2.5)
    }
  }),
  { name: "FilterContentBodyNameField" }
);

export interface FilterContentBodyNameFieldProps<T extends string = string> {
  filter: IFilterElement<T>;
  onFilterPropertyChange: React.Dispatch<FilterReducerAction<T>>;
}

const FilterContentBodyNameField: React.FC<FilterContentBodyNameFieldProps> = ({
  filter,
  onFilterPropertyChange
}) => {
  const classes = useStyles({});

  if (!filter) {
    return null;
  }

  return (
    <div className={classes.container}>
      <FormControlLabel
        control={
          <Checkbox
            data-test="filterGroupActive"
            data-test-id={filter.name}
            checked={filter.active}
          />
        }
        label={filter.label}
        onClick={event => event.stopPropagation()}
        onChange={() =>
          onFilterPropertyChange({
            payload: {
              name: filter.name,
              update: {
                active: !filter.active
              }
            },
            type: "set-property"
          })
        }
      />
    </div>
  );
};

export default FilterContentBodyNameField;
