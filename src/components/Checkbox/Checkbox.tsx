import MuiCheckbox, {
  CheckboxProps as MuiCheckboxProps,
} from "@material-ui/core/Checkbox";
import FormHelperText from "@material-ui/core/FormHelperText";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    error: {
      color: theme.palette.error.main,
    },
  }),
  { name: "Checkbox" },
);

export type CheckboxProps = Omit<
  MuiCheckboxProps,
  "checkedIcon" | "color" | "icon" | "indeterminateIcon" | "classes" | "onClick"
> & {
  disableClickPropagation?: boolean;
  helperText?: string;
  error?: boolean;
};

const firefoxHandler = (event, onChange, checked) => {
  event.preventDefault();
  onChange(event, checked);
};

const Checkbox: React.FC<CheckboxProps> = ({ helperText, error, ...props }) => {
  const { disableClickPropagation, ...rest } = props;
  const classes = useStyles();

  return (
    <>
      <MuiCheckbox
        {...rest}
        onClick={
          disableClickPropagation
            ? event => {
                event.stopPropagation();

                /*
              Workaround for firefox
              ref: https://bugzilla.mozilla.org/show_bug.cgi?id=62151
            */
                firefoxHandler(event, rest.onChange, rest.checked);
              }
            : undefined
        }
      />
      {helperText && (
        <FormHelperText classes={{ root: error && classes.error }}>
          {helperText}
        </FormHelperText>
      )}
    </>
  );
};
Checkbox.displayName = "Checkbox";
export default Checkbox;
