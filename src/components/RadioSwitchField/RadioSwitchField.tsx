// @ts-strict-ignore
import { FormControl, FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import clsx from "clsx";
import * as React from "react";

const useStyles = makeStyles(
  theme => ({
    formControl: {
      padding: 0,
      width: "100%",
    },
    formLabel: {
      marginLeft: "-5px",
      paddingBottom: "10px",
    },
    radioLabel: {
      "& > span": {
        paddingTop: theme.spacing(),
        paddingBottom: theme.spacing(),
      },
    },
    secondLabel: {
      display: "block",
      fontSize: "12px",
    },
  }),
  { name: "RadioSwitchField" },
);

interface RadioSwitchFieldProps {
  classes?: Record<"radioLabel", string>;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  firstOptionLabel: React.ReactNode;
  name?: string;
  secondOptionLabel: React.ReactNode;
  value?: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

export const RadioSwitchField = (props: RadioSwitchFieldProps) => {
  const {
    classes: overrideClasses,
    className,
    disabled,
    error,
    firstOptionLabel,
    onChange,
    name,
    secondOptionLabel,
    value,
  } = props;
  const classes = useStyles(props);
  const initialValue = value ? "true" : "false";
  const change = event => {
    onChange({
      target: {
        name: event.target.name,
        value: event.target.value === "true",
      },
    } as any);
  };

  return (
    <FormControl className={clsx(classes.formControl, className)} error={error} disabled={disabled}>
      <RadioGroup
        aria-label={name}
        name={name}
        value={initialValue}
        onChange={event => change(event)}
      >
        <FormControlLabel
          value="true"
          className={clsx(classes.radioLabel, overrideClasses?.radioLabel)}
          control={<Radio color="secondary" />}
          label={firstOptionLabel}
          name={name}
        />
        <FormControlLabel
          value="false"
          className={clsx(classes.radioLabel, overrideClasses?.radioLabel)}
          control={<Radio color="secondary" />}
          label={secondOptionLabel}
          name={name}
        />
      </RadioGroup>
    </FormControl>
  );
};
RadioSwitchField.displayName = "RadioSwitchField";
export default RadioSwitchField;
