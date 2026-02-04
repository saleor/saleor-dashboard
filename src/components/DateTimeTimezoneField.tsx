// @ts-strict-ignore
import { commonMessages } from "@dashboard/intl";
import { Box, Input, Text } from "@saleor/macaw-ui-next";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import * as React from "react";
import { useIntl } from "react-intl";

interface DateTimeFieldProps {
  onChange: (value: string) => void;
  error?: string | React.ReactNode | undefined;
  setError?: () => void;
  futureDatesOnly?: boolean;
  value: string;
  disabled?: boolean;
  fullWidth?: boolean;
  name: string;
  label?: string;
  helperText?: string;
}

// Convert ISO string to local datetime string for input[type="datetime-local"]
// This respects the user's browser timezone automatically
const convertToDateTimeLocal = (date: string) => {
  return moment(date).format("YYYY-MM-DDTHH:mm");
};

const min = "1970-01-01T00:00";
const max = "2100-01-01T23:59";

const isInputValid = (value: string) => {
  const isValid = moment(value).isValid();
  const isAfterMin = moment(value).isAfter(min);
  const isBeforeMax = moment(value).isBefore(max);

  return isValid && isAfterMin && isBeforeMax;
};

export const DateTimeTimezoneField = ({
  disabled,
  name,
  onChange,
  error,
  fullWidth,
  label,
  helperText,
  value: initialValue,
}: DateTimeFieldProps) => {
  const intl = useIntl();

  // Initialize state with transformed value
  const [value, setValue] = useState<string>(
    initialValue ? convertToDateTimeLocal(initialValue) : "",
  );

  // Track if the value change came from props (external) vs user input
  // When external, we skip calling onChange to avoid dirty state
  const isExternalUpdate = useRef(false);

  // Track if we need to update internal state when prop changes (e.g. from server)
  useEffect(() => {
    if (initialValue) {
      const newValue = convertToDateTimeLocal(initialValue);

      // Only update if actually different to avoid cursor jumps or loops
      if (newValue !== value) {
        isExternalUpdate.current = true;
        setValue(newValue);
      }
    } else if (initialValue === "") {
      isExternalUpdate.current = true;
      setValue("");
    }
  }, [initialValue]);

  // Track if this is the initial mount - skip onChange to avoid triggering
  // dirty state with the converted (timezone-transformed) value
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      // Reset external update flag on initial mount to ensure user changes aren't skipped
      isExternalUpdate.current = false;

      return;
    }

    // Skip onChange if this change came from props (external update)
    if (isExternalUpdate.current) {
      isExternalUpdate.current = false;

      return;
    }

    // Emit UTC format to match server storage format
    // This avoids dirty state issues from timezone offset differences
    const emittedValue = value === "" ? null : moment(value).utc().format();

    onChange(emittedValue);
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
          data-test-id="date-time-field"
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
      {error && (
        <Text marginTop={3} width="100%" color="critical1">
          {error}
        </Text>
      )}
    </>
  );
};
