import { getErrorMessage } from "@dashboard/components/Attributes/utils";
import {
  PageErrorWithAttributesFragment,
  ProductErrorWithAttributesFragment,
} from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { joinDateTime, splitDateTime } from "@dashboard/misc";
import { TextField } from "@material-ui/core";
import { TextFieldProps } from "@material-ui/core/TextField";
import { Box } from "@saleor/macaw-ui/next";
import React from "react";
import { useIntl } from "react-intl";

type DateTimeFieldProps = Omit<TextFieldProps, "label" | "error"> & {
  onChange: (value: string) => void;
  error: ProductErrorWithAttributesFragment | PageErrorWithAttributesFragment;
  value: string;
};

export const DateTimeField: React.FC<DateTimeFieldProps> = ({
  disabled,
  error,
  name,
  onChange,
  value,
}) => {
  const intl = useIntl();

  const parsedValue = value ? splitDateTime(value) : { date: "", time: "" };

  return (
    <Box display="flex" gap={2}>
      <TextField
        fullWidth
        disabled={disabled}
        error={!!error}
        helperText={getErrorMessage(error, intl)}
        label={intl.formatMessage(commonMessages.date)}
        name={`${name}:date`}
        onChange={event => {
          const date = event.target.value;

          onChange(joinDateTime(date, parsedValue.time));
        }}
        type="date"
        value={parsedValue.date}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        fullWidth
        disabled={disabled}
        error={!!error}
        helperText={getErrorMessage(error, intl)}
        label={intl.formatMessage(commonMessages.time)}
        name={`${name}:time`}
        onChange={event => {
          const time = event.target.value;

          onChange(joinDateTime(parsedValue.date, time));
        }}
        type="time"
        value={parsedValue.time}
        InputLabelProps={{ shrink: true }}
      />
    </Box>
  );
};
