import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import classNames from "classnames";

import { toggle } from "@saleor/utils/lists";
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
  onFilterPropertyChange
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
    <div className={classes.root}>
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
                <Checkbox checked={filterField.value.includes(option.value)} />
              ) : (
                <Radio
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
