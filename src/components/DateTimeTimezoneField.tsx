import { TextField } from "@material-ui/core";
import { TextFieldProps } from "@material-ui/core/TextField";
import { commonMessages } from "@saleor/intl";
import { DateTime, joinDateTime, splitDateTime } from "@saleor/misc";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

type DateTimeFieldProps = Omit<TextFieldProps, "label" | "error"> & {
  onChange: (value: string) => void;
  error: boolean;
  setError?: () => void;
  futureDatesOnly?: boolean;
  value: string;
};

export const DateTimeTimezoneField: React.FC<DateTimeFieldProps> = ({
  disabled,
  name,
  onChange,
  futureDatesOnly,
  error,
  fullWidth,
  value: initialValue
}) => {
  const intl = useIntl();
  const [value, setValue] = useState<DateTime>(
    initialValue ? splitDateTime(initialValue) : { date: "", time: "" }
  );

  useEffect(() => {
    const newDate = joinDateTime(value.date, value.time);
    onChange(newDate);
  }, [value]);

  return (
    <>
      <TextField
        fullWidth={fullWidth}
        disabled={disabled}
        error={!!error}
        label={intl.formatMessage(commonMessages.date)}
        name={`${name}:date`}
        onChange={event => {
          const date = event.target.value;
          setValue(value => ({ ...value, date }));
        }}
        type="date"
        value={value.date}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        fullWidth={fullWidth}
        disabled={disabled}
        error={!!error}
        label={intl.formatMessage(commonMessages.time)}
        name={`${name}:time`}
        onChange={event => {
          const time = event.target.value;
          setValue(value => ({ ...value, time }));
        }}
        type="time"
        value={value.time}
        InputLabelProps={{ shrink: true }}
      />

      {error && futureDatesOnly && (
        <div>Preorder end time needs to be set in the future</div>
      )}
    </>
  );
};
