import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    root: {
      background: theme.palette.background.default,
      border: "none",
      color: theme.palette.text.primary,
      fontSize: 24,
      outline: 0,
      padding: theme.spacing(2, 3),
      width: "100%"
    }
  }),
  {
    name: "NavigatorInput"
  }
);
const NavigatorInput: React.FC<
  React.InputHTMLAttributes<HTMLInputElement>
> = props => {
  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <input
      autoFocus
      autoComplete="off"
      className={classes.root}
      placeholder={intl.formatMessage({
        defaultMessage: "Use Navigator to move through Saleor",
        description: "navigator placeholder"
      })}
      {...props}
    />
  );
};

NavigatorInput.displayName = "NavigatorInput";
export default NavigatorInput;
