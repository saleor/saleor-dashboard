import { InputProps } from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import React from "react";

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
  onChange(event: any);
}

export const PriceField: React.FC<PriceFieldProps> = props => {
  const {
    className,
    disabled,
    error,
    label,
    hint,
    currencySymbol,
    name,
    onChange,
    value,
    InputProps
  } = props;

  const classes = useStyles(props);

  return (
    <TextField
      className={className}
      error={error}
      helperText={hint}
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
        type: "number"
      }}
      name={name}
      disabled={disabled}
      onChange={onChange}
    />
  );
};
PriceField.defaultProps = {
  name: "price"
};

PriceField.displayName = "PriceField";
export default PriceField;
