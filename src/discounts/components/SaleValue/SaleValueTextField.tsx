import { TextField } from "@material-ui/core";
import { ChannelSaleData } from "@saleor/channels/utils";
import { SaleType } from "@saleor/types/globalTypes";
import React from "react";
import { useState, useEffect } from "react";
import { useIntl } from "react-intl";

interface SaleValueTextFieldProps {
  dataType: SaleType;
  helperText: string;
  disabled: boolean;
  listing: ChannelSaleData;
  onChange: (channelId: string, discountValue: string) => void; // to extract
}

const SaleValueTextField: React.FC<SaleValueTextFieldProps> = ({
  dataType,
  helperText,
  disabled,
  listing,
  onChange
}) => {
  const intl = useIntl();

  const [fixedValue, setFixedValue] = useState("");
  const [percentageValue, setPercentageValue] = useState("");

  const handleChange = (value: string) => {
    onChange(listing.id, value);
  };

  const setCurrentValue = (value: string) => {
    dataType === SaleType.PERCENTAGE
      ? setPercentageValue(value)
      : setFixedValue(value);
  };

  useEffect(() => {
    console.log(dataType);
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
        // console.info(listing.id, e.target.value);
        handleChange(e.target.value);
        setCurrentValue(e.target.value);
      }}
      label={intl.formatMessage({
        defaultMessage: "Discount Value",
        description: "sale discount"
      })}
      value={getTextFieldValue() || ""}
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
