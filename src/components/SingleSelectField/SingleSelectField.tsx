import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  OutlinedInputProps,
  Select,
} from "@material-ui/core";
import { SelectProps } from "@material-ui/core/Select";
import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import clsx from "clsx";
import React from "react";
import { FormattedMessage } from "react-intl";

import { singleSelectFieldItemHeight } from "./consts";

const useStyles = makeStyles(
  theme => ({
    formControl: {
      "& label": {
        top: "-3px",
      },
      width: "100%",
    },
    label: {
      zIndex: 3,
    },
    noLabel: {
      padding: theme.spacing(2, 1.5),
    },
    paper: {
      maxHeight: `calc(${singleSelectFieldItemHeight}px * 10 + ${singleSelectFieldItemHeight}px * 0.5)`,
    },
    disabledMenuItem: {
      pointerEvents: "none",
    },
  }),
  { name: "SingleSelectField" },
);

export interface Choice<T = string, L = string | React.ReactNode> {
  value: T;
  label: L;
  disabled?: boolean;
}

export type Choices = Choice[];
interface SingleSelectFieldProps {
  testId?: string;
  choices: Choices;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  hint?: string | React.ReactNode;
  label?: string | React.ReactNode;
  name?: string;
  selectProps?: SelectProps;
  placeholder?: string;
  value?: string;
  InputProps?: OutlinedInputProps;
  onChange(event: any);
}

export const SingleSelectField: React.FC<SingleSelectFieldProps> = props => {
  const {
    className,
    disabled,
    error,
    label,
    choices,
    value,
    onChange,
    name,
    hint,
    selectProps,
    placeholder,
    InputProps,
    testId,
  } = props;
  const classes = useStyles(props);

  const choicesByKey: { [key: string]: string } =
    choices === undefined
      ? {}
      : choices.reduce((prev, curr) => {
          prev[curr.value] = curr.label;
          return prev;
        }, {});

  return (
    <FormControl
      className={classNames(classes.formControl, className)}
      error={error}
      disabled={disabled}
    >
      <InputLabel className={classes.label} shrink={!!value}>
        {label}
      </InputLabel>
      <Select
        data-test-id={testId}
        variant="outlined"
        fullWidth
        renderValue={choiceValue =>
          choiceValue ? choicesByKey[choiceValue.toString()] : placeholder
        }
        value={value || ""}
        onChange={onChange}
        input={
          <OutlinedInput
            name={name}
            labelWidth={180}
            {...InputProps}
            classes={{
              ...(InputProps?.classes || {}),
              input: classNames(InputProps?.classes?.input, {
                [classes.noLabel]: !label,
              }),
            }}
          />
        }
        {...selectProps}
        MenuProps={{
          classes: {
            paper: classes.paper,
          },
        }}
      >
        {choices.length > 0 ? (
          choices.map(choice => (
            <MenuItem
              disabled={choice.disabled}
              className={clsx(choice.disabled && classes.disabledMenuItem)}
              data-test-id={"select-field-option-" + choice.value}
              value={choice.value}
              key={choice.value}
            >
              {choice.label}
            </MenuItem>
          ))
        ) : (
          <MenuItem
            data-test-id="select-field-option"
            data-test-disabled
            disabled={true}
          >
            <FormattedMessage id="hX5PAb" defaultMessage="No results found" />
          </MenuItem>
        )}
      </Select>
      {hint && <FormHelperText>{hint}</FormHelperText>}
    </FormControl>
  );
};
SingleSelectField.displayName = "SingleSelectField";
export default SingleSelectField;
