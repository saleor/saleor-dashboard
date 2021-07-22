import { TextField } from "@material-ui/core";
import SingleSelectField from "@saleor/components/SingleSelectField";
import { FormChange } from "@saleor/hooks/useForm";
import { TimePeriodType } from "@saleor/types/globalTypes";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
import React from "react";
import { useIntl } from "react-intl";

import { timePeriodTextWithSelectFieldMessages as messages } from "./messages";
import { useTimePeriodTextWithSelectFieldStyles as useStyles } from "./styles";

interface TimePeriodTextWithSelectFieldProps {
  periodAmount: number;
  periodType: TimePeriodType;
  change: FormChange;
  textFieldName: string;
  selectFieldName: string;
  setSelectedTimePeriod: (value: TimePeriodType) => void;
}

const TimePeriodTextWithSelectField: React.FC<TimePeriodTextWithSelectFieldProps> = ({
  periodAmount,
  periodType,
  change,
  textFieldName,
  selectFieldName,
  setSelectedTimePeriod
}) => {
  const classes = useStyles({});
  const intl = useIntl();

  const options = [
    {
      label: intl.formatMessage(messages.yearLabel),
      value: TimePeriodType.YEAR
    },
    {
      label: intl.formatMessage(messages.monthLabel),
      value: TimePeriodType.MONTH
    },
    {
      label: intl.formatMessage(messages.dayLabel),
      value: TimePeriodType.DAY
    }
  ];

  const handleSelect = createSingleAutocompleteSelectHandler(
    change,
    setSelectedTimePeriod,
    options
  );

  return (
    <div className={classes.container}>
      <TextField
        name={textFieldName}
        InputProps={{ className: classes.textField }}
        onChange={change}
        value={periodAmount}
      ></TextField>
      <SingleSelectField
        name={selectFieldName}
        onChange={handleSelect}
        value={periodType}
        className={classes.autocompleteField}
        choices={options}
      />
    </div>
  );
};

export default TimePeriodTextWithSelectField;
