// @ts-strict-ignore
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { FormattedMessage } from "react-intl";

import { SimpleRadioGroupField } from "../SimpleRadioGroupField";
import { useStyles } from "./styles";

export interface RadioGroupFieldChoice<T extends string | number = string | number> {
  disabled?: boolean;
  value: T;
  label: React.ReactNode;
}

interface RadioGroupFieldProps {
  alignTop?: boolean;
  choices: RadioGroupFieldChoice[];
  className?: string;
  innerContainerClassName?: string;
  disabled?: boolean;
  error?: boolean;
  hint?: string;
  label?: React.ReactNode;
  name?: string;
  value: string | number;
  variant?: "block" | "inline" | "inlineJustify";
  onChange: (event: React.ChangeEvent<any>) => void;
}

export const NewRadioGroupField = SimpleRadioGroupField;

export const RadioGroupField = (props: RadioGroupFieldProps) => {
  const {
    alignTop,
    className,
    disabled,
    error,
    label,
    choices,
    value,
    onChange,
    name,
    hint,
    variant = "block",
    innerContainerClassName,
  } = props;
  const classes = useStyles(props);

  return (
    <FormControl
      className={clsx(classes.root, className, {
        [classes.rootNoLabel]: !label,
      })}
      error={error}
      disabled={disabled}
    >
      {!!label && <label className={classes.formLabel}>{label}</label>}
      <RadioGroup
        aria-label={name}
        name={name}
        value={value}
        onChange={onChange}
        className={clsx({
          [classes.radioGroupInline]: variant === "inline",
          [innerContainerClassName]: !!innerContainerClassName,
        })}
      >
        {choices.length > 0 ? (
          choices.map(choice => (
            <FormControlLabel
              disabled={choice.disabled}
              value={choice.value}
              className={clsx({
                [classes.radioLabel]: variant !== "inline",
                [classes.radioLabelInline]: variant === "inline",
              })}
              classes={{
                label: classes.label,
              }}
              control={
                <Radio
                  data-test-id={choice.value}
                  className={clsx({
                    [classes.alignTop]: alignTop,
                  })}
                  color="secondary"
                />
              }
              label={choice.label}
              key={choice.value}
            />
          ))
        ) : (
          <MenuItem disabled={true}>
            <FormattedMessage id="hX5PAb" defaultMessage="No results found" />
          </MenuItem>
        )}
      </RadioGroup>
      {hint && <FormHelperText>{hint}</FormHelperText>}
    </FormControl>
  );
};
RadioGroupField.displayName = "RadioGroupField";
export default RadioGroupField;
