import { makeStyles, TextField } from "@material-ui/core";
import SingleAutocompleteSelectField from "@saleor/components/SingleAutocompleteSelectField";
import { TimePeriodType } from "@saleor/types/globalTypes";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import { timePeriodTextWithSelectFieldMessages as messages } from "./messages";

const useStyles = makeStyles(
  () => ({
    container: {
      position: "relative",
      width: 400
    },
    textField: {
      paddingRight: 300,
      width: "100%"
    },
    autocompleteField: {
      position: "absolute",
      height: 52,
      top: 0,
      right: 0,
      // bottom: "auto",
      backgroundColor: "pink"
    },
    autocompleteInput: {
      height: 52
    }
  }),
  { name: "TimePeriodTextWithSelectField" }
);

interface TimePeriodTextWithSelectFieldProps {
  periodAmount: number;
  periodType: TimePeriodType;
}

const TimePeriodTextWithSelectField: React.FC<TimePeriodTextWithSelectFieldProps> = ({
  periodAmount,
  periodType
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

  return (
    <div className={classes.container}>
      <TextField
        InputProps={{ className: classes.textField }}
        value={periodAmount}
        // InputLabelProps={{ style: { height: 0 } }}
        // className={classes.textField}
      ></TextField>
      <SingleAutocompleteSelectField
        value={periodType}
        displayValue={intl.formatMessage(
          messages[`${periodType.toLowerCase()}Label`]
        )}
        className={classes.autocompleteField}
        InputProps={{ className: classes.autocompleteInput }}
        nakedInput
        choices={options}
      />
    </div>
  );
};

export default TimePeriodTextWithSelectField;
