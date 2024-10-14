import { isExternalURL } from "@dashboard/utils/urls";
import { TableRow, TableRowTypeMap } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import clsx from "clsx";
import React, { forwardRef } from "react";
import { Link, LinkProps } from "react-router-dom";

type MaterialTableRowPropsType = TableRowTypeMap["props"];

type LocationDescriptor = LinkProps["to"];

export interface TableRowLinkProps extends MaterialTableRowPropsType {
  children: React.ReactNode;
  href?: string | LocationDescriptor;
  className?: string;
  linkClassName?: string;
  onClick?: () => void;
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
