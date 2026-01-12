// @ts-strict-ignore
import { isExternalURL } from "@dashboard/utils/urls";
import { TypographyProps } from "@material-ui/core/Typography";
import { sprinkles, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import * as React from "react";
import { Link as RouterLink } from "react-router-dom";

interface LinkState {
  from?: string;
}

// Note: we need to skip the `dangerouslySetInnerHTML` prop from the `React.AnchorHTMLAttributes`
// in order to match react-router-dom Link props
interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "dangerouslySetInnerHTML"> {
  href?: string;
  color?: "primary" | "secondary";
  inline?: boolean;
  underline?: boolean;
  typographyProps?: TypographyProps;
  onClick?: React.MouseEventHandler;
  disabled?: boolean;
  state?: LinkState;
}

export const Link = (props: LinkProps) => {
  const {
    className,
    children,
    inline = true,
    color: _color = "primary",
    underline = false,
    onClick,
    disabled,
    href,
    target,
    rel,
    state,
    ...linkProps
  } = props;
  const opensNewTab = target === "_blank";

  const linkClassName = clsx(
    sprinkles({
      cursor: disabled ? "not-allowed" : "pointer",
    }),
    className,
  );

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    if (disabled || !onClick) {
      return;
    }

    event.preventDefault();
    onClick(event);
  };

  const commonLinkProps = {
    className: linkClassName,
    onClick: handleClick,
    target,
    rel: (rel ?? (opensNewTab && isExternalURL(href))) ? "noopener noreferer" : "",
    ...linkProps,
  };
  const urlObject = new URL(href, window.location.origin);

  const textColor = disabled ? "default2" : "accent1";

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
          style={{
            display: inline ? "inline" : "block",
            fontSize: "inherit",
            textDecoration: underline ? "underline" : "none",
          }}
        >
          {children}
        </RouterLink>
      ) : (
        // @ts-expect-error - HTML anchor attributes don't perfectly match Text component types
        <Text
          as="a"
          href={disabled ? undefined : href}
          color={textColor}
          display={inline ? "inline-block" : "block"}
          textDecoration={underline ? "underline" : "none"}
          fontSize="inherit"
          {...commonLinkProps}
        >
          {children}
        </Text>
      )}
    </>
  );
};

Link.displayName = "Link";
export default Link;
