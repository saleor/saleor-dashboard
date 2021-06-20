import { TextField } from "@material-ui/core";
import { TextFieldProps } from "@material-ui/core/TextField";
import { getErrorMessage } from "@saleor/components/Attributes/utils";
import { PageErrorWithAttributesFragment } from "@saleor/fragments/types/PageErrorWithAttributesFragment";
import { ProductErrorWithAttributesFragment } from "@saleor/fragments/types/ProductErrorWithAttributesFragment";
import { commonMessages } from "@saleor/intl";
import { joinDateTime,splitDateTime } from "@saleor/misc";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

type DateTimeFieldProps = Omit<TextFieldProps, "label" | "error"> & {
  onChange: (value: string) => void;
  error: ProductErrorWithAttributesFragment | PageErrorWithAttributesFragment;
  value: string;
};

interface Value {
  date: string;
  time: string;
}

export const DateTimeField: React.FC<DateTimeFieldProps> = ({
  disabled,
  error,
  name,
  onChange,value: initialValue
}) => {
  const intl = useIntl();
  const [value, setValue] = useState<Value>(initialValue ? splitDateTime(initialValue) :{ date: "", time: "" });

  useEffect(() =>{
     if (value.time && value.date) {
       onChange(joinDateTime(value.date, value.time))
     }
  }, [value])

  return (
    <>
      <TextField
        fullWidth
        disabled={disabled}
        error={!!error}
        helperText={getErrorMessage(error, intl)}
        label={intl.formatMessage(commonMessages.date)}
        name={`${name}:date`}
        onChange={event =>
          setValue(values => ({ ...values, date: event.target.value }))
        }
        type="date"
        value={value.date}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        fullWidth
        disabled={disabled}
        error={!!error}
        helperText={getErrorMessage(error, intl)}
        label={intl.formatMessage(commonMessages.time)}
        name={`${name}:time`}
        onChange={event =>
          setValue(values => ({ ...values, time: event.target.value }))
        }
        type="time"
        value={value.time}
        InputLabelProps={{ shrink: true }}
      />
    </>
  );
};