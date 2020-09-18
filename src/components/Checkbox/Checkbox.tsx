import MuiCheckbox, {
  CheckboxProps as MuiCheckboxProps
} from "@material-ui/core/Checkbox";
import React from "react";

export type CheckboxProps = Omit<
  MuiCheckboxProps,
  "checkedIcon" | "color" | "icon" | "indeterminateIcon" | "classes" | "onClick"
> & {
  disableClickPropagation?: boolean;
};

const Checkbox: React.FC<CheckboxProps> = props => {
  const { disableClickPropagation, ...rest } = props;

  return (
    <MuiCheckbox
      {...rest}
      onClick={
        disableClickPropagation ? event => event.stopPropagation() : undefined
      }
    />
  );
};
Checkbox.displayName = "Checkbox";
export default Checkbox;
