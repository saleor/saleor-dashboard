import { Typography } from "@material-ui/core";
import { TypographyProps } from "@material-ui/core/Typography";
import { makeStyles } from "@saleor/macaw-ui";
import { isExternalURL } from "@saleor/utils/urls";
import classNames from "classnames";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles(
  theme => ({
    primary: {
      color: theme.palette.textHighlighted.active,
    },
    root: {
      cursor: "pointer",
      display: "inline",
    },
    secondary: {
      color: theme.palette.primary.main,
    },
    underline: {
      textDecoration: "underline",
    },
    noUnderline: {
      textDecoration: "none",
    },
    disabled: {
      cursor: "default",
      color: theme.palette.textHighlighted.inactive,
    },
  }),
  { name: "Link" },
);

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  color?: "primary" | "secondary";
  underline?: boolean;
  typographyProps?: TypographyProps;
  onClick?: React.MouseEventHandler;
  disabled?: boolean;
}

const Link: React.FC<LinkProps> = props => {
  const {
    className,
    children,
    color = "primary",
    underline = false,
    onClick,
    disabled,
    href,
    target,
    rel,
    ...linkProps
  } = props;

  const classes = useStyles(props);

  const opensNewTab = target === "_blank";

  const commonLinkProps = {
    className: classNames(className, {
      [classes.root]: true,
      [classes[color]]: true,
      [classes.underline]: underline,
      [classes.noUnderline]: !underline,
      [classes.disabled]: disabled,
    }),
    onClick: event => {
      if (disabled || !onClick) {
        return;
      }

      event.preventDefault();
      onClick(event);
    },
    target,
    rel:
      rel ?? (opensNewTab && isExternalURL(href)) ? "noopener noreferer" : "",
    ...linkProps,
  };

  return (
    <>
      {!!href && !isExternalURL(href) ? (
        <RouterLink to={disabled ? undefined : href} {...commonLinkProps}>
          {children}
        </RouterLink>
      ) : (
        <Typography
          component="a"
          href={disabled ? undefined : href}
          {...commonLinkProps}
        >
          {children}
        </Typography>
      )}
    </>
  );
};
Link.displayName = "Link";
export default Link;
