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
    action: {
      flex: "0 0 auto"
    },
    grid: {
      padding: theme.spacing(2)
    },
    menuButton: {
      flex: "0 0 auto",
      marginLeft: -theme.spacing(2),
      marginRight: theme.spacing(3),
      marginTop: -theme.spacing(2)
    },
    root: {
      alignItems: "center",
      display: "flex",
      marginBottom: theme.spacing(3)
    },
    subtitle: {
      alignItems: "center",
      display: "flex",
      marginBottom: theme.spacing(2)
    },
    title: {
      flex: 1,
      paddingBottom: theme.spacing(2)
    }
  });

interface ExtendedPageHeaderProps extends WithStyles<typeof styles> {
  children?: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
}

const ExtendedPageHeader = withStyles(styles, { name: "ExtendedPageHeader" })(
  ({ children, classes, className, title }: ExtendedPageHeaderProps) => (
    <div className={classNames(classes.root, className)}>
      {title}
      <div className={classes.action}>{children}</div>
    </div>
  )
);
ExtendedPageHeader.displayName = "ExtendedPageHeader";
export default ExtendedPageHeader;
