import { TextField } from "@material-ui/core";
import React from "react";

import { FilterReducerAction } from "../reducer";
import { FieldType, IFilterElement } from "../types";
import useStyles from "./styles";
import { filterTestingContext } from "./utils";

export interface FilterTextFieldProps {
  currencySymbol: string | null;
  filter: IFilterElement;
  onFilterPropertyChange: React.Dispatch<FilterReducerAction<string>>;
}

const FilterTextField: React.FC<FilterTextFieldProps> = ({
  currencySymbol,
  filter,
  onFilterPropertyChange
}) => {
  const classes = useStyles();

  return (
    <TextField
      data-test={filterTestingContext}
      data-test-id={filter.name}
      fullWidth
      name={filter.name}
      InputProps={{
        classes: {
          input: classes.fieldInput
        },
        endAdornment: filter.type === FieldType.price && currencySymbol,
        type:
          filter.type === FieldType.date
            ? "date"
            : [FieldType.number, FieldType.price].includes(filter.type)
            ? "number"
            : "text"
      }}
      value={filter.value[0]}
      onChange={event =>
        onFilterPropertyChange({
          payload: {
            name: filter.name,
            update: {
              value: [event.target.value, filter.value[1]]
            }
          },
          type: "set-property"
        })
      }
    />
  );
};

FilterTextField.displayName = "FilterTextField";
export default FilterTextField;
