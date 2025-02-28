// @ts-strict-ignore
import { Select } from "@dashboard/components/Select";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";

const useStyles = makeStyles(
  theme => ({
    root: {
      display: "grid",
      gridColumnGap: theme.spacing(2),
      gridTemplateColumns: "5rem 1fr",
    },
  }),
  { name: "PhoneField" },
);

interface PhoneFieldProps {
  name: string;
  prefix: string;
  number: string;
  prefixes: string[];
  label?: string;
  onChange: (event: ChangeEvent) => any;
}

const PhoneField = (props: PhoneFieldProps) => {
  const { name, number: phoneNumber, prefix, prefixes, label, onChange } = props;
  const classes = useStyles(props);
  const nameWithPrefix = name + "_prefix";

  return (
    <div className={classes.root}>
      <Select
        name={nameWithPrefix}
        options={prefixes.map(p => ({ label: "+" + p, value: p }))}
        onChange={onChange}
        value={prefix}
        label={label}
      />
      <TextField name={name + "_number"} onChange={onChange} value={phoneNumber} label="&nbsp;" />
    </div>
  );
};

PhoneField.displayName = "PhoneField";
export default PhoneField;
