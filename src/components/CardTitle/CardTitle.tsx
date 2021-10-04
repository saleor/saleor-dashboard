import { Typography } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";

import CardDivider from "../CardDivider/CardDivider";

const useStyles = makeStyles(
  theme => ({
    children: theme.mixins.gutters({}),
    constantHeight: {
      height: 56
    },
    root: theme.mixins.gutters({
      alignItems: "center",
      display: "flex",
      minHeight: 56
    }),
    title: {
      flex: 1,
      fontWeight: 500,
      lineHeight: 1
    },
    subtitle: {
      fontWeight: 400
    },
    toolbar: {
      marginRight: theme.spacing(-1)
    }
  }),
  { name: "CardTitle" }
);

interface CardTitleProps {
  children?: React.ReactNode;
  className?: string;
  height?: "default" | "const";
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  toolbar?: React.ReactNode;
  onClick?: (event: React.MouseEvent<any>) => void;
}

const CardTitle: React.FC<CardTitleProps> = props => {
  const {
    className,
    children,
    height,
    title,
    subtitle,
    toolbar,
    onClick,
    ...rest
  } = props;

  const classes = useStyles(props);

  return (
    <>
      <div
        className={classNames(classes.root, {
          [className]: !!className,
          [classes.constantHeight]: height === "const"
        })}
        {...rest}
      >
        <Typography
          className={classes.title}
          variant="h5"
          onClick={onClick}
          component="span"
        >
          {title}
        </Typography>
        <div className={classes.toolbar}>{toolbar}</div>
      </div>
      <div className={classes.children}>{children}</div>
      <CardDivider />
    </>
  );
};
CardTitle.displayName = "CardTitle";
export default CardTitle;
