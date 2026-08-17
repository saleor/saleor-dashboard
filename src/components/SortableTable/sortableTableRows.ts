import { type UniqueIdentifier } from "@dnd-kit/core";
import { Children, isValidElement, type ReactElement, type ReactNode } from "react";

export const getRowSortableId = (element: ReactElement): UniqueIdentifier | null => {
  const props = element.props as { id?: UniqueIdentifier; index?: number };

  if (props.id != null) {
    return props.id;
  }

  if (props.index != null) {
    return props.index;
  }

  return null;
};

export const getSortableRowIds = (children: ReactNode): UniqueIdentifier[] =>
  Children.toArray(children).flatMap(child => {
    if (!isValidElement(child)) {
      return [];
    }

    const id = getRowSortableId(child);

    return id == null ? [] : [id];
  });

export const findSortableRow = (
  children: ReactNode,
  activeId: UniqueIdentifier | null,
): ReactElement | null => {
  if (activeId == null) {
    return null;
  }

  for (const child of Children.toArray(children)) {
    if (!isValidElement(child)) {
      continue;
    }

    if (getRowSortableId(child) === activeId) {
      return child;
    }
  }

  return null;
};

export const findActivatorTableRow = (
  eventTarget: EventTarget | null,
): HTMLTableRowElement | null => {
  if (!(eventTarget instanceof Element)) {
    return null;
  }

  return eventTarget.closest("tr");
};

export const measureTableRowCellWidths = (row: Element): number[] =>
  Array.from(row.querySelectorAll("td")).map(cell => cell.getBoundingClientRect().width);
