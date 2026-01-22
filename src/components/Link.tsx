import { isExternalURL } from "@dashboard/utils/urls";
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
  onClick?: React.MouseEventHandler;
  disabled?: boolean;
  state?: LinkState;
}

export const Link = (props: LinkProps): JSX.Element => {
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
    style,
    ...linkProps
  } = props;
  const opensNewTab = target === "_blank";

  const colorTheme = color === "primary" ? "accent1" : "default1";
  const textColor = disabled ? "default2" : colorTheme;

  const linkClassName = clsx(
    sprinkles({
      cursor: disabled ? "not-allowed" : "pointer",
      fontSize: "inherit",
      textDecoration: underline ? "underline" : "none",
      color: textColor,
    }),
    className,
  );

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    if (disabled) {
      return;
    }

    if (onClick) {
      // Only prevent default navigation for non-external links.
      if (href && !isExternalURL(href)) {
        event.preventDefault();
      }

      onClick(event);
    }
  };

  // Sprinkles doesn't support display: "inline", so we use inline styles for this
  const inlineStyle = {
    display: inline ? "inline" : undefined,
    ...style,
  } as const;

  const applySafeRelAttributes = opensNewTab && href && isExternalURL(href);

  const commonLinkProps = {
    className: linkClassName,
    onClick: handleClick,
    target,
    rel: rel ?? (applySafeRelAttributes ? "noopener noreferrer" : ""),
    style: inlineStyle,
    ...linkProps,
  } as const;

  if (href && !isExternalURL(href)) {
    const urlObject = new URL(href, window.location.origin);
    const routerLinkToParams = {
      pathname: urlObject.pathname,
      search: urlObject.search,
      hash: urlObject.hash,
      state,
    } as const;

    return (
      <RouterLink<LinkState>
        to={disabled ? "" : routerLinkToParams}
        {...commonLinkProps}
        aria-disabled={disabled}
      >
        {children}
      </RouterLink>
    );
  } else {
    return (
      // @ts-expect-error - spreading HTML link props on Text is not compatbile, fixme
      <Text
        as="a"
        href={disabled ? undefined : href}
        display="block"
        color={textColor}
        {...commonLinkProps}
      >
        {children}
      </Text>
    );
  }
};

Link.displayName = "Link";
/**
 * @deprecated use named export
 */
export default Link;
