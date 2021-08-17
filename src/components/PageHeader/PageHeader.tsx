import { Typography } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

import ExtendedPageHeader from "../ExtendedPageHeader";
import Skeleton from "../Skeleton";

const useStyles = makeStyles(
  theme => ({
    limit: {
      marginRight: theme.spacing(3)
    },
    root: {
      alignItems: "center",
      display: "flex",
      [theme.breakpoints.down("xs")]: {
        flexDirection: "column",
        alignItems: "flex-start",
        "& > *": {
          width: "100%"
        },
        "& > *:not(first-child)": {
          marginTop: theme.spacing(2)
        }
      }
    },
    title: {
      [theme.breakpoints.down("sm")]: {
        fontSize: 20,
        marginTop: theme.spacing(2),
        padding: 0
      },
      fontWeight: 700,
      alignSelf: "flex-start",
      flex: 1,
      fontSize: 48
    }
  }),
  { name: "PageHeader" }
);

interface PageHeaderProps {
  children?: React.ReactNode;
  className?: string;
  inline?: boolean;
  limitText?: string;
  title?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = props => {
  const { children, className, inline, limitText, title } = props;

  const classes = useStyles(props);

  return (
    <ExtendedPageHeader
      testId="page-header"
      className={className}
      inline={inline}
      title={
        <Typography className={classes.title} variant="h5">
          {title !== undefined ? title : <Skeleton style={{ width: "10em" }} />}
        </Typography>
      }
    >
      <div className={classes.root}>
        {limitText && (
          <Typography className={classes.limit} color="textSecondary">
            {limitText}
          </Typography>
        )}
        {children}
      </div>
    </ExtendedPageHeader>
  );
};

PageHeader.displayName = "PageHeader";
export default PageHeader;
