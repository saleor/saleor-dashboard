import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select
} from "@material-ui/core";
import { InputProps } from "@material-ui/core/Input";
import { SelectProps } from "@material-ui/core/Select";
import { makeStyles } from "@saleor/theme";
import classNames from "classnames";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    formControl: {
      "& label": {
        top: "-3px"
      },
      width: "100%"
    },
    label: {
      zIndex: 3
    },
    noLabel: {
      padding: theme.spacing(2, 1.5)
    }
  }),
  { name: "SingleSelectField" }
);

export interface Choice<T = string, L = string | React.ReactNode> {
  value: T;
  label: L;
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
  InputProps?: InputProps;
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
    testId
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
            classes={{
              input: classNames({
                [classes.noLabel]: !label
              })
            }}
            name={name}
            labelWidth={180}
            {...InputProps}
          />
        }
        {...selectProps}
      >
        {choices.length > 0 ? (
          choices.map(choice => (
            <MenuItem
              data-test="selectFieldOption"
              data-test-id={choice.value}
              value={choice.value}
              key={choice.value}
            >
              {choice.label}
            </MenuItem>
          ))
        ) : (
          <MenuItem
            data-test="selectFieldOption"
            data-test-disabled
            disabled={true}
          >
            <FormattedMessage defaultMessage="No results found" />
          </MenuItem>
        )}
      </Select>
      {hint && <FormHelperText>{hint}</FormHelperText>}
    </FormControl>
  );
};
SingleSelectField.displayName = "SingleSelectField";
export default SingleSelectField;
