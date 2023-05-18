import { InputAdornment, InputLabelProps, TextField } from "@material-ui/core";
import { InputProps } from "@material-ui/core/Input";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

import { usePriceField } from "./usePriceField";

const useStyles = makeStyles(
  theme => ({
    currencySymbol: {
      fontSize: "0.875rem",
    },
    inputContainer: {
      display: "grid",
      gridTemplateColumns: "1fr 2rem 1fr",
    },
    pullDown: {
      marginTop: theme.spacing(2),
    },
    separator: {
      marginTop: theme.spacing(3),
      textAlign: "center",
      width: "100%",
    },
    widgetContainer: {
      marginTop: theme.spacing(2),
    },
  }),
  { name: "PriceField" },
);

export interface PriceFieldProps {
  className?: string;
  currencySymbol?: string;
  disabled?: boolean;
  error?: boolean;
  hint?: string;
  label?: string;
  name?: string;
  value?: string;
  InputProps?: InputProps;
  inputProps?: InputProps["inputProps"];
  InputLabelProps?: InputLabelProps;
  required?: boolean;
  onChange(event: any);
}

export const PriceField: React.FC<PriceFieldProps> = props => {
  const {
    className,
    disabled,
    error,
    label,
    hint = "",
    currencySymbol,
    name,
    onChange: onChangeBase,
    required,
    value,
    InputProps,
    InputLabelProps,
    inputProps,
  } = props;

  const classes = useStyles(props);
  const { onChange, onKeyDown, minValue, step } = usePriceField(
    currencySymbol,
    onChangeBase,
  );

  return (
    <TextField
      className={className}
      error={error}
      helperText={hint}
      label={label}
      fullWidth
      value={value}
      InputLabelProps={InputLabelProps}
      data-test-id="price-field"
      InputProps={{
        ...InputProps,
        endAdornment: currencySymbol ? (
          <InputAdornment position="end" className={classes.currencySymbol}>
            {currencySymbol}
          </InputAdornment>
        ) : (
          <span />
        ),
        inputProps: {
          min: 0,
          step,
          ...InputProps?.inputProps,
        },
        type: "number",
      }}
      inputProps={{
        min: minValue,
        type: "number",
        ...inputProps,
      }}
      name={name}
      disabled={disabled}
      required={required}
      onChange={onChange}
      onKeyDown={onKeyDown}
    />
  );
};
PriceField.defaultProps = {
  name: "price",
};

PriceField.displayName = "PriceField";
export default PriceField;
