import { InputAdornment, TextField, TextFieldProps } from "@material-ui/core";
import { InputProps } from "@material-ui/core/Input";
import { FormChange } from "@saleor/hooks/useForm";
import { makeStyles } from "@saleor/macaw-ui";
import React, { useMemo } from "react";
import { FormattedMessage } from "react-intl";

import { SEPARATOR_CHARACTERS } from "./consts";
import { findPriceSeparator, getCurrencyDecimalPoints } from "./utils";

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
    inputProps,
  } = props;

  const classes = useStyles(props);
  const minValue = 0;

  const maxDecimalLength = useMemo(
    () => getCurrencyDecimalPoints(currencySymbol),
    [currencySymbol],
  );

  const handleChange: FormChange = e => {
    let value = e.target.value;
    const splitCharacter = findPriceSeparator(value);
    const [integerPart, decimalPart] = value.split(splitCharacter);

    if (maxDecimalLength === 0 && decimalPart) {
      // this shouldn't happen - decimal character should be ignored
      value = integerPart;
    }

    if (decimalPart?.length > maxDecimalLength) {
      const shortenedDecimalPart = decimalPart.slice(0, maxDecimalLength);
      value = `${integerPart}${splitCharacter}${shortenedDecimalPart}`;
    }

    onChange({
      target: {
        name: e.target.name,
        value,
      },
    });
  };

  const handleKeyPress: TextFieldProps["onKeyDown"] = e => {
    // disallow entering e (exponent)
    if (e.key === "e" || e.key === "E") {
      e.preventDefault();
    }
    // ignore separator input when currency doesn't support decimal values
    if (
      maxDecimalLength === 0 &&
      SEPARATOR_CHARACTERS.some(separator => e.key === separator)
    ) {
      e.preventDefault();
    }
  };

  return (
    <TextField
      className={className}
      error={error || value < minValue}
      helperText={
        hint ? (
          hint
        ) : value < minValue ? (
          <FormattedMessage
            id="WHkx+F"
            defaultMessage="Price cannot be lower than 0"
          />
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
          step: 1 / Math.pow(10, maxDecimalLength),
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
      onChange={handleChange}
      onKeyDown={handleKeyPress}
    />
  );
};
PriceField.defaultProps = {
  name: "price",
};

PriceField.displayName = "PriceField";
export default PriceField;
