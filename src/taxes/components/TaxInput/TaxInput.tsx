import { InputAdornment, TextField } from "@material-ui/core";
import { FormChange } from "@saleor/hooks/useForm";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

interface TaxInputProps {
  placeholder: number;
  value: string;
  change: FormChange;
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
  change
}) => {
  const classes = useStyles();

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
      onChange={change}
    />
  );
};

export default TaxInput;
