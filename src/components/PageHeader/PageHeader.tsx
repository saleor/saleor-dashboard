import { Typography } from "@material-ui/core";
import { LimitInfoFragment } from "@saleor/fragments/types/LimitInfoFragment";
import { makeStyles } from "@saleor/theme";
import React from "react";

import ExtendedPageHeader from "../ExtendedPageHeader";
import { RefreshLimits_shop_limits } from "../Shop/types/RefreshLimits";
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
      alignSelf: "flex-start",
      flex: 1,
      fontSize: 24
    }
  }),
  { name: "PageHeader" }
);

interface LimitInfo {
  data: RefreshLimits_shop_limits;
  key: keyof LimitInfoFragment;
  text: string;
}
interface PageHeaderProps {
  children?: React.ReactNode;
  className?: string;
  inline?: boolean;
  limit?: LimitInfo;
  title?: React.ReactNode;
}

function formatLimit(limit: LimitInfo): string {
  return `${limit.data.currentUsage[limit.key]}/${
    limit.data.allowedUsage[limit.key]
  } ${limit.text}`;
}

const PageHeader: React.FC<PageHeaderProps> = props => {
  const { children, className, inline, limit, title } = props;

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
        {limit && (
          <Typography className={classes.limit} color="textSecondary">
            {formatLimit(limit)}
          </Typography>
        )}
        {children}
      </div>
    </ExtendedPageHeader>
  );
};

PageHeader.displayName = "PageHeader";
export default PageHeader;
