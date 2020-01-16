import { makeStyles } from "@material-ui/core/styles";
import Typography, { TypographyProps } from "@material-ui/core/Typography";
import classNames from "classnames";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    primary: {
      color: theme.palette.primary.main
    },
    root: {
      cursor: "pointer",
      display: "inline"
    },
    secondary: {
      color: theme.palette.primary.main
    },
    underline: {
      textDecoration: "underline"
    }
  }),
  { name: "Link" }
);

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  color?: "primary" | "secondary";
  underline?: boolean;
  typographyProps?: TypographyProps;
  onClick: () => void;
}

const Link: React.FC<LinkProps> = props => {
  const {
    className,
    children,
    color = "primary",
    underline = false,
    onClick,
    ...linkProps
  } = props;

  const classes = useStyles(props);

  return (
    <Typography
      component="a"
      className={classNames(className, {
        [classes.root]: true,
        [classes[color]]: true,
        [classes.underline]: underline
      })}
      onClick={event => {
        event.preventDefault();
        onClick();
      }}
      {...linkProps}
    >
      {children}
    </Typography>
  );
};
Link.displayName = "Link";
export default Link;
