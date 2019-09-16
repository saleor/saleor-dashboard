import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Select, { SelectProps } from "@material-ui/core/Select";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import React from "react";
import { FormattedMessage } from "react-intl";

const styles = createStyles({
  formControl: {
    "& label": {
      top: "-3px"
    },
    width: "100%"
  }
});

interface SingleSelectFieldProps extends WithStyles<typeof styles> {
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
  onChange(event: any);
}

export const SingleSelectField = withStyles(styles, {
  name: "SingleSelectField"
})(
  ({
    className,
    classes,
    disabled,
    error,
    label,
    choices,
    value,
    onChange,
    name,
    hint,
    selectProps,
    placeholder
  }: SingleSelectFieldProps) => {
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
          input={<OutlinedInput name={name} labelWidth={180} />}
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
  }
);
SingleSelectField.displayName = "SingleSelectField";
export default SingleSelectField;
