import TextWithSelectField from "@saleor/components/TextWithSelectField";
import { TimePeriodTypeEnum } from "@saleor/graphql";
import { FormChange } from "@saleor/hooks/useForm";
import React from "react";
import { useIntl } from "react-intl";

import { timePeriodTextWithSelectFieldMessages as messages } from "./messages";

interface TimePeriodFieldProps {
  change: FormChange;
  periodAmount: number;
  periodType: TimePeriodTypeEnum;
  amountFieldName: string;
  typeFieldName: string;
  helperText?: string;
  isError?: boolean;
}

const TimePeriodField: React.FC<TimePeriodFieldProps> = ({
  change,
  periodAmount,
  periodType,
  amountFieldName,
  typeFieldName,
  helperText,
  isError,
}) => {
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
    <TextWithSelectField
      isError={isError}
      choices={options}
      change={change}
      helperText={helperText}
      textFieldProps={{
        type: "number",
        name: amountFieldName,
        value: periodAmount,
        minValue: 0,
      }}
      selectFieldProps={{
        name: typeFieldName,
        value: periodType,
      }}
    />
  );
};

export default TimePeriodField;
