// @ts-strict-ignore
import { commonMessages } from "@dashboard/intl";
import { Box, Input, sprinkles } from "@saleor/macaw-ui-next";
import moment from "moment";
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
  label?: string;
  helperText?: string;
}

const convertToDateTimeLocal = (date: string) => {
  return moment(date).format("YYYY-MM-DDThh:mm");
};

const min = "1970-01-01T00:00";
const max = "2100-01-01T23:59";

const isInputValid = (value: string) => {
  const isValid = moment(value).isValid();
  const isAfterMin = moment(value).isAfter(min);
  const isBeforeMax = moment(value).isBefore(max);

  return isValid && isAfterMin && isBeforeMax;
};

export const DateTimeTimezoneField: React.FC<DateTimeFieldProps> = ({
  disabled,
  name,
  onChange,
  error,
  fullWidth,
  label,
  helperText,
  value: initialValue,
}) => {
  const intl = useIntl();
  const [value, setValue] = useState<string>(
    initialValue ? convertToDateTimeLocal(initialValue) : "",
  );

  useEffect(() => {
    onChange(value);
  }, [value]);

  return (
    <>
      <Box display="flex" gap={4} width="100%">
        <Input
          width={fullWidth ? "100%" : undefined}
          size="small"
          marginRight={3}
          disabled={disabled}
          error={!!error}
          label={label ?? intl.formatMessage(commonMessages.date)}
          name={name}
          onChange={event => {
            const date = event.target.value;

            setValue(date);
          }}
          type="datetime-local"
          value={value}
          helperText={helperText}
          min={min}
          max={max}
          onBlur={() => {
            if (!isInputValid(value)) {
              setValue("");
            }
          }}
        />
      </Box>
      {error && <ErrorNoticeBar className={sprinkles({ marginTop: 3 })} message={error} />}
    </>
  );
};
