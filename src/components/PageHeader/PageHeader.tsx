import { Typography } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

import ExtendedPageHeader from "../ExtendedPageHeader";
import PreviewPill from "../PreviewPill";
import Skeleton from "../Skeleton";

const useStyles = makeStyles(
  theme => ({
    limit: {
      marginRight: theme.spacing(4),
    },
    preview: {
      position: "absolute",
      top: theme.spacing(-4),
    },
    root: {
      alignItems: "center",
      display: "flex",
      [theme.breakpoints.down("xs")]: {
        flexDirection: "column",
        alignItems: "flex-start",
        "& > *": {
          width: "100%",
        },
        "& > *:not(first-child)": {
          marginTop: theme.spacing(2),
        },
      },
    },
    title: {
      [theme.breakpoints.down("sm")]: {
        fontSize: 20,
        padding: 0,
      },
      fontWeight: 700,
      flex: 1,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  }),
  { name: "PageHeader" },
);

interface PageHeaderProps {
  children?: React.ReactNode;
  className?: string;
  inline?: boolean;
  underline?: boolean;
  limitText?: string;
  title?: React.ReactNode;
  cardMenu?: React.ReactNode;
  preview?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = props => {
  const {
    children,
    className,
    inline,
    underline,
    limitText,
    title,
    cardMenu,
    preview,
  } = props;

  const classes = useStyles(props);

  return (
    <>
      {preview && <PreviewPill className={classes.preview} />}
      <ExtendedPageHeader
        testId="page-header"
        className={className}
        inline={inline}
        underline={underline}
        title={
          <>
            <Typography className={classes.title} variant="h1">
              {title !== undefined ? (
                title
              ) : (
                <Skeleton style={{ width: "10em" }} />
              )}
            </Typography>
            {cardMenu}
          </>
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
    </>
  );
};

PageHeader.displayName = "PageHeader";
export default PageHeader;
