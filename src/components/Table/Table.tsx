import clsx from "clsx";
import {
  createContext,
  forwardRef,
  type HTMLAttributes,
  type TableHTMLAttributes,
  type TdHTMLAttributes,
  useContext,
} from "react";

import styles from "./Table.module.css";

/**
 * Native `<table>` primitives replacing the `@material-ui/core` ones.
 *
 * The prop surface is intentionally a subset of the MUI API — only what the
 * dashboard actually used — so call sites change nothing but their import.
 */

type TableSection = "head" | "body" | "footer";

/** Lets `TableCell` pick `<th>` vs `<td>`, the way MUI's Tablelvl2Context did. */
const TableSectionContext = createContext<TableSection>("body");

type TableProps = TableHTMLAttributes<HTMLTableElement>;

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, children, ...rest }, ref) => (
    <table ref={ref} className={clsx(styles.table, className)} {...rest}>
      {children}
    </table>
  ),
);

Table.displayName = "Table";

export type TableSectionProps = HTMLAttributes<HTMLTableSectionElement>;

export const TableHead = forwardRef<HTMLTableSectionElement, TableSectionProps>(
  ({ children, ...rest }, ref) => (
    <TableSectionContext.Provider value="head">
      <thead ref={ref} {...rest}>
        {children}
      </thead>
    </TableSectionContext.Provider>
  ),
);

TableHead.displayName = "TableHead";

export const TableBody = forwardRef<HTMLTableSectionElement, TableSectionProps>(
  ({ children, ...rest }, ref) => (
    <TableSectionContext.Provider value="body">
      <tbody ref={ref} {...rest}>
        {children}
      </tbody>
    </TableSectionContext.Provider>
  ),
);

TableBody.displayName = "TableBody";

export const TableFooter = forwardRef<HTMLTableSectionElement, TableSectionProps>(
  ({ children, ...rest }, ref) => (
    <TableSectionContext.Provider value="footer">
      <tfoot ref={ref} {...rest}>
        {children}
      </tfoot>
    </TableSectionContext.Provider>
  ),
);

TableFooter.displayName = "TableFooter";

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /** Highlights the row on pointer hover. */
  hover?: boolean;
  selected?: boolean;
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, children, hover, selected, ...rest }, ref) => (
    <tr
      ref={ref}
      className={clsx(
        styles.row,
        hover && styles.rowHover,
        selected && styles.rowSelected,
        className,
      )}
      {...rest}
    >
      {children}
    </tr>
  ),
);

TableRow.displayName = "TableRow";

const alignClass = {
  center: styles.alignCenter,
  justify: styles.alignJustify,
  left: undefined,
  right: styles.alignRight,
};

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  align?: keyof typeof alignClass;
  padding?: "checkbox" | "none" | "normal";
  /** Overrides the `<th>`/`<td>` choice inherited from the parent section. */
  variant?: TableSection;
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ align, className, children, padding = "normal", variant, ...rest }, ref) => {
    const section = useContext(TableSectionContext);
    const resolved = variant ?? section;
    const Component = resolved === "head" ? "th" : "td";

    return (
      <Component
        ref={ref}
        scope={resolved === "head" ? "col" : undefined}
        className={clsx(
          styles.cell,
          resolved === "head" && styles.cellHead,
          resolved === "footer" && styles.cellFooter,
          padding === "checkbox" && styles.cellPaddingCheckbox,
          padding === "none" && styles.cellPaddingNone,
          align && alignClass[align],
          className,
        )}
        {...rest}
      >
        {children}
      </Component>
    );
  },
);

TableCell.displayName = "TableCell";
