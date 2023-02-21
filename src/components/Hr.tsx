import { makeStyles } from "@saleor/macaw-ui";
import { vars } from "@saleor/macaw-ui/next";
import clsx from "clsx";
import React from "react";

interface HrProps {
  className?: string;
}

const useStyles = makeStyles(
  {
    root: {
      backgroundColor: vars.colors.border.neutralPlain,
      border: "none",
      display: "block",
      height: 1,
      margin: 0,
      width: "100%",
    },
  },
  { name: "Hr" },
);

export const Hr: React.FC<HrProps> = props => {
  const { className } = props;

  const classes = useStyles(props);

  return <hr className={clsx(classes.root, className)} />;
};
Hr.displayName = "Hr";
export default Hr;
