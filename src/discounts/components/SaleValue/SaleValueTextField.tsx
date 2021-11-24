import { TextField } from "@material-ui/core";
import { SaleType } from "@saleor/types/globalTypes";
import React from "react";
import { useIntl } from "react-intl";

import { ChannelSaleFormData } from "../SaleDetailsPage";
import { SaleValueInputOnChangeType } from "./types";

interface SaleValueTextFieldProps {
  dataType: SaleType;
  helperText: string;
  disabled: boolean;
  listing: ChannelSaleFormData;
  onChange: SaleValueInputOnChangeType;
}

const SaleValueTextField: React.FC<SaleValueTextFieldProps> = ({
  dataType,
  helperText,
  disabled,
  listing,
  onChange
}) => {
  const intl = useIntl();

  const { id, percentageValue, fixedValue } = listing;

  const getTextFieldValue = (dataType: SaleType) =>
    dataType === SaleType.PERCENTAGE ? percentageValue : fixedValue;

  return (
    <TextField
      disabled={disabled}
      helperText={helperText || ""}
      name="value"
      onChange={e => {
        onChange(id, e.target.value);
      }}
      label={intl.formatMessage({
        defaultMessage: "Discount Value",
        description: "sale discount"
      })}
      value={getTextFieldValue(dataType) || ""}
      type="number"
      fullWidth
      inputProps={{
        min: 0
      }}
      InputProps={{
        endAdornment: dataType === SaleType.FIXED ? listing.currency : "%"
      }}
    />
  );
};

export default SaleValueTextField;
