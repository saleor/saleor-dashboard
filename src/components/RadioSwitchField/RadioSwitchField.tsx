import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { makeStyles } from "@saleor/theme";
import classNames from "classnames";
import React from "react";

const useStyles = makeStyles(
  {
    formControl: {
      padding: 0,
      width: "100%"
    },
    formLabel: {
      marginLeft: "-5px",
      paddingBottom: "10px"
    },
    radioLabel: {
      "& > span": {
        padding: "10px 6px"
      }
    },
    secondLabel: {
      display: "block",
      fontSize: "12px"
    }
  },
  { name: "RadioSwitchField" }
);

interface RadioSwitchFieldProps {
  className?: string;
  disabled?: boolean;
  error?: boolean;
  firstOptionLabel: React.ReactNode;
  name?: string;
  secondOptionLabel: React.ReactNode;
  value?: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

export const RadioSwitchField: React.FC<RadioSwitchFieldProps> = props => {
  const {
    className,
    disabled,
    error,
    firstOptionLabel,
    onChange,
    name,
    secondOptionLabel,
    value
  } = props;
  const classes = useStyles(props);

  const initialValue = value ? "true" : "false";

  const change = event => {
    onChange({
      target: {
        name: event.target.name,
        value: event.target.value === "true" ? true : false
      }
    } as any);
  };

  return (
    <FormControl
      className={classNames(classes.formControl, className)}
      error={error}
      disabled={disabled}
    >
      <RadioGroup
        aria-label={name}
        name={name}
        value={initialValue}
        onChange={event => change(event)}
      >
        <FormControlLabel
          value="true"
          className={classes.radioLabel}
          control={<Radio color="primary" />}
          label={firstOptionLabel}
          name={name}
        />
        <FormControlLabel
          value="false"
          className={classes.radioLabel}
          control={<Radio color="primary" />}
          label={secondOptionLabel}
          name={name}
        />
      </RadioGroup>
    </FormControl>
  );
};
RadioSwitchField.displayName = "RadioSwitchField";
export default RadioSwitchField;
