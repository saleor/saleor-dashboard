import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormLabel from "@material-ui/core/FormLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    alignTop: {
      alignSelf: "baseline",
      position: "relative",
      top: -6
    },
    formLabel: {
      marginBottom: theme.spacing(1)
    },
    radioGroupInline: {
      flexDirection: "row"
    },
    radioLabel: {
      marginBottom: -theme.spacing(0.5)
    },
    radioLabelInline: {
      marginRight: theme.spacing(4)
    },
    root: {
      "& $radioLabel": {
        "&:last-of-type": {
          marginBottom: 0
        }
      },
      padding: 0,
      width: "100%"
    },
    rootNoLabel: {
      marginTop: -theme.spacing(1.5)
    }
  }),
  {
    name: "RadioGroupField"
  }
);

export interface RadioGroupFieldChoice<
  T extends string | number = string | number
> {
  disabled?: boolean;
  value: T;
  label: React.ReactNode;
}

interface RadioGroupFieldProps {
  alignTop?: boolean;
  choices: RadioGroupFieldChoice[];
  className?: string;
  disabled?: boolean;
  error?: boolean;
  hint?: string;
  label?: React.ReactNode;
  name?: string;
  value: string | number;
  variant?: "block" | "inline";
  onChange: (event: React.ChangeEvent<any>) => void;
}

export const RadioGroupField: React.FC<RadioGroupFieldProps> = props => {
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
    variant = "block"
  } = props;
  const classes = useStyles(props);

  return (
    <FormControl
      className={classNames(classes.root, className, {
        [classes.rootNoLabel]: !label
      })}
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
        className={classNames({
          [classes.radioGroupInline]: variant === "inline"
        })}
      >
        {choices.length > 0 ? (
          choices.map(choice => (
            <FormControlLabel
              disabled={choice.disabled}
              value={choice.value}
              className={classNames({
                [classes.radioLabel]: variant !== "inline",
                [classes.radioLabelInline]: variant === "inline"
              })}
              control={
                <Radio
                  className={classNames({
                    [classes.alignTop]: alignTop
                  })}
                  color="primary"
                />
              }
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
};
RadioGroupField.displayName = "RadioGroupField";
export default RadioGroupField;
