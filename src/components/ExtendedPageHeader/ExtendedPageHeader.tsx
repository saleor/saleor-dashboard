import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    action: {
      flex: "0 0 auto",
      [theme.breakpoints.down("sm")]: {
        marginTop: theme.spacing()
      }
    },
    block: {
      [theme.breakpoints.down("xs")]: {
        "&&": {
          display: "block"
        }
      }
    },
    grid: {
      padding: theme.spacing(2)
    },
    menuButton: {
      flex: "0 0 auto",
      marginLeft: theme.spacing(-2),
      marginRight: theme.spacing(3),
      marginTop: theme.spacing(-2)
    },
    root: {
      alignItems: "center",
      display: "flex",
      marginBottom: theme.spacing(3),
      wordBreak: "break-all"
    },
    subtitle: {
      alignItems: "center",
      display: "flex",
      marginBottom: theme.spacing(2)
    },
    title: {
      flex: 1,
      paddingBottom: theme.spacing(2)
    },
    titleRow: {
      display: "flex",
      flex: 1,
      alignItems: "center",
      justifyContent: "space-between"
    }
  }),
  {
    name: "ExtendedPageHeader"
  }
);

interface ExtendedPageHeaderProps {
  children?: React.ReactNode;
  className?: string;
  inline?: boolean;
  title?: React.ReactNode;
  cardMenu?: React.ReactNode;
  testId?: string;
}

const ExtendedPageHeader: React.FC<ExtendedPageHeaderProps> = props => {
  const { children, className, inline, title, testId, cardMenu } = props;

  const classes = useStyles(props);

  return (
    <div
      data-test-id={testId}
      className={classNames(classes.root, className, {
        [classes.block]: !inline
      })}
    >
      <div className={classes.titleRow}>
        {title}
        {cardMenu}
      </div>
      <div className={classes.action}>{children}</div>
    </div>
  );
};
ExtendedPageHeader.displayName = "ExtendedPageHeader";
export default ExtendedPageHeader;
