import { ChangeEvent, FormChange } from "@dashboard/hooks/useForm";
import { Box, Input, Option, Select, Spinner } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import React from "react";

interface CommonFieldProps {
  name: string;
  type?: string;
  className?: string;
  label?: string;
}

export interface TextWithSelectFieldProps {
  change: FormChange;
  choices: Option[];
  helperText?: string;
  isError?: boolean;
  loading?: boolean;
  textFieldProps: CommonFieldProps & {
    value?: string | number;
    minValue?: number;
  };
  selectFieldProps: CommonFieldProps & { value: string };
}

const TextWithSelectField: React.FC<TextWithSelectFieldProps> = ({
  change,
  choices,
  loading,
  textFieldProps,
  selectFieldProps,
  helperText,
  isError,
}) => {
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
  const handleTextChange = (event: ChangeEvent) => {
    const { value } = event.target;
    const otherTarget = {
      value: selectFieldValue,
      name: selectFieldName,
    };
    // handle parsing in case of text field of type number
    const parsedValue =
      textFieldType === "number" && typeof value === "string" ? parseInt(value, 10) : value;

    change({
      ...event,
      target: { ...event.target, value: parsedValue, name: event.target.name },
    });
    change({ target: otherTarget });
  };

  return (
    <Box width="100%">
      <Input
        error={isError}
        helperText={helperText}
        type="number"
        name={textFieldName}
        label={textFieldLabel}
        min={textFieldMinValue}
        onChange={handleTextChange}
        value={textFieldValue}
        endAdornment={
          loading ? (
            <Box paddingTop={1} paddingRight={4}>
              <Spinner />
            </Box>
          ) : (
            <Select
              name={selectFieldName}
              onChange={value => change({ target: { name: selectFieldName, value } })}
              value={selectFieldValue}
              className={clsx("noBorder", selectFieldClassName)}
              options={choices}
            />
          )
        }
      />
    </Box>
  );
};

export default TextWithSelectField;
