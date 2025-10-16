import { ReorderAction } from "@dashboard/types";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";
import { SortableContext } from "@dnd-kit/sortable";
import { Box, Button, PlusIcon, Text } from "@saleor/macaw-ui-next";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useIntl } from "react-intl";

import { Draggable } from "../Draggable/Draggable";
import { SortableChip } from "../SortableChip/SortableChip";
import { useActiveDragId } from "./useActiveDragId";
import { useSortableDragOver } from "./useSortableDragOver";

export interface SortableChipsFieldValueType {
  label: string;
  value: string;
  url?: string;
}

interface SortableChipsFieldProps {
  loading?: boolean;
  disabled?: boolean;
  values: SortableChipsFieldValueType[];
  error?: boolean;
  helperText?: string;
  onValueDelete: (id: string) => void;
  onValueReorder: ReorderAction;
  onAdd?: () => void;
}

/** We cannot use any sorting strategy from @dnd-kit
 * this is because our layout is dynamic and the library cannot calculate
 * position of elements. It's explained in this issue:
 * https://github.com/clauderic/dnd-kit/issues/44#issuecomment-757312037
 *
 * We instead rely on updating **actual** order of elements which re-renders page.
 * Dragged element is displayed as shadow. This works with our flexbox layout.
 * */
function disableSortingStrategy() {
  return null;
}

const MAX_VISIBLE_CHIPS = 5;

const SortableChipsField = ({
  loading,
  disabled,
  values,
  error,
  helperText,
  onValueDelete,
  onValueReorder,
  onAdd,
}: SortableChipsFieldProps) => {
  const intl = useIntl();
  const { activeId, handleDragStart, handleDragEnd } = useActiveDragId();
  const { handleDragOver } = useSortableDragOver({
    items: values,
    onReorder: onValueReorder,
  });

  const [showAllChips, setShowAllChips] = useState(false);
  const hasHiddenChips = values.length > MAX_VISIBLE_CHIPS;
  const hiddenChipsCount = hasHiddenChips ? values.length - MAX_VISIBLE_CHIPS : 0;

  useEffect(() => {
    if (!hasHiddenChips && showAllChips) {
      setShowAllChips(false);
    }
  }, [hasHiddenChips, showAllChips]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const itemIdToValueMap = useMemo(() => {
    return new Map<UniqueIdentifier, SortableChipsFieldValueType>(
      (values || []).map(item => [item.value, item]),
    );
  }, [values]);

  const visibleValues =
    showAllChips || !hasHiddenChips ? values : values.slice(0, MAX_VISIBLE_CHIPS);
  const activeItem = itemIdToValueMap.get(activeId as UniqueIdentifier);

  return (
    <Box>
      <Box display="flex">
        <DndContext
          sensors={sensors}
          collisionDetection={pointerWithin}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragEnd}
          modifiers={[restrictToFirstScrollableAncestor]}
        >
          <SortableContext
            items={visibleValues.map(value => value.value)}
            strategy={disableSortingStrategy}
          >
            <Box display="flex" flexWrap="wrap" gap={2}>
              <>
                {visibleValues.map(value => (
                  <Draggable key={value.value} id={value.value} disabled={disabled}>
                    {({ isDragging, ...props }) => (
                      <SortableChip
                        label={value.label}
                        url={value.url}
                        loading={loading}
                        onClose={() => onValueDelete(value.value)}
                        // Overlay is the shadow that appears where element will be dropped
                        // while dragging
                        isDraggedOverlay={isDragging}
                        {...props}
                      />
                    )}
                  </Draggable>
                ))}
              </>
            </Box>
          </SortableContext>

          {createPortal(
            // Note: Ovelay is the element that user holds with mouse while dragging
            // this is exactly the same element as on the list, except it has no handlers for @dnd-kit
            // it moves with the cursor
            <DragOverlay>
              {activeId && activeItem ? (
                <SortableChip
                  label={activeItem.label}
                  url={activeItem.url}
                  loading={loading}
                  isDragged
                />
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

        {onAdd ? (
          <Button
            variant="secondary"
            disabled={disabled}
            marginLeft="auto"
            onClick={onAdd}
            icon={<PlusIcon />}
          />
        ) : null}
      </Box>
      {hasHiddenChips ? (
        <Box marginTop={2}>
          <Button
            variant="tertiary"
            disabled={disabled}
            onClick={() => setShowAllChips(prev => !prev)}
            size="small"
          >
            {showAllChips
              ? intl.formatMessage({
                  id: "qyJtWy",
                  defaultMessage: "Show less",
                })
              : intl.formatMessage(
                  {
                    id: "/zFGgP",
                    defaultMessage: "+{count} more",
                  },
                  { count: hiddenChipsCount },
                )}
          </Button>
        </Box>
      ) : null}
    </Box>
  );
};

SortableChipsField.displayName = "SortableChipsField";
export default SortableChipsField;
