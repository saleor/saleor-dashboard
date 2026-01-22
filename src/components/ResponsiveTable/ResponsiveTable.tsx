import { Table } from "@material-ui/core";
import clsx from "clsx";
import * as React from "react";

import styles from "./ResponsiveTable.module.css";

interface ResponsiveTableProps {
  children: React.ReactNode | React.ReactNodeArray;
  className?: string;
  onMouseLeave?: () => void;
  key?: string;
}

export const ResponsiveTable = (props: ResponsiveTableProps) => {
  const { children, className, onMouseLeave } = props;

  return (
    <div className={styles.wrapper}>
      <Table className={clsx(styles.table, className)} onMouseLeave={onMouseLeave}>
        {children}
      </Table>
    </div>
  );
};

ResponsiveTable.displayName = "ResponsiveTable";
