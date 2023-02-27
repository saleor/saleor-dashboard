import { TextField } from "@material-ui/core";
import React from "react";

import { FieldType, FilterFieldBaseProps } from "../types";
import useStyles from "./styles";
import { filterTestingContext } from "./utils";

export type FilterTextFieldProps = FilterFieldBaseProps<
  string,
  FieldType.text | FieldType.price | FieldType.date
> & {
  currencySymbol: string | null;
};
const FilterTextField: React.FC<FilterTextFieldProps> = ({
  currencySymbol,
  filter,
  onFilterPropertyChange,
}) => {
  const classes = useStyles();

  return (
    <TextField
      data-test-id={filterTestingContext + filter.name}
      fullWidth
      name={filter.name}
      InputProps={{
        classes: {
          input: classes.fieldInput,
        },
        endAdornment: filter.type === FieldType.price && currencySymbol,
        type:
          filter.type === FieldType.date
            ? "date"
            : [FieldType.number, FieldType.price].includes(filter.type)
            ? "number"
            : "text",
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
  );
};

FilterTextField.displayName = "FilterTextField";
export default FilterTextField;
