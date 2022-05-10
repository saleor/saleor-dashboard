import { TableRow, TableRowTypeMap } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { isExternalURL } from "@saleor/utils/urls";
import clsx from "classnames";
import React from "react";
import { Link } from "react-router-dom";

type MaterialTableRowPropsType = TableRowTypeMap["props"];

export interface TableRowLinkProps
  extends Omit<MaterialTableRowPropsType, "onClick"> {
  children: React.ReactNode;
  href?: string;
  className?: string;
  linkClassName?: string;
}

const useStyles = makeStyles(
  {
    link: {
      all: "inherit",
      display: "contents"
    }
  },
  { name: "TableRowLink" }
);

const TableRowLink = ({
  href,
  children,
  linkClassName,
  ...props
}: TableRowLinkProps) => {
  const classes = useStyles();

  const handleClickCapture = (e: React.MouseEvent<unknown>) => {
    if ((e.target as HTMLElement).tagName !== "TD") {
      e.preventDefault();
    }
  };

  if (!href || isExternalURL(href)) {
    return <TableRow {...props}>{children}</TableRow>;
  }

  return (
    <TableRow {...props}>
      <Link
        className={clsx(classes.link, linkClassName)}
        to={href}
        onClickCapture={handleClickCapture}
      >
        {children}
      </Link>
    </TableRow>
  );
};

TableRowLink.displayName = "TableRowLink";
export default TableRowLink;
