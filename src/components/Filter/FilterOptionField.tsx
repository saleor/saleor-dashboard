import { FormControlLabel, Radio } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { toggle } from "@saleor/utils/lists";
import classNames from "classnames";
import React from "react";

import Checkbox from "../Checkbox";
import { FieldType, FilterFieldBaseProps } from "./types";

const useStyles = makeStyles(
  theme => ({
    option: {
      left: theme.spacing(-0.5),
      position: "relative",
    },
    optionRadio: {
      left: theme.spacing(-0.25),
    },
    root: {},
  }),
  { name: "FilterOptionField" },
);

const FilterOptionField: React.FC<FilterFieldBaseProps<
  string,
  FieldType.options
>> = ({ filter, onFilterPropertyChange, ...rest }) => {
  const classes = useStyles({});
  const handleSelect = (value: string) =>
    onFilterPropertyChange({
      payload: {
        name: filter.name,
        update: {
          active: true,
          value: filter.multiple
            ? toggle(value, filter.value, (a, b) => a === b)
            : [value],
        },
      },
      type: "set-property",
    });

  return (
    <div className={classes.root} {...rest}>
      {filter.options.map(option => (
        <div
          className={classNames(classes.option, {
            [classes.optionRadio]: !filter.multiple,
          })}
          key={option.value}
        >
          <FormControlLabel
            control={
              filter.multiple ? (
                <Checkbox
                  data-test-id={"filter-option-" + option.value}
                  checked={filter.value.includes(option.value)}
                />
              ) : (
                <Radio
                  data-test-id={"filter-option-" + option.value}
                  checked={filter.value[0] === option.value}
                  color="primary"
                />
              )
            }
            label={option.label}
            name={filter.name}
            onChange={() => handleSelect(option.value)}
          />
        </div>
      ))}
    </div>
  );
};

FilterOptionField.displayName = "FilterOptionField";
export default FilterOptionField;
