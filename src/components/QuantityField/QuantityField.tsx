import { InputAdornment, TextField } from "@material-ui/core";
import { InputProps } from "@material-ui/core/Input";
import classNames from "classnames";
import React from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";
import { useStyles } from "./styles";

interface QuantityFieldProps {
  className?: string;
  disabled?: boolean;
  error?: boolean;
  name?: string;
  value?: string | number;
  InputProps?: InputProps;
  inputProps?: InputProps["inputProps"];
  required?: boolean;
  min?: number;
  max?: number;
  onChange(event: any);
}

export const QuantityField: React.FC<QuantityFieldProps> = props => {
  const {
    className,
    disabled,
    value,
    error,
    name,
    onChange,
    required,
    InputProps,
    inputProps,
    min,
    max
  } = props;

  const intl = useIntl();
  const classes = useStyles(props);

  return (
    <TextField
      type="number"
      disabled={disabled}
      className={className}
      name={name}
      required={required}
      inputProps={{
        max: max?.toString(),
        min: min?.toString() || 0,
        ...inputProps,
        className: classNames(classes.innerInput, inputProps?.className),
        style: {
          textAlign: "right",
          ...inputProps?.style
        }
      }}
      fullWidth
      value={value}
      onChange={onChange}
      InputProps={{
        endAdornment: max && (
          <InputAdornment
            position="end"
            className={classNames({ [classes.inputDisabled]: disabled })}
          >
            / {max}
          </InputAdornment>
        ),
        ...InputProps,
        classes: {
          disabled: classes.inputDisabled,
          ...InputProps?.classes
        }
      }}
      error={error}
      helperText={error && intl.formatMessage(messages.improperValue)}
    />
  );
};

QuantityField.displayName = "QuantityField";
export default QuantityField;
