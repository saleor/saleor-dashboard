import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { toggle } from "@saleor/utils/lists";
import classNames from "classnames";
import React from "react";

import Checkbox from "../Checkbox";
import { FilterBaseFieldProps } from "./types";

const useStyles = makeStyles(
  theme => ({
    option: {
      left: -theme.spacing(0.5),
      position: "relative"
    },
    optionRadio: {
      left: -theme.spacing(0.25)
    },
    root: {}
  }),
  { name: "FilterOptionField" }
);

const FilterOptionField: React.FC<FilterBaseFieldProps> = ({
  filterField,
  onFilterPropertyChange,
  ...rest
}) => {
  const classes = useStyles({});
  const handleSelect = (value: string) =>
    onFilterPropertyChange({
      payload: {
        name: filterField.name,
        update: {
          value: filterField.multiple
            ? toggle(value, filterField.value, (a, b) => a === b)
            : [value]
        }
      },
      type: "set-property"
    });

  return (
    <div className={classes.root} {...rest}>
      {filterField.options.map(option => (
        <div
          className={classNames(classes.option, {
            [classes.optionRadio]: !filterField.multiple
          })}
          key={option.value}
        >
          <FormControlLabel
            control={
              filterField.multiple ? (
                <Checkbox
                  data-test="filterOption"
                  data-test-id={option.value}
                  checked={filterField.value.includes(option.value)}
                />
              ) : (
                <Radio
                  data-test="filterOption"
                  data-test-id={option.value}
                  checked={filterField.value[0] === option.value}
                  color="primary"
                />
              )
            }
            label={option.label}
            name={filterField.name}
            onChange={() => handleSelect(option.value)}
          />
        </div>
      ))}
    </div>
  );
};

FilterOptionField.displayName = "FilterOptionField";
export default FilterOptionField;
