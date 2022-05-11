import React from "react";

interface TableButtonWrapper {
  children: React.ReactElement<{
    onClick?: (e: React.MouseEvent<any>) => void;
    href?: string;
  }>;
}

export const TableButtonWrapper = <T extends HTMLElement>({
  children
}: TableButtonWrapper) => {
  const onClick = (e: React.MouseEvent<T>) => {
    if (!children.props.href) {
      e.preventDefault();
    }
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
