import { makeStyles } from "@material-ui/core/styles";
import Switch, { SwitchProps } from "@material-ui/core/Switch";
import React from "react";

import MoonIcon from "../../icons/Moon";
import SunIcon from "../../icons/Sun";

const useStyles = makeStyles(
  theme => ({
    checked: {
      "& svg": {
        background: theme.palette.primary.main,
        color: theme.palette.background.paper
      }
    },
    colorPrimary: {},
    root: {
      "& svg": {
        background: theme.palette.primary.main,
        borderRadius: "100%",
        height: 20,
        width: 20
      }
    },
    track: {
      "$colorPrimary$checked + &": {
        backgroundColor: theme.palette.background.paper
      },
      background: theme.palette.background.paper
    }
  }),
  {
    name: "ThemeSwitch"
  }
);
const ThemeSwitch: React.FC<SwitchProps> = props => {
  const classes = useStyles(props);

  return (
    <Switch
      {...props}
      classes={classes}
      color="primary"
      icon={<SunIcon />}
      checkedIcon={<MoonIcon />}
    />
  );
};

ThemeSwitch.displayName = "ThemeSwitch";
export default ThemeSwitch;
