import { Divider } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    action: {
      flex: "0 0 auto",
    },
    block: {
      [theme.breakpoints.down("xs")]: {
        "&&": {
          display: "block",
        },
      },
    },
    underline: {
      marginBottom: theme.spacing(4),
    },
    grid: {
      padding: theme.spacing(2),
    },
    menuButton: {
      flex: "0 0 auto",
      marginLeft: theme.spacing(-2),
      marginRight: theme.spacing(3),
      marginTop: theme.spacing(-2),
    },
    root: {
      alignItems: "center",
      display: "flex",
      marginBottom: theme.spacing(3),
      wordBreak: "break-all",
    },
    subtitle: {
      alignItems: "center",
      display: "flex",
      marginBottom: theme.spacing(2),
    },
    titleRow: {
      flex: 1,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      minWidth: 0,
      textOverflow: "ellipsis",
    },
  }),
  {
    name: "ExtendedPageHeader",
  },
);

interface ExtendedPageHeaderProps {
  children?: React.ReactNode;
  className?: string;
  childrenWrapperClassName?: string;
  inline?: boolean;
  underline?: boolean;
  title?: React.ReactNode;
  testId?: string;
}

const ExtendedPageHeader: React.FC<ExtendedPageHeaderProps> = props => {
  const {
    children,
    className,
    childrenWrapperClassName,
    inline,
    underline,
    title,
    testId,
  } = props;

  const classes = useStyles(props);

  return (
    <>
      <div
        data-test-id={testId}
        className={classNames(classes.root, className, {
          [classes.block]: !inline,
          [classes.underline]: underline,
        })}
      >
        <div className={classes.titleRow}>{title}</div>
        <div className={classNames(classes.action, childrenWrapperClassName)}>
          {children}
        </div>
      </div>
      {underline && (
        <div className={classes.underline}>
          <Divider />
        </div>
      )}
    </>
  );
};
ExtendedPageHeader.displayName = "ExtendedPageHeader";
export default ExtendedPageHeader;
