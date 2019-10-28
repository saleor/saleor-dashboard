import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import classNames from "classnames";
import React from "react";

const styles = theme =>
  createStyles({
    root: {
      [theme.breakpoints.up("lg")]: {
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: theme.breakpoints.width("lg")
      },
      [theme.breakpoints.up("sm")]: {
	      padding: theme.spacing(0, 3)
      },
      padding: theme.spacing(0, 1)
    }
  });

interface ContainerProps extends WithStyles<typeof styles> {
  className?: string;
}

export const Container = withStyles(styles, {
  name: "Container"
})(({ classes, className, ...props }: ContainerProps) => (
  <div className={classNames(classes.root, className)} {...props} />
));
Container.displayName = "Container";
export default Container;
