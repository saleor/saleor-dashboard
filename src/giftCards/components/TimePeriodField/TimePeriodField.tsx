import { TimePeriodTypeEnum } from "@dashboard/graphql";
import { type FormChange } from "@dashboard/hooks/useForm";
import { Box, Input, Select, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { timePeriodTextWithSelectFieldMessages as messages } from "./messages";

interface TimePeriodFieldProps {
  amountFieldName: string;
  change: FormChange;
  helperText?: string;
  isError?: boolean;
  periodAmount: number;
  periodType: TimePeriodTypeEnum;
  typeFieldName: string;
}

const TimePeriodField = ({
  amountFieldName,
  change,
  helperText,
  isError,
  periodAmount,
  periodType,
  typeFieldName,
}: TimePeriodFieldProps) => {
  const intl = useIntl();
  const options = [
    {
      label: intl.formatMessage(messages.yearLabel),
      value: TimePeriodTypeEnum.YEAR,
    },
    {
      label: intl.formatMessage(messages.monthLabel),
      value: TimePeriodTypeEnum.MONTH,
    },
    {
      label: intl.formatMessage(messages.weekLabel),
      value: TimePeriodTypeEnum.WEEK,
    },
    {
      label: intl.formatMessage(messages.dayLabel),
      value: TimePeriodTypeEnum.DAY,
    },
  ];

  return (
    <Box display="flex" flexDirection="column" gap={1} width="100%">
      <Box __gridTemplateColumns="96px 1fr" display="grid" gap={2} width="100%">
        <Input
          error={isError}
          min={0}
          name={amountFieldName}
          onChange={change}
          type="number"
          value={periodAmount}
        />
        <Select
          error={isError}
          name={typeFieldName}
          onChange={value => change({ target: { name: typeFieldName, value } })}
          options={options}
          value={periodType}
        />
      </Box>
      {helperText ? (
        <Text color={isError ? "critical1" : "default2"} size={2}>
          {helperText}
        </Text>
      ) : null}
    </Box>
  );
};

export { TimePeriodField };
export default TimePeriodField;
