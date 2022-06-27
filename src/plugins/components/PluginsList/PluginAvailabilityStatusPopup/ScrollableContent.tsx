import { List } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

const useStyles = makeStyles(
  () => ({
    container: {
      maxHeight: 450,
      overflow: "auto",
    },
  }),
  { name: "ScrollableContent" },
);

interface ScrollableContentProps {
  children: React.ReactNode | React.ReactNode[];
}

const ScrollableContent: React.FC<ScrollableContentProps> = ({ children }) => {
  const classes = useStyles({});

  return (
    <div className={classes.container}>
      <List>{children}</List>
    </div>
  );
};

export default ScrollableContent;
