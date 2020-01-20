import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Select, { SelectProps } from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import React from "react";
import { FormattedMessage } from "react-intl";
import { InputProps } from "@material-ui/core/Input";

const useStyles = makeStyles(
  theme => ({
    formControl: {
      "& label": {
        top: "-3px"
      },
      width: "100%"
    },
    noLabel: {
      padding: theme.spacing(2, 1.5)
    }
  }),
  { name: "SingleSelectField" }
);

interface SingleSelectFieldProps {
  choices: Array<{
    value: string;
    label: string | React.ReactNode;
  }>;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  hint?: string;
  label?: string;
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
    InputProps
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
      <InputLabel shrink={!!value}>{label}</InputLabel>
      <Select
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
            <MenuItem value={choice.value} key={choice.value}>
              {choice.label}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled={true}>
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
