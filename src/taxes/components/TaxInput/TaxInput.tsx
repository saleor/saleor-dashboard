import { InputAdornment, TextField } from "@material-ui/core";
import {
  IconButton,
  makeStyles,
  MinusSmallIcon,
  PlusSmallIcon
} from "@saleor/macaw-ui";
import React from "react";

interface TaxInputProps {
  placeholder: number;
  value: number;
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
        appearence: "textfield"
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
  return (
    <TextField
      type="number"
      placeholder={placeholder?.toString()}
      value={value}
      InputProps={{
        startAdornment: <InputAdornment position="start">%</InputAdornment>,
        endAdornment: (
          <InputAdornment position="end">
            <IconButton variant="secondary" onClick={() => setVal(value - 1)}>
              <MinusSmallIcon />
            </IconButton>
            <IconButton variant="secondary" onClick={() => setVal(value + 1)}>
              <PlusSmallIcon />
            </IconButton>
          </InputAdornment>
        ),
        className: classes.hideSpinboxes
      }}
      inputProps={{ className: classes.inputPadding }}
      onChange={e => setVal(e.target.value)}
    />
  );
};

export default TaxInput;
