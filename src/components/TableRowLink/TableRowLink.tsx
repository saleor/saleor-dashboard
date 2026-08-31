import { TableRow, type TableRowProps } from "@dashboard/components/Table/Table";
import { isExternalURL } from "@dashboard/utils/urls";
import { makeStyles } from "@saleor/macaw-ui";
import clsx from "clsx";
import type * as React from "react";
import { forwardRef } from "react";
import { Link, type LinkProps } from "react-router-dom";

type LocationDescriptor = LinkProps["to"];

export interface TableRowLinkProps extends Omit<TableRowProps, "onClick"> {
  children: React.ReactNode;
  href?: string | LocationDescriptor;
  className?: string;
  linkClassName?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const useStyles = makeStyles(
  {
    link: {
      all: "inherit",
      display: "contents",
    },
  },
  { name: "TableRowLink" },
);

const TableRowLink = forwardRef<HTMLTableRowElement, TableRowLinkProps>((props, ref) => {
  const { href, children, linkClassName, onClick, ...restProps } = props;
  const classes = useStyles();

  if (!href || (typeof href === "string" && isExternalURL(href))) {
    return (
      <TableRow ref={ref} hover={!!onClick} onClick={onClick} {...restProps}>
        {children}
      </TableRow>
    );
  }

  return (
    <TableRow ref={ref} hover={true} onClick={onClick} {...restProps}>
      <Link className={clsx(classes.link, linkClassName)} to={href}>
        {children}
      </Link>
    </TableRow>
  );
});

TableRowLink.displayName = "TableRowLink";
export default TableRowLink;
