import { ReorderAction, ReorderEvent } from "@dashboard/types";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { Box, Text } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { createPortal } from "react-dom";

import SortableChip from "../SortableChip";

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
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
    document.body.style.cursor = "grabbing";
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    document.body.style.cursor = "";
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = values.findIndex((item) => item.value === active.id);
      const newIndex = values.findIndex((item) => item.value === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        onValueReorder({ oldIndex, newIndex } as ReorderEvent);
      }
    }
  };

  const handleDragCancel = () => {
    document.body.style.cursor = "";
    setActiveId(null);
  };

  const itemIds = values.map(item => item.value);
  const activeItem = activeId ? values.find(item => item.value === activeId) : null;

  return (
    <Box>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext items={itemIds} strategy={rectSortingStrategy}>
          <Box display="flex" flexWrap="wrap" gap={2}>
            {values.map((value) => (
              <SortableChip
                key={value.value}
                id={value.value}
                label={value.label}
                url={value.url}
                loading={loading}
                onClose={() => onValueDelete(value.value)}
                isDragging={activeId === value.value}
              />
            ))}
          </Box>
        </SortableContext>
        {createPortal(
          <DragOverlay>
            {activeId && activeItem ? (
              <SortableChip
                id={activeItem.value}
                label={activeItem.label}
                url={activeItem.url}
                loading={loading}
                isDragging={true}
              />
            ) : null}
          </DragOverlay>,
          document.body
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
