import { Checkbox, FormControlLabel } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

import { FilterElement } from "../types";
import { FilterDispatchFunction } from "../useFilter";

const useStyles = makeStyles(
  theme => ({
    container: {
      "&:not(:last-of-type)": {
        borderBottom: `1px solid ${theme.palette.divider}`,
      },
      padding: theme.spacing(1, 2.5),
    },
  }),
  { name: "FilterContentBodyNameField" },
);

export interface FilterContentBodyNameFieldProps<K extends string = string> {
  filter: FilterElement<K>;
  onFilterPropertyChange: FilterDispatchFunction<K>;
}

const FilterContentBodyNameField: React.FC<FilterContentBodyNameFieldProps> = ({
  filter,
  onFilterPropertyChange,
}) => {
  const classes = useStyles({});

  return (
    <div className={classes.container}>
      <FormControlLabel
        control={
          <Checkbox
            data-test-id={"filter-group-active-" + filter.name}
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
                active: !filter.active,
              },
            },
            type: "set-property",
          })
        }
      />
    </div>
  );
};

export default FilterContentBodyNameField;
