import ButtonBase from "@material-ui/core/ButtonBase";
import { CheckboxProps as MuiCheckboxProps } from "@material-ui/core/Checkbox";
import { makeStyles } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import classNames from "classnames";
import React from "react";

export type CheckboxProps = Omit<
  MuiCheckboxProps,
  | "checkedIcon"
  | "color"
  | "icon"
  | "indeterminateIcon"
  | "classes"
  | "onChange"
  | "onClick"
> & {
  disableClickPropagation?: boolean;
  onChange?: (event: React.ChangeEvent<any>) => void;
};

const useStyles = makeStyles(
  theme => ({
    box: {
      "&$checked": {
        "&:before": {
          background: theme.palette.primary.main,
          color: theme.palette.background.paper,
          content: '"\\2713"',
          fontWeight: "bold",
          textAlign: "center"
        },
        borderColor: theme.palette.primary.main
      },
      "&$disabled": {
        borderColor: theme.palette.grey[200]
      },
      "&$indeterminate": {
        "&:before": {
          background: theme.palette.primary.main,
          height: 2,
          top: 5
        },
        borderColor: theme.palette.primary.main
      },
      "&:before": {
        background: "rgba(0, 0, 0, 0)",
        content: '""',
        height: 14,
        left: -1,
        position: "absolute",
        top: -1,
        transition: theme.transitions.duration.short + "ms",
        width: 14
      },

      WebkitAppearance: "none",
      border: `1px solid ${theme.palette.action.active}`,
      boxSizing: "border-box",
      cursor: "pointer",
      height: 14,
      outline: "0",
      position: "relative",
      userSelect: "none",
      width: 14
    },
    checked: {},
    disabled: {},
    indeterminate: {},
    root: {
      "&:hover": {
        background: fade(theme.palette.primary.main, 0.1)
      },
      alignSelf: "start",
      borderRadius: "100%",
      cursor: "pointer",
      display: "flex",
      height: 30,
      justifyContent: "center",
      margin: "5px 9px",
      width: 30
    }
  }),
  { name: "Checkbox" }
);
const Checkbox: React.FC<CheckboxProps> = props => {
  const {
    checked,
    className,

    disabled,
    disableClickPropagation,
    indeterminate,
    onChange,
    value,
    name,
    ...rest
  } = props;
  const classes = useStyles(props);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const handleClick = React.useCallback(
    disableClickPropagation
      ? event => {
          event.stopPropagation();
          inputRef.current.click();
        }
      : () => inputRef.current.click(),
    []
  );

  return (
    <ButtonBase
      {...rest}
      centerRipple
      className={classNames(classes.root, className)}
      disabled={disabled}
      onClick={handleClick}
    >
      <input
        className={classNames(classes.box, {
          [classes.checked]: checked,
          [classes.disabled]: disabled,
          [classes.indeterminate]: indeterminate
        })}
        disabled={disabled}
        type="checkbox"
        name={name}
        value={checked !== undefined && checked.toString()}
        ref={inputRef}
        onChange={onChange}
      />
    </ButtonBase>
  );
};
Checkbox.displayName = "Checkbox";
export default Checkbox;
