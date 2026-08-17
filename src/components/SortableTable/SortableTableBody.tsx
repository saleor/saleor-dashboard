import { useSuppressClickAfterDrag } from "@dashboard/hooks/useSuppressClickAfterDrag";
import { type ReorderAction } from "@dashboard/types";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TableBody } from "@material-ui/core";
import { type TableBodyProps } from "@material-ui/core/TableBody";
import clsx from "clsx";
import { cloneElement, type ReactElement, useCallback, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import styles from "./SortableTableBody.module.css";
import { type SortableTableRowProps } from "./SortableTableRow";
import rowStyles from "./SortableTableRow.module.css";
import {
  findActivatorTableRow,
  findSortableRow,
  getSortableRowIds,
  measureTableRowCellWidths,
} from "./sortableTableRows";
import { SortableTableStateContext } from "./sortableTableState";

interface SortableTableBodyProps {
  onSortEnd: ReorderAction;
  disabled?: boolean;
}

type SortableTableBodyComponentProps = Omit<TableBodyProps & SortableTableBodyProps, "ref">;

interface OverlayMetrics {
  width: number;
  cellWidths: number[];
}

/**
 * Vertical lists use `verticalListSortingStrategy` so neighbors translate and
 * open a gap. DragOverlay is required because the table wrapper clips overflow;
 * cells are measured so the clone keeps the source column widths.
 * Post-drop layout animation is disabled on the row — otherwise items tween
 * from the old index (falling from the top).
 */

const clearTextSelection = (): void => {
  window.getSelection()?.removeAllRanges();
};

const getOverlayMetrics = (event: DragStartEvent): OverlayMetrics => {
  const fallbackWidth =
    event.active.rect.current.translated?.width ?? event.active.rect.current.initial?.width ?? 0;
  const row = findActivatorTableRow(event.activatorEvent.target);
  const cellWidths = row ? measureTableRowCellWidths(row) : [];
  const measuredWidth = cellWidths.reduce((sum, cellWidth) => sum + cellWidth, 0);

  return {
    width: measuredWidth > 0 ? measuredWidth : fallbackWidth,
    cellWidths,
  };
};

export const SortableTableBody = ({
  disabled = false,
  children,
  className,
  onSortEnd,
  ...props
}: SortableTableBodyComponentProps): JSX.Element => {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [overlayMetrics, setOverlayMetrics] = useState<OverlayMetrics | null>(null);
  const suppressClickAfterDrag = useSuppressClickAfterDrag();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const items = useMemo(() => getSortableRowIds(children), [children]);
  const activeRow = useMemo(() => findSortableRow(children, activeId), [activeId, children]);
  const isSorting = activeId != null;

  const handleDragStart = useCallback((event: DragStartEvent) => {
    clearTextSelection();
    setActiveId(event.active.id);
    setOverlayMetrics(getOverlayMetrics(event));
  }, []);

  const stopDragging = useCallback(() => {
    setActiveId(null);
    setOverlayMetrics(null);
    suppressClickAfterDrag();
  }, [suppressClickAfterDrag]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!disabled && over && active.id !== over.id) {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        if (oldIndex >= 0 && newIndex >= 0) {
          onSortEnd({ oldIndex, newIndex });
        }
      }

      stopDragging();
    },
    [disabled, items, onSortEnd, stopDragging],
  );

  return (
    <SortableTableStateContext.Provider value={{ disabled, isSorting }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={stopDragging}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <TableBody
            className={clsx(styles.body, isSorting && styles.dragging, className)}
            {...props}
          >
            {children}
          </TableBody>
        </SortableContext>
        {createPortal(
          <DragOverlay
            dropAnimation={null}
            className={rowStyles.overlayHost}
            style={{ zIndex: 1000 }}
          >
            {activeRow && overlayMetrics ? (
              <table
                aria-hidden
                className={rowStyles.overlayTable}
                style={overlayMetrics.width ? { width: overlayMetrics.width } : undefined}
              >
                {overlayMetrics.cellWidths.length > 0 ? (
                  <colgroup>
                    {overlayMetrics.cellWidths.map((width, index) => (
                      <col key={index} style={{ width }} />
                    ))}
                  </colgroup>
                ) : null}
                <tbody>
                  {cloneElement(activeRow as ReactElement<SortableTableRowProps>, {
                    overlay: true,
                    href: undefined,
                    onClick: undefined,
                  })}
                </tbody>
              </table>
            ) : null}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </SortableTableStateContext.Provider>
  );
};

SortableTableBody.displayName = "SortableTableBody";
