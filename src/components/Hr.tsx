import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import React from "react";

interface HrProps {
  className?: string;
}

const useStyles = makeStyles(
  theme => ({
    root: {
      backgroundColor: theme.palette.divider,
      border: "none",
      display: "block",
      height: 1,
      margin: 0,
      width: "100%"
    }
  }),
  { name: "Hr" }
);

export const Hr: React.FC<HrProps> = props => {
  const { className } = props;

  const classes = useStyles(props);

  return <hr className={classNames(classes.root, className)} />;
};
Hr.displayName = "Hr";
export default Hr;
