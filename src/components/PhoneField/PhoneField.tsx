import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import SingleSelectField from "@saleor/components/SingleSelectField";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    root: {
      display: "grid",
      gridColumnGap: theme.spacing(2),
      gridTemplateColumns: "5rem 1fr"
    }
  }),
  { name: "PhoneField" }
);

interface PhoneFieldProps {
  name: string;
  prefix: string;
  number: string;
  prefixes: string[];
  label?: string;
  onChange(event: React.ChangeEvent<any>);
}

const PhoneField: React.FC<PhoneFieldProps> = props => {
  const {
    name,
    number: phoneNumber,
    prefix,
    prefixes,
    label,
    onChange
  } = props;

  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <SingleSelectField
        name={name + "_prefix"}
        choices={prefixes.map(p => ({ label: "+" + p, value: p }))}
        onChange={onChange}
        value={prefix}
        label={label}
      />
      <TextField
        name={name + "_number"}
        onChange={onChange}
        value={phoneNumber}
        label="&nbsp;"
      />
    </div>
  );
};
PhoneField.displayName = "PhoneField";
export default PhoneField;
