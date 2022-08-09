import { InputAdornment, TextField } from "@material-ui/core";
import { FormChange } from "@saleor/hooks/useForm";
import React from "react";

import { useStyles } from "./styles";

interface TaxInputProps {
  placeholder: string | undefined;
  value: string | undefined;
  change: FormChange;
}

export const TaxInput: React.FC<TaxInputProps> = ({
  placeholder,
  value,
  change,
}) => {
  const classes = useStyles();

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
      inputProps={{ className: classes.inputPadding, min: 0, max: 100 }}
      onChange={change}
    />
  );
};

export default TaxInput;
