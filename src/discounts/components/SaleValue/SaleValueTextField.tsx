import { TextField } from "@material-ui/core";
import { SaleType } from "@saleor/graphql";
import React from "react";
import { useIntl } from "react-intl";

import { ChannelSaleFormData } from "../SaleDetailsPage";
import { SaleValueInputOnChangeType } from "./types";

interface SaleValueTextFieldProps {
  dataType: SaleType;
  helperText: string;
  disabled: boolean;
  error: boolean;
  listing: ChannelSaleFormData;
  onChange: SaleValueInputOnChangeType;
}

const SaleValueTextField: React.FC<SaleValueTextFieldProps> = ({
  dataType,
  helperText,
  disabled,
  error,
  listing,
  onChange,
}) => {
  const intl = useIntl();

  const { id, percentageValue, fixedValue } = listing;

  const getTextFieldValue = (dataType: SaleType) =>
    dataType === SaleType.PERCENTAGE ? percentageValue : fixedValue;

  return (
    <TextField
      disabled={disabled}
      helperText={helperText || ""}
      error={error}
      name="value"
      onChange={e => {
        onChange(id, e.target.value);
      }}
      label={intl.formatMessage({
        id: "x3g4Ry",
        defaultMessage: "Discount Value",
        description: "sale discount",
      })}
      value={getTextFieldValue(dataType) || ""}
      type="number"
      fullWidth
      inputProps={{
        min: 0,
      }}
      InputProps={{
        endAdornment: dataType === SaleType.FIXED ? listing.currency : "%",
      }}
    />
  );
};

export default SaleValueTextField;
