import { InputAdornment, TextField } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

interface TaxInputProps {
  placeholder: number;
  value: string;
  setVal: (val: any) => void;
}

const useStyles = makeStyles(
  () => ({
    hideSpinboxes: {
      // chrome, safari
      "& input::-webkit-outer-spin-button, input::-webkit-inner-spin-button": {
        appearance: "none",
        margin: 0
      },
      // firefox
      "& input": {
        "-moz-appearance": "textfield"
      }
    },
    inputPadding: {
      padding: "16px 0 16px 0"
    }
  }),
  { name: "TaxInput" }
);

export const TaxInput: React.FC<TaxInputProps> = ({
  placeholder,
  value,
  setVal
}) => {
  const classes = useStyles();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) {
      setVal(value);
      return;
    }
    if (parsedValue < 0) {
      setVal("0");
    } else if (parsedValue > 100) {
      setVal("100");
    } else {
      setVal(value);
    }
  };

  return (
    <TextField
      type="number"
      fullWidth
      placeholder={placeholder?.toString()}
      value={value}
      InputProps={{
        startAdornment: <InputAdornment position="start">%</InputAdornment>,
        className: classes.hideSpinboxes
      }}
      inputProps={{ className: classes.inputPadding, min: 0, max: 100 }}
      onChange={handleChange}
    />
  );
};

export default TaxInput;
