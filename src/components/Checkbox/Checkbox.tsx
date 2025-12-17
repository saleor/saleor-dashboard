// @ts-strict-ignore
import MuiCheckbox, { CheckboxProps as MuiCheckboxProps } from "@material-ui/core/Checkbox";
import FormHelperText from "@material-ui/core/FormHelperText";

import styles from "./Checkbox.module.css";

type CheckboxProps = Omit<
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
const Checkbox = ({ helperText, error, ...props }: CheckboxProps) => {
  const { disableClickPropagation, ...rest } = props;

  return (
    <>
      <MuiCheckbox
        data-test-id="checkbox"
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
        <FormHelperText classes={{ root: error && styles.error }}>{helperText}</FormHelperText>
      )}
    </>
  );
};

Checkbox.displayName = "Checkbox";
export default Checkbox;
