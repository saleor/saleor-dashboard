import { ReorderAction, ReorderEvent } from "@dashboard/types";
import {
  DndContext,
  DragOverEvent,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";
import { SortableContext } from "@dnd-kit/sortable";
import { Box, Text } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { createPortal } from "react-dom";

import { DraggableChip } from "../DraggableChip/DraggableChip";
import { SortableChip } from "./SortableChip";

export interface SortableChipsFieldValueType {
  label: string;
  value: string;
  url?: string;
}

export interface SortableChipsFieldProps {
  loading?: boolean;
  values: SortableChipsFieldValueType[];
  error?: boolean;
  helperText?: string;
  onValueDelete: (id: string) => void;
  onValueReorder: ReorderAction;
}

/** We cannot use any sorting strategy from @dnd-kit
 * this is because our layout is dynamic and the library cannot calculate
 * position of elements. It's explained in this issue:
 * https://github.com/clauderic/dnd-kit/issues/44#issuecomment-757312037
 * */
function disableSortingStrategy() {
  return null;
}

const SortableChipsField: React.FC<SortableChipsFieldProps> = ({
  loading,
  values,
  error,
  helperText,
  onValueDelete,
  onValueReorder,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
    document.body.style.cursor = "grabbing";
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = values.findIndex(item => item.value === active.id);
      const newIndex = values.findIndex(item => item.value === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        onValueReorder({ oldIndex, newIndex } as ReorderEvent);
      }
    }
  };

  const handleDragEnd = () => {
    document.body.style.cursor = "";
    setActiveId(null);
  };

  const itemIds = values.map(item => item.value);
  const activeItem = activeId ? values.find(item => item.value === activeId) : null;

  return (
    <Box>
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragEnd}
        modifiers={[restrictToFirstScrollableAncestor]}
      >
        <SortableContext items={itemIds} strategy={disableSortingStrategy}>
          <Box display="flex" flexWrap="wrap" gap={2}>
            {values.map(value => (
              <SortableChip
                key={value.value}
                id={value.value}
                label={value.label}
                url={value.url}
                loading={loading}
                onClose={() => onValueDelete(value.value)}
              />
            ))}
          </Box>
        </SortableContext>
        {createPortal(
          <DragOverlay>
            {activeId && activeItem ? (
              // Same as SortableChip but with no handlers from @dnd-kit
              // this is recommended approach by dnd-kit
              // https://docs.dndkit.com/api-documentation/draggable/drag-overlay#usage
              <DraggableChip label={activeItem.label} url={activeItem.url} loading={loading} />
            ) : null}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
      {error && (
        <Box marginTop={2}>
          <Text size={2} color="critical1">
            {helperText}
          </Text>
        </Box>
      )}
    </Box>
  );
};

SortableChipsField.displayName = "SortableChipsField";
export default SortableChipsField;
