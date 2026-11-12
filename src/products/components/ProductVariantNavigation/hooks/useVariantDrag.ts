import { orderByIds } from "@dashboard/products/hooks/orderByIds";
import {
  type DragEndEvent,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useMemo, useRef, useState } from "react";

import { type ProductVariantItem } from "../types";

export interface VariantReorderMove {
  id: string;
  /** How many places the variant moves; negative is towards the start. */
  sortOrder: number;
}

interface UseVariantDragProps {
  /** Variants in the order the API has them. */
  variants: ProductVariantItem[];
  /**
   * Saves one move. A promise it returns must settle when the API has answered: resolved
   * when the move was saved, rejected when it wasn't.
   */
  onReorder: (move: VariantReorderMove) => void | Promise<unknown>;
  /** Called with the saved order once every waiting move has been sent. */
  onSaved?: (orderedIds: string[]) => void;
  /**
   * Called once every waiting move has been sent, if one of them was not saved. A move
   * whose answer got lost may still have reached the API, so this is the moment to ask it
   * for the order it has.
   */
  onFailed?: () => void;
}

// Kept out of the hook: new option objects on every render would make dnd-kit rebuild its
// sensors, and with them every sortable row.
/** A few pixels of travel before a drag starts, so a click on the grip is not a drag. */
const pointerSensorOptions = { activationConstraint: { distance: 4 } };
const keyboardSensorOptions = { coordinateGetter: sortableKeyboardCoordinates };

interface SaveQueue {
  /** Settles when the last queued save has. */
  tail: Promise<void>;
  waiting: number;
  failed: boolean;
  /** Order after the latest move the API accepted. */
  savedOrder: string[] | null;
}

/**
 * Drag-and-drop reordering that answers at once: a dropped variant stays where it was put
 * while its move is saved. Moves dropped in the meantime are saved one after another, since
 * each is relative to the list the one before left. If a save fails the list goes back to
 * the last order the API accepted.
 */
export const useVariantDrag = ({ variants, onReorder, onSaved, onFailed }: UseVariantDragProps) => {
  /** Order the merchant asked for, shown until the API's list has caught up. */
  const [requestedOrder, setRequestedOrder] = useState<string[] | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const queueRef = useRef<SaveQueue>({
    tail: Promise.resolve(),
    waiting: 0,
    failed: false,
    savedOrder: null,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, pointerSensorOptions),
    useSensor(KeyboardSensor, keyboardSensorOptions),
  );

  const orderedVariants = useMemo(
    () => (requestedOrder ? orderByIds(variants, variant => variant.id, requestedOrder) : variants),
    [variants, requestedOrder],
  );
  const items = useMemo(() => orderedVariants.map(variant => variant.id), [orderedVariants]);

  const handleDragStart = (event: DragStartEvent): void => {
    setActiveId(String(event.active.id));
  };

  const handleDragCancel = (): void => {
    setActiveId(null);
  };

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event;

    setActiveId(null);

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = items.indexOf(String(active.id));
    const newIndex = items.indexOf(String(over.id));

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const nextOrder = arrayMove(items, oldIndex, newIndex);
    const move: VariantReorderMove = { id: items[oldIndex], sortOrder: newIndex - oldIndex };
    const queue = queueRef.current;

    setRequestedOrder(nextOrder);
    queue.waiting += 1;
    queue.tail = queue.tail
      .then(async () => {
        // A move made on top of one that was not saved would land somewhere else.
        if (queue.failed) {
          return;
        }

        await onReorder(move);
        queue.savedOrder = nextOrder;
      })
      .catch(() => {
        queue.failed = true;
      })
      .then(() => {
        queue.waiting -= 1;

        if (queue.waiting > 0) {
          return;
        }

        if (queue.savedOrder) {
          onSaved?.(queue.savedOrder);
        }

        if (queue.failed) {
          onFailed?.();
        }

        queue.failed = false;
        queue.savedOrder = null;
        setRequestedOrder(null);
      });
  };

  return {
    /** Variants as they should be listed: the requested order while it is being saved. */
    orderedVariants,
    items,
    sensors,
    /** Variant being dragged right now. */
    activeId,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  };
};
