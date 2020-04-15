import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";

import ExtendedPageHeader from "../ExtendedPageHeader";
import Skeleton from "../Skeleton";

const useStyles = makeStyles(
  theme => ({
    root: {
      display: "flex"
    },
    title: {
      [theme.breakpoints.down("sm")]: {
        fontSize: 20,
        marginTop: theme.spacing(2),
        padding: 0
      },
      alignSelf: "flex-start",
      flex: 1,
      fontSize: 24
    }
  }),
  { name: "PageHeader" }
);

interface PageHeaderProps {
  children?: React.ReactNode;
  className?: string;
  inline?: boolean;
  title?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = props => {
  const { children, className, inline, title } = props;

  const classes = useStyles(props);

  return (
    <ExtendedPageHeader
      className={className}
      inline={inline}
      title={
        <Typography className={classes.title} variant="h5">
          {title !== undefined ? title : <Skeleton style={{ width: "10em" }} />}
        </Typography>
      }
    >
      <div className={classes.root}>{children}</div>
    </ExtendedPageHeader>
  );
};

PageHeader.displayName = "PageHeader";
export default PageHeader;
