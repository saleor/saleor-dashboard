import React from "react";

interface TableButtonWrapper {
  children: React.ReactElement<{
    onClick?: (e: React.MouseEvent<any>) => void;
    href?: string;
  }>;
}

/**
 * Wraps any `Button` or `Link` used inside `TableRowLink` to handle events properly
 *
 * @example
 * ```jsx
 * <TableButtonWrapper>
 *   <Button href="/some-page" />
 * </TableButtonWrapper>
 * ```
 */
export const TableButtonWrapper = <T extends HTMLElement>({
  children,
}: // eslint-disable-next-line @typescript-eslint/no-unused-vars
TableButtonWrapper) => {
  const onClick = (e: React.MouseEvent<T>) => {
    if (!children.props.href) {
      // <TableRowLink> is a <a> that wraps each <tr>
      // This causes buttons to act like links rather than buttons
      // The events isn't boubled up to react-router's link, rather
      // browser makes full page navigation directly, so we need to stop that
      e.preventDefault();
    }
    // Stop propagation of clicks to the <Link> component, to prevent navigation
    e.stopPropagation();

    if (children.props.onClick) {
      children.props.onClick(e);
    }
  };

  if (React.isValidElement(children)) {
    return React.cloneElement(children, { ...children.props, onClick });
  }

  return children;
};
