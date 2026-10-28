import { type PointerEvent, useCallback, useRef } from "react";

import { getDrawerOffset, getSwipeAxis, shouldDismissDrawer, type SwipeAxis } from "./drawerSwipe";

const SLIDE_OUT_MS = 180;
const SETTLE_MS = 200;
const EASING = "cubic-bezier(0.2, 0, 0, 1)";
/** A pause before lifting the finger means it was placed, not flicked. */
const VELOCITY_STALE_AFTER_MS = 100;

interface Gesture {
  pointerId: number;
  startX: number;
  startY: number;
  axis: SwipeAxis | null;
  offset: number;
  lastX: number;
  lastTime: number;
  velocity: number;
}

export type SwipePointerEvent = Pick<
  PointerEvent<HTMLElement>,
  "pointerId" | "pointerType" | "isPrimary" | "clientX" | "clientY" | "timeStamp" | "currentTarget"
>;

interface SwipeHandlers {
  onPointerDown: (event: SwipePointerEvent) => void;
  onPointerMove: (event: SwipePointerEvent) => void;
  onPointerUp: (event: SwipePointerEvent) => void;
  onPointerCancel: (event: SwipePointerEvent) => void;
}

const prefersReducedMotion = (): boolean =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

/** Radix portals the overlay right before the panel. */
const getOverlay = (panel: HTMLElement): HTMLElement | null => {
  const sibling = panel.previousElementSibling;

  return sibling instanceof HTMLElement && sibling.dataset.state !== undefined ? sibling : null;
};

const transitionFor = (durationMs: number): string =>
  `transform ${durationMs}ms ${EASING}, opacity ${durationMs}ms ${EASING}`;

const moveDrawer = (panel: HTMLElement, offset: number, transition = "none"): void => {
  const overlay = getOverlay(panel);
  const progress = panel.offsetWidth > 0 ? Math.min(1, -offset / panel.offsetWidth) : 0;

  panel.style.transition = transition;
  panel.style.transform = offset === 0 ? "" : `translateX(${offset}px)`;

  if (overlay) {
    overlay.style.transition = transition;
    overlay.style.opacity = progress === 0 ? "" : String(1 - progress);
  }
};

/**
 * Drags the drawer panel with a leftward touch swipe and slides it out on dismiss. The panel is
 * moved through its style directly, so following the finger does not re-render the navigation.
 */
export const useDrawerSwipe = ({
  onDismiss,
}: {
  onDismiss: () => void;
}): { swipeHandlers: SwipeHandlers; dismiss: (panel: HTMLElement) => void } => {
  const gesture = useRef<Gesture | null>(null);

  const dismiss = useCallback(
    (panel: HTMLElement) => {
      if (prefersReducedMotion()) {
        onDismiss();

        return;
      }

      // The opening animation would otherwise hold the panel in place.
      panel.style.animation = "none";
      moveDrawer(panel, -panel.offsetWidth, transitionFor(SLIDE_OUT_MS));
      window.setTimeout(onDismiss, SLIDE_OUT_MS);
    },
    [onDismiss],
  );

  const settle = (panel: HTMLElement): void => {
    moveDrawer(panel, 0, transitionFor(SETTLE_MS));
  };

  const onPointerDown = (event: SwipePointerEvent): void => {
    if (event.pointerType === "mouse" || !event.isPrimary) {
      return;
    }

    gesture.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      axis: null,
      offset: 0,
      lastX: event.clientX,
      lastTime: event.timeStamp,
      velocity: 0,
    };
  };

  const onPointerMove = (event: SwipePointerEvent): void => {
    const current = gesture.current;

    if (!current || current.pointerId !== event.pointerId) {
      return;
    }

    const dx = event.clientX - current.startX;

    if (current.axis === null) {
      current.axis = getSwipeAxis({ dx, dy: event.clientY - current.startY });

      if (current.axis === "vertical") {
        gesture.current = null;

        return;
      }

      if (current.axis === "horizontal") {
        event.currentTarget.setPointerCapture(event.pointerId);
      }
    }

    if (current.axis !== "horizontal") {
      return;
    }

    const elapsed = event.timeStamp - current.lastTime;

    if (elapsed > 0) {
      current.velocity = (event.clientX - current.lastX) / elapsed;
    }

    current.lastX = event.clientX;
    current.lastTime = event.timeStamp;
    current.offset = getDrawerOffset(dx);
    moveDrawer(event.currentTarget, current.offset);
  };

  const onPointerUp = (event: SwipePointerEvent): void => {
    const current = gesture.current;

    gesture.current = null;

    if (!current || current.axis !== "horizontal") {
      return;
    }

    const panel = event.currentTarget;
    const isVelocityStale = event.timeStamp - current.lastTime > VELOCITY_STALE_AFTER_MS;
    const release = {
      offset: current.offset,
      width: panel.offsetWidth,
      velocity: isVelocityStale ? 0 : current.velocity,
    };

    if (shouldDismissDrawer(release)) {
      dismiss(panel);
    } else {
      settle(panel);
    }
  };

  const onPointerCancel = (event: SwipePointerEvent): void => {
    const current = gesture.current;

    gesture.current = null;

    if (current?.axis === "horizontal") {
      settle(event.currentTarget);
    }
  };

  return {
    swipeHandlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel },
    dismiss,
  };
};
