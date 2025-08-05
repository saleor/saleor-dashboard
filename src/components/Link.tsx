// @ts-strict-ignore
import { isExternalURL } from "@dashboard/utils/urls";
import { TypographyProps } from "@material-ui/core/Typography";
import { makeStyles } from "@saleor/macaw-ui";
import { Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
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

export interface LinkState {
  from?: string;
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  color?: "primary" | "secondary";
  inline?: boolean;
  underline?: boolean;
  typographyProps?: TypographyProps;
  onClick?: React.MouseEventHandler;
  disabled?: boolean;
  state?: LinkState;
}

const Link = (props: LinkProps) => {
  const {
    className,
    children,
    inline = true,
    color = "primary",
    underline = false,
    onClick,
    disabled,
    href,
    target,
    rel,
    state,
    ...linkProps
  } = props;
  const classes = useStyles(props);
  const opensNewTab = target === "_blank";
  const commonLinkProps = {
    className: clsx(
      {
        [classes.root]: inline,
        [classes[color]]: true,
        [classes.underline]: underline,
        [classes.noUnderline]: !underline,
        [classes.disabled]: disabled,
      },
      className,
    ),
    onClick: event => {
      if (disabled || !onClick) {
        return;
      }

      event.preventDefault();
      onClick(event);
    },
    target,
    rel: rel ?? (opensNewTab && isExternalURL(href)) ? "noopener noreferer" : "",
    ...linkProps,
  };
  const urlObject = new URL(href, window.location.origin);

  return (
    <>
      {!!href && !isExternalURL(href) ? (
        <RouterLink<LinkState>
          to={
            disabled
              ? undefined
              : {
                  pathname: urlObject.pathname,
                  search: urlObject.search,
                  hash: urlObject.hash,
                  state,
                }
          }
          {...commonLinkProps}
        >
          {children}
        </RouterLink>
      ) : (
        <Text as="a" href={disabled ? undefined : href} display="block" {...commonLinkProps}>
          {children}
        </Text>
      )}
    </>
  );
};

Link.displayName = "Link";
export default Link;
