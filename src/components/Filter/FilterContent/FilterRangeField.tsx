import { TextField } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";

import { FilterReducerAction } from "../reducer";
import { FieldType, IFilterElement } from "../types";
import useStyles from "./styles";
import { filterTestingContext } from "./utils";

export interface FilterRangeFieldProps {
  currencySymbol: string;
  filter: IFilterElement;
  onFilterPropertyChange: React.Dispatch<FilterReducerAction<string>>;
}

const FilterRangeField: React.FC<FilterRangeFieldProps> = ({
  currencySymbol,
  filter,
  onFilterPropertyChange
}) => {
  const classes = useStyles();

  return (
    <>
      <TextField
        data-test={filterTestingContext}
        data-test-id={filter.name}
        data-test-range-type="min"
        fullWidth
        name={filter.name + "_min"}
        InputProps={{
          classes: {
            input: classes.fieldInput
          },
          endAdornment: filter.type === FieldType.price && currencySymbol,
          type: filter.type === FieldType.date ? "date" : "number"
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
      <span className={classes.andLabel}>
        <FormattedMessage
          defaultMessage="and"
          description="filter range separator"
        />
      </span>
      <TextField
        data-test={filterTestingContext}
        data-test-id={filter.name}
        data-test-range-type="max"
        fullWidth
        name={filter.name + "_max"}
        InputProps={{
          classes: {
            input: classes.fieldInput
          },
          endAdornment: filter.type === FieldType.price && currencySymbol,
          type: filter.type === FieldType.date ? "date" : "number"
        }}
        value={filter.value[1]}
        onChange={event =>
          onFilterPropertyChange({
            payload: {
              name: filter.name,
              update: {
                value: [filter.value[0], event.target.value]
              }
            },
            type: "set-property"
          })
        }
      />
    </>
  );
};
FilterRangeField.displayName = "FilterRangeField";
export default FilterRangeField;
