import { TableRow, type TableRowProps } from "@dashboard/components/Table/Table";
import { isExternalURL } from "@dashboard/utils/urls";
import clsx from "clsx";
import type * as React from "react";
import { forwardRef } from "react";
import { Link, type LinkProps } from "react-router-dom";

import styles from "./TableRowLink.module.css";

type LocationDescriptor = LinkProps["to"];

export interface TableRowLinkProps extends Omit<TableRowProps, "onClick"> {
  children: React.ReactNode;
  href?: string | LocationDescriptor;
  className?: string;
  linkClassName?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const TableRowLink = forwardRef<HTMLTableRowElement, TableRowLinkProps>((props, ref) => {
  const { href, children, linkClassName, onClick, ...restProps } = props;

  if (!href || (typeof href === "string" && isExternalURL(href))) {
    return (
      <TableRow ref={ref} hover={!!onClick} onClick={onClick} {...restProps}>
        {children}
      </TableRow>
    );
  }

  return (
    <TableRow ref={ref} hover={true} onClick={onClick} {...restProps}>
      <Link className={clsx(styles.link, linkClassName)} to={href}>
        {children}
      </Link>
    </TableRow>
  );
});

TableRowLink.displayName = "TableRowLink";
export default TableRowLink;
