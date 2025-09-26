// @ts-strict-ignore
import { TableRowProps } from "@material-ui/core";
import { SortableElement, SortableElementProps } from "react-sortable-hoc";

import TableRowLink, { TableRowLinkProps } from "../TableRowLink";
import SortableHandle from "./SortableHandle";

type SortableTableRowTypesUnion = "link" | "row";

type SortableTableRowProps<T extends SortableTableRowTypesUnion> = T extends "link"
  ? TableRowLinkProps
  : TableRowProps;

/** @deprecated This component should use @dnd-kit instead of react-sortable-hoc */
export const SortableTableRow = SortableElement<any>(({ children, ...props }) => (
  <TableRowLink {...props}>
    <SortableHandle />
    {children}
  </TableRowLink>
)) as unknown as <T extends SortableTableRowTypesUnion = "link">(
  props: SortableElementProps & SortableTableRowProps<T>,
) => JSX.Element;
