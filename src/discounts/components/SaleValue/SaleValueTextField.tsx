import { TextField } from "@material-ui/core";
import { ChannelSaleData } from "@saleor/channels/utils";
import { SaleType } from "@saleor/types/globalTypes";
import React from "react";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { SaleValueInputChangeType } from "./types";

interface SaleValueTextFieldProps {
  dataType: keyof typeof SaleType;
  helperText: string;
  disabled: boolean;
  listing: ChannelSaleData;
  onChange: SaleValueInputChangeType;
}

const SaleValueTextField: React.FC<SaleValueTextFieldProps> = ({
  dataType,
  helperText,
  disabled,
  listing,
  onChange
}) => {
  const intl = useIntl();

  const [fixedValue, setFixedValue] = useState(
    dataType === SaleType.FIXED ? listing.discountValue : ""
  );
  const [percentageValue, setPercentageValue] = useState(
    dataType === SaleType.PERCENTAGE ? listing.discountValue : ""
  );

  const handleChange = (value: string) => {
    onChange(listing.id, value);
  };

  const setCurrentValue = (value: string) => {
    if (dataType === SaleType.PERCENTAGE) {
      setPercentageValue(value);
    } else {
      setFixedValue(value);
    }
  };

  useEffect(() => {
    if (dataType === SaleType.PERCENTAGE) {
      handleChange(percentageValue);
    } else {
      handleChange(fixedValue);
    }
  }, [dataType]);

  const getTextFieldValue = () =>
    dataType === SaleType.PERCENTAGE ? percentageValue : fixedValue;

  return (
    <TextField
      disabled={disabled}
      helperText={helperText || ""}
      name="value"
      onChange={e => {
        handleChange(e.target.value);
        setCurrentValue(e.target.value);
      }}
      label={intl.formatMessage({
        defaultMessage: "Discount Value",
        description: "sale discount"
      })}
      value={getTextFieldValue()}
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
