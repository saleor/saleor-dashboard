import { TableRow, TableRowTypeMap } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { isExternalURL } from "@saleor/utils/urls";
import clsx from "clsx";
import React from "react";
import { Link } from "react-router-dom";

type MaterialTableRowPropsType = TableRowTypeMap["props"];

export interface TableRowLinkProps extends MaterialTableRowPropsType {
  children: React.ReactNode;
  href?: string;
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

const TableRowLink = ({
  href,
  children,
  linkClassName,
  onClick,
  ...props
}: TableRowLinkProps) => {
  const classes = useStyles();

  if (!href || isExternalURL(href)) {
    return (
      <TableRow hover={!!onClick} onClick={onClick} {...props}>
        {children}
      </TableRow>
    );
  }

  return (
    <TableRow hover={true} onClick={onClick} {...props}>
      <Link className={clsx(classes.link, linkClassName)} to={href}>
        {children}
      </Link>
    </TableRow>
  );
};

TableRowLink.displayName = "TableRowLink";
export default TableRowLink;
