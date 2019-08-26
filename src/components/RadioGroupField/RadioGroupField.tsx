import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormLabel from "@material-ui/core/FormLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import React from "react";
import { FormattedMessage } from "react-intl";

const styles = createStyles({
  formControl: {
    padding: "0 15px",
    width: "100%"
  },
  formLabel: {
    marginLeft: "-5px",
    paddingBottom: "10px"
  },
  radioLabel: {
    "& > span": {
      padding: "6px"
    }
  }
});

interface RadioGroupFieldProps extends WithStyles<typeof styles> {
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
  value?: string;
  onChange: (event: React.ChangeEvent<any>) => void;
}

export const RadioGroupField = withStyles(styles, {
  name: "RadioGroupField"
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
    hint
  }: RadioGroupFieldProps) => {
    return (
      <FormControl
        className={classNames(classes.formControl, className)}
        error={error}
        disabled={disabled}
      >
        {label ? (
          <FormLabel className={classes.formLabel}>{label}</FormLabel>
        ) : null}
        <RadioGroup
          aria-label={name}
          name={name}
          value={value}
          onChange={onChange}
        >
          {choices.length > 0 ? (
            choices.map(choice => (
              <FormControlLabel
                value={choice.value}
                className={classes.radioLabel}
                control={<Radio color="primary" />}
                label={choice.label}
                key={choice.value}
              />
            ))
          ) : (
            <MenuItem disabled={true}>
              <FormattedMessage defaultMessage="No results found" />
            </MenuItem>
          )}
        </RadioGroup>
        {hint && <FormHelperText>{hint}</FormHelperText>}
      </FormControl>
    );
  }
);
RadioGroupField.displayName = "RadioGroupField";
export default RadioGroupField;
