import { TextField } from "@material-ui/core";
import SingleSelectField, {
  Choices,
} from "@saleor/components/SingleSelectField";
import { ChangeEvent, FormChange } from "@saleor/hooks/useForm";
import classNames from "classnames";
import React from "react";

import { useStyles } from "./styles";

interface CommonFieldProps {
  name: string;
  type?: string;
  className?: string;
  label?: string;
}

export interface TextWithSelectFieldProps {
  change: FormChange;
  choices: Choices;
  helperText?: string;
  isError?: boolean;
  textFieldProps: CommonFieldProps & {
    value?: string | number;
    minValue?: number;
  };
  selectFieldProps: CommonFieldProps & { value: string };
  containerClassName?: string;
}

const TextWithSelectField: React.FC<TextWithSelectFieldProps> = ({
  change,
  choices,
  containerClassName,
  textFieldProps,
  selectFieldProps,
  helperText,
  isError,
}) => {
  const classes = useStyles();

  const {
    name: textFieldName,
    value: textFieldValue,
    label: textFieldLabel,
    type: textFieldType,
    minValue: textFieldMinValue,
  } = textFieldProps;

  const {
    name: selectFieldName,
    value: selectFieldValue,
    className: selectFieldClassName,
  } = selectFieldProps;

  const handleSelectChange = (event: ChangeEvent) => {
    // in case one of the fields in the form is empty
    // we need to save the other part of the field as well
    const inputTarget = {
      value: textFieldValue,
      name: textFieldName,
    };

    change(event);
    change({ target: inputTarget });
  };

  const handleTextChange = (event: ChangeEvent) => {
    const { value } = event.target;

    const otherTarget = {
      value: selectFieldValue,
      name: selectFieldName,
    };

    // handle parsing in case of text field of type number
    const parsedValue =
      textFieldType === "number" && typeof value === "string"
        ? parseInt(value, 10)
        : value;

    change({
      ...event,
      target: { ...event.target, value: parsedValue, name: event.target.name },
    });
    change({ target: otherTarget });
  };

  return (
    <div className={containerClassName || classes.container}>
      <TextField
        error={isError}
        helperText={helperText}
        type="number"
        className={classes.innerContainer}
        name={textFieldName}
        label={textFieldLabel}
        inputProps={{
          min: textFieldMinValue,
        }}
        InputProps={{
          className: classNames(classes.textField, {
            [classes.textFieldCentered]: !textFieldLabel,
          }),
          endAdornment: (
            <SingleSelectField
              name={selectFieldName}
              onChange={handleSelectChange}
              value={selectFieldValue}
              className={selectFieldClassName}
              InputProps={{
                classes: {
                  input: classes.noBackground,
                  root: classes.input,
                  notchedOutline: classes.noBorder,
                },
              }}
              choices={choices}
            />
          ),
        }}
        onChange={handleTextChange}
        value={textFieldValue}
      />
    </div>
  );
};

export default TextWithSelectField;
