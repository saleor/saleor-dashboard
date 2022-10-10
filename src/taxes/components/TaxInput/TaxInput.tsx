import { InputAdornment, TextField, TextFieldProps } from "@material-ui/core";
import { findPriceSeparator } from "@saleor/components/PriceField/utils";
import { FormChange } from "@saleor/hooks/useForm";
import React from "react";

import { useStyles } from "./styles";

interface TaxInputProps {
  placeholder?: string;
  value: string | undefined;
  change: FormChange;
}

export const TaxInput: React.FC<TaxInputProps> = ({
  placeholder,
  value,
  change,
}) => {
  const classes = useStyles();

  const handleChange: FormChange = e => {
    let value = e.target.value;
    const splitCharacter = findPriceSeparator(value);
    const [integerPart, decimalPart] = value.split(splitCharacter);

    if (decimalPart?.length > 3) {
      const shortenedDecimalPart = decimalPart.slice(0, 3);
      value = `${integerPart}${splitCharacter}${shortenedDecimalPart}`;
    }

    change({
      target: {
        name: e.target.name,
        value,
      },
    });
  };
  const handleKeyDown: TextFieldProps["onKeyDown"] = e => {
    if (e.key === "e" || e.key === "E") {
      e.preventDefault();
    }
  };

  return (
    <TextField
      type="number"
      fullWidth
      placeholder={placeholder}
      value={value}
      InputProps={{
        startAdornment: <InputAdornment position="start">%</InputAdornment>,
        className: classes.hideSpinboxes,
      }}
      inputProps={{
        className: classes.inputPadding,
        min: 0,
        max: 100,
        step: 0.001,
      }}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  );
};

export default TaxInput;
