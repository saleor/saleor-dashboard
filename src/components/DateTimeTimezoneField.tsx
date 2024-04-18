// @ts-strict-ignore
import { commonMessages } from "@dashboard/intl";
import { DateTime, joinDateTime, splitDateTime } from "@dashboard/misc";
import { Box, Input, sprinkles } from "@saleor/macaw-ui-next";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import ErrorNoticeBar from "./ErrorNoticeBar";

interface DateTimeFieldProps {
  onChange: (value: string) => void;
  error: string | React.ReactNode;
  setError?: () => void;
  futureDatesOnly?: boolean;
  value: string;
  disabled?: boolean;
  fullWidth?: boolean;
  name: string;
}

export const DateTimeTimezoneField: React.FC<DateTimeFieldProps> = ({
  disabled,
  name,
  onChange,
  error,
  fullWidth,
  value: initialValue,
}) => {
  const intl = useIntl();
  const [value, setValue] = useState<DateTime>(
    initialValue ? splitDateTime(initialValue) : { date: "", time: "" },
  );

  useEffect(() => {
    const newDate = joinDateTime(value.date, value.time);
    onChange(newDate);
  }, [value]);

  return (
    <>
      <Box display="flex" gap={5}>
        <Input
          width={fullWidth ? "100%" : undefined}
          size="small"
          marginRight={3}
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
        />

        <Input
          width={fullWidth ? "100%" : undefined}
          size="small"
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
        />
      </Box>
      {error && <ErrorNoticeBar className={sprinkles({ marginTop: 3 })} message={error} />}
    </>
  );
};
