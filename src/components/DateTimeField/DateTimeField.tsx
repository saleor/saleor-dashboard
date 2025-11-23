import { getErrorMessage } from "@dashboard/components/Attributes/utils";
import {
  PageErrorWithAttributesFragment,
  ProductErrorWithAttributesFragment,
} from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { joinDateTime, splitDateTime } from "@dashboard/misc";
import { Box, Input } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

interface DateTimeFieldProps {
  onChange: (value: string) => void;
  error: ProductErrorWithAttributesFragment | PageErrorWithAttributesFragment;
  value: string;
  disabled: boolean;
  name: string;
}

export const DateTimeField = ({ disabled, error, name, onChange, value }: DateTimeFieldProps) => {
  const intl = useIntl();
  const parsedValue = value ? splitDateTime(value) : { date: "", time: "" };

  return (
    <Box display="flex" gap={0.5}>
      <Input
        width="100%"
        size="small"
        disabled={disabled}
        error={!!error}
        helperText={getErrorMessage(error, intl)}
        label={intl.formatMessage(commonMessages.date)}
        name={`${name}:date`}
        onChange={event => {
          const date = event.target.value;
          const result = joinDateTime(date, parsedValue.time ?? "");

          if (result) {
            onChange(result);
          }
        }}
        type="date"
        value={parsedValue.date}
      />
      <Input
        width="100%"
        size="small"
        disabled={disabled}
        error={!!error}
        helperText={getErrorMessage(error, intl)}
        label={intl.formatMessage(commonMessages.time)}
        name={`${name}:time`}
        onChange={event => {
          const time = event.target.value;
          const result = joinDateTime(parsedValue.date ?? "", time);

          if (result) {
            onChange(result);
          }
        }}
        type="time"
        value={parsedValue.time}
      />
    </Box>
  );
};
