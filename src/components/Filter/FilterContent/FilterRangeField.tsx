import { TextField } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";

import { FieldType, FilterFieldBaseProps } from "../types";
import useStyles from "./styles";
import { filterTestingContext } from "./utils";

export type FilterRangeFieldProps = FilterFieldBaseProps<
  string,
  FieldType.price | FieldType.date
> & {
  currencySymbol: string;
};

const FilterRangeField: React.FC<FilterRangeFieldProps> = ({
  currencySymbol,
  filter,
  onFilterPropertyChange,
}) => {
  const classes = useStyles();

  return (
    <>
      <TextField
        data-test-id={filterTestingContext + filter.name}
        data-test-range-type="min"
        fullWidth
        name={filter.name + "_min"}
        InputProps={{
          classes: {
            input: classes.fieldInput,
          },
          endAdornment: filter.type === FieldType.price && currencySymbol,
          type: filter.type === FieldType.date ? "date" : "number",
        }}
        value={filter.value[0]}
        onChange={event =>
          onFilterPropertyChange({
            payload: {
              name: filter.name,
              update: {
                value: [event.target.value, filter.value[1]],
              },
            },
            type: "set-property",
          })
        }
      />
      <span className={classes.andLabel}>
        <FormattedMessage
          id="34F7Jk"
          defaultMessage="and"
          description="filter range separator"
        />
      </span>
      <TextField
        data-test-id={filterTestingContext + filter.name}
        data-test-range-type="max"
        fullWidth
        name={filter.name + "_max"}
        InputProps={{
          classes: {
            input: classes.fieldInput,
          },
          endAdornment: filter.type === FieldType.price && currencySymbol,
          type: filter.type === FieldType.date ? "date" : "number",
        }}
        value={filter.value[1]}
        onChange={event =>
          onFilterPropertyChange({
            payload: {
              name: filter.name,
              update: {
                value: [filter.value[0], event.target.value],
              },
            },
            type: "set-property",
          })
        }
      />
    </>
  );
};
FilterRangeField.displayName = "FilterRangeField";
export default FilterRangeField;
