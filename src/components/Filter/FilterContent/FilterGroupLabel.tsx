import { Checkbox, FormControlLabel } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

import { FilterFieldBaseProps } from "../types";

const useStyles = makeStyles(
  theme => ({
    container: {
      "&:not(:last-of-type)": {
        borderBottom: `1px solid ${theme.palette.divider}`,
      },
      padding: theme.spacing(1, 2.5),
    },
  }),
  { name: "FilterGroupLabel" },
);

export type FilterGroupLabelProps<
  K extends string = string
> = FilterFieldBaseProps<K>;

const FilterGroupLabel: React.FC<FilterGroupLabelProps> = ({
  filter,
  onFilterPropertyChange,
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

export default FilterGroupLabel;
