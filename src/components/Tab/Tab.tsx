import { makeStyles } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import Typography from "@material-ui/core/Typography";
import classNames from "classnames";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    active: {
      color: theme.typography.caption.color
    },
    root: {
      "&$active": {
        borderBottomColor: theme.palette.primary.main,
        color: theme.typography.body1.color
      },
      "&:focus": {
        color: theme.palette.primary.main
      },
      "&:hover": {
        color: theme.palette.primary.main
      },
      borderBottom: "1px solid transparent",
      color: fade(theme.typography.caption.color, 0.6),
      cursor: "pointer",
      display: "inline-block",
      fontWeight: theme.typography.fontWeightRegular,
      marginRight: theme.spacing(2),
      minWidth: 40,
      padding: theme.spacing(1),
      transition: theme.transitions.duration.short + "ms"
    }
  }),
  { name: "Tab" }
);

interface TabProps<T> {
  children?: React.ReactNode;
  isActive: boolean;
  changeTab: (index: T) => void;
}

export function Tab<T>(value: T) {
  const Component: React.FC<TabProps<T>> = props => {
    const { children, isActive, changeTab } = props;

    const classes = useStyles(props);

    return (
      <Typography
        component="span"
        className={classNames({
          [classes.root]: true,
          [classes.active]: isActive
        })}
        onClick={() => changeTab(value)}
      >
        {children}
      </Typography>
    );
  };

  return Component;
}

export default Tab;
