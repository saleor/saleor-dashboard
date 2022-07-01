import {
  FilledInput,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import { SelectProps } from "@material-ui/core/Select";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

import Checkbox from "../Checkbox";

const useStyles = makeStyles(
  theme => ({
    checkbox: {
      marginRight: theme.spacing(-2),
    },
    formControl: {
      width: "100%",
    },
    menuItem: {
      alignItems: "center",
      display: "flex",
      justifyContent: "space-between",
      width: "100%",
    },
  }),
  { name: "MultiSelectField" },
);

interface MultiSelectFieldProps {
  choices: Array<{
    value: string;
    label: string;
  }>;
  disabled?: boolean;
  error?: boolean;
  hint?: string;
  label?: string;
  name?: string;
  selectProps?: SelectProps;
  value?: string[];
  onChange(event: any);
}

export const MultiSelectField: React.FC<MultiSelectFieldProps> = props => {
  const {
    disabled,
    error,
    label,
    choices,
    value,
    onChange,
    name,
    hint,
    selectProps,
  } = props;
  const classes = useStyles(props);

  const choicesByKey = disabled
    ? {}
    : choices.reduce((prev, curr) => {
        prev[curr.value] = curr.label;
        return prev;
      }, {});

  return (
    <FormControl
      className={classes.formControl}
      error={error}
      disabled={disabled}
    >
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        multiple
        fullWidth
        renderValue={choiceValues =>
          (choiceValues as string[])
            .map(choiceValue => choicesByKey[choiceValue])
            .join(", ")
        }
        value={value}
        name={name}
        onChange={onChange}
        input={<FilledInput name={name} />}
        {...selectProps}
      >
        {choices.length > 0 ? (
          choices.map(choice => {
            const isSelected = !!value.find(
              selectedChoice => selectedChoice === choice.value,
            );

            return (
              <MenuItem value={choice.value} key={choice.value}>
                <div className={classes.menuItem}>
                  <span>{choice.label}</span>
                  <Checkbox
                    className={classes.checkbox}
                    checked={isSelected}
                    disableRipple={true}
                    disableTouchRipple={true}
                  />
                </div>
              </MenuItem>
            );
          })
        ) : (
          <MenuItem disabled={true}>
            <FormattedMessage id="hX5PAb" defaultMessage="No results found" />
          </MenuItem>
        )}
      </Select>
      {hint && <FormHelperText>{hint}</FormHelperText>}
    </FormControl>
  );
};
MultiSelectField.defaultProps = {
  value: [],
};

MultiSelectField.displayName = "MultiSelectField";
export default MultiSelectField;
