import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import React from "react";

const useStyles = makeStyles(theme => ({
  action: {
    flex: "0 0 auto",
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 10
    }
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
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down("sm")]: {
      display: "block"
    }
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
}));

interface ExtendedPageHeaderProps {
  children?: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
}

const ExtendedPageHeader: React.FC<ExtendedPageHeaderProps> = props => {
  const { children, className, title } = props;

  const classes = useStyles(props);

  return (
    <div className={classNames(classes.root, className)}>
      {title}
      <div className={classes.action}>{children}</div>
    </div>
  );
};
ExtendedPageHeader.displayName = "ExtendedPageHeader";
export default ExtendedPageHeader;
