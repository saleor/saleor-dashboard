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
    formLabel: {
      marginBottom: theme.spacing(1)
    },
    radioLabel: {
      marginBottom: -theme.spacing(0.5)
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

export interface RadioGroupFieldChoice {
  value: string;
  label: React.ReactNode;
}

interface RadioGroupFieldProps {
  choices: RadioGroupFieldChoice[];
  className?: string;
  disabled?: boolean;
  error?: boolean;
  hint?: string;
  label?: string;
  name?: string;
  value: string;
  onChange: (event: React.ChangeEvent<any>) => void;
}

export const RadioGroupField: React.FC<RadioGroupFieldProps> = props => {
  const {
    className,
    disabled,
    error,
    label,
    choices,
    value,
    onChange,
    name,
    hint
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
};
RadioGroupField.displayName = "RadioGroupField";
export default RadioGroupField;
