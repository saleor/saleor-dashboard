import { makeStyles } from "@saleor/macaw-ui";
import { Skeleton, Text } from "@saleor/macaw-ui-next";
import * as React from "react";

import ExtendedPageHeader from "../ExtendedPageHeader";
import PreviewPill from "../PreviewPill";

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

const PageHeader = (props: PageHeaderProps) => {
  const { children, className, inline, underline, limitText, title, cardMenu, preview } = props;
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
            <Text className={classes.title} size={6} fontWeight="bold" lineHeight={3}>
              {title !== undefined ? title : <Skeleton style={{ width: "10em" }} />}
            </Text>
            {cardMenu}
          </>
        }
      >
        <div className={classes.root}>
          {limitText && (
            <Text className={classes.limit} color="default2">
              {limitText}
            </Text>
          )}
          {children}
        </div>
      </ExtendedPageHeader>
    </>
  );
};

PageHeader.displayName = "PageHeader";
export default PageHeader;
