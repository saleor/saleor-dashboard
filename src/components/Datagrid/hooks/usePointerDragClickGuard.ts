import { type MouseEventHandler, type PointerEventHandler, useCallback, useRef } from "react";

const DRAG_THRESHOLD_PX = 6;

interface PointerPosition {
  id: number;
  x: number;
  y: number;
}

interface PointerDragClickGuard {
  onClickCapture: MouseEventHandler<HTMLElement>;
  onPointerCancelCapture: PointerEventHandler<HTMLElement>;
  onPointerDownCapture: PointerEventHandler<HTMLElement>;
  onPointerMoveCapture: PointerEventHandler<HTMLElement>;
  onPointerUpCapture: PointerEventHandler<HTMLElement>;
  shouldSuppressClick: () => boolean;
}

/**
 * Distinguishes a tap from a drag before Glide turns pointerup into onCellClicked.
 * The capture handlers also cover native row anchors rendered over readonly grids.
 */
export const usePointerDragClickGuard = (onDrag?: () => void): PointerDragClickGuard => {
  const pointerRef = useRef<PointerPosition | null>(null);
  const draggedRef = useRef(false);

  const markAsDragged = useCallback((): void => {
    if (draggedRef.current) {
      return;
    }

    draggedRef.current = true;
    onDrag?.();
  }, [onDrag]);

  const onPointerDownCapture = useCallback<PointerEventHandler<HTMLElement>>(event => {
    if (event.isPrimary === false) {
      return;
    }

    pointerRef.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
    draggedRef.current = false;
  }, []);

  const onPointerMoveCapture = useCallback<PointerEventHandler<HTMLElement>>(
    event => {
      const pointer = pointerRef.current;

      if (!pointer || pointer.id !== event.pointerId || draggedRef.current) {
        return;
      }

      const deltaX = Math.abs(event.clientX - pointer.x);
      const deltaY = Math.abs(event.clientY - pointer.y);

      if (deltaX > DRAG_THRESHOLD_PX || deltaY > DRAG_THRESHOLD_PX) {
        markAsDragged();
      }
    },
    [markAsDragged],
  );

  const onPointerUpCapture = useCallback<PointerEventHandler<HTMLElement>>(event => {
    if (pointerRef.current?.id === event.pointerId) {
      pointerRef.current = null;
    }
  }, []);

  const onPointerCancelCapture = useCallback<PointerEventHandler<HTMLElement>>(
    event => {
      if (pointerRef.current?.id !== event.pointerId) {
        return;
      }

      pointerRef.current = null;
      markAsDragged();
    },
    [markAsDragged],
  );

  const shouldSuppressClick = useCallback((): boolean => {
    if (!draggedRef.current) {
      return false;
    }

    draggedRef.current = false;

    return true;
  }, []);

  const onClickCapture = useCallback<MouseEventHandler<HTMLElement>>(
    event => {
      if (!shouldSuppressClick()) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
    },
    [shouldSuppressClick],
  );

  return {
    onClickCapture,
    onPointerCancelCapture,
    onPointerDownCapture,
    onPointerMoveCapture,
    onPointerUpCapture,
    shouldSuppressClick,
  };
};
