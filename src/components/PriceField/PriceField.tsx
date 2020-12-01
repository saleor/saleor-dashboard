import { InputProps } from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    currencySymbol: {
      fontSize: "0.875rem"
    },
    inputContainer: {
      display: "grid",
      gridTemplateColumns: "1fr 2rem 1fr"
    },
    pullDown: {
      marginTop: theme.spacing(2)
    },
    separator: {
      marginTop: theme.spacing(3),
      textAlign: "center",
      width: "100%"
    },
    widgetContainer: {
      marginTop: theme.spacing(2)
    }
  }),
  { name: "PriceField" }
);

interface PriceFieldProps {
  className?: string;
  currencySymbol?: string;
  disabled?: boolean;
  error?: boolean;
  hint?: string;
  label?: string;
  name?: string;
  value?: string | number;
  InputProps?: InputProps;
  inputProps?: InputProps["inputProps"];
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
    onChange,
    required,
    value,
    InputProps,
    inputProps
  } = props;

  const classes = useStyles(props);
  const minValue = 0;
  return (
    <TextField
      className={className}
      error={error || value < minValue}
      helperText={
        hint ? (
          hint
        ) : value < minValue ? (
          <FormattedMessage defaultMessage="Price cannot be lower than 0" />
        ) : (
          ""
        )
      }
      label={label}
      fullWidth
      value={value}
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
          ...InputProps?.inputProps
        },
        type: "number"
      }}
      inputProps={{
        min: minValue,
        type: "number",
        ...inputProps
      }}
      name={name}
      disabled={disabled}
      required={required}
      onChange={onChange}
    />
  );
};
PriceField.defaultProps = {
  name: "price"
};

PriceField.displayName = "PriceField";
export default PriceField;
