import { makeStyles } from "@saleor/macaw-ui";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    root: {
      [theme.breakpoints.up("lg")]: {
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: theme.breakpoints.width("lg"),
      },
      [theme.breakpoints.up("sm")]: {
        padding: theme.spacing(0, 3),
      },
      padding: theme.spacing(0, 1),
      position: "relative",
    },
  }),
  {
    name: "Container",
  },
);

interface ContainerProps {
  className?: string;
}

export const Container: React.FC<ContainerProps> = props => {
  const { className, ...rest } = props;
  const classes = useStyles(props);

  return <div className={clsx(classes.root, className)} {...rest} />;
};
Container.displayName = "Container";
export default Container;
