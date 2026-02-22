import { formatPercentInput } from "@dashboard/components/PriceField/utils";
import { FormChange } from "@dashboard/hooks/useForm";
import { InputAdornment, TextField } from "@material-ui/core";

import { useStyles } from "./styles";

interface TaxInputProps {
  placeholder?: string;
  value: string | undefined;
  change: FormChange;
}

const TaxInput = ({ placeholder, value, change }: TaxInputProps) => {
  const classes = useStyles();

  const handleChange: FormChange = e => {
    const formatted = formatPercentInput(String(e.target.value ?? ""));

    change({
      target: {
        name: e.target.name,
        value: formatted || null,
      },
    });
  };

  return (
    <TextField
      data-test-id="tax-input"
      type="text"
      inputMode="decimal"
      autoComplete="off"
      fullWidth
      placeholder={placeholder}
      value={value ?? ""}
      InputProps={{
        startAdornment: <InputAdornment position="start">%</InputAdornment>,
      }}
      inputProps={{
        className: classes.inputPadding,
      }}
      onChange={handleChange}
    />
  );
};

export { TaxInput };
