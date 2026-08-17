import { borderHeight, savebarHeight } from "@dashboard/components/AppLayout/consts";
import { useSavebarRef } from "@dashboard/components/Savebar/SavebarRefContext";
import { type PropsWithChildren, type ReactNode, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { toast, Toaster } from "sonner";

import { type INotificationContext, NotificationContext } from "./NotificationContext";
import { dismissAllToasts, MAX_VISIBLE_TOASTS } from "./notificationQueue";
import styles from "./NotificationsToaster.module.css";
import { ToastDismissAll } from "./ToastDismissAll";
import { ToastStackSync } from "./ToastStackSync";

const stopPropagation = (e: React.SyntheticEvent): void => {
  e.stopPropagation();
};

/** Equal gap above and below the dismiss pill. */
const TOAST_DISMISS_GAP_PX = 10;

/** Horizontal inset from the viewport edge. */
const TOAST_EDGE_INSET_PX = 20;

/** Vertical gap between expanded toasts. */
const TOAST_STACK_GAP_PX = 12;

/**
 * Viewport toaster. Must render under SavebarRefProvider so bottom offset can
 * clear the sticky Savebar — most notifies fire from Save on detail pages.
 */
export const NotificationsToaster = (): ReactNode => {
  const { isSavebarMounted } = useSavebarRef();
  const viewportRef = useRef<HTMLDivElement>(null);
  const container = document.getElementById("toast-portal");

  if (!container) {
    return null;
  }

  const bottomOffset = isSavebarMounted
    ? `calc(${savebarHeight} + ${borderHeight} + ${TOAST_DISMISS_GAP_PX}px)`
    : `${TOAST_DISMISS_GAP_PX}px`;

  return createPortal(
    // Stop event propagation to prevent clicks on toasts from closing modals
    <div
      ref={viewportRef}
      className={styles.viewport}
      style={{ bottom: bottomOffset, right: TOAST_EDGE_INSET_PX }}
      onClick={stopPropagation}
      onPointerDown={stopPropagation}
    >
      <ToastDismissAll />
      <Toaster
        className={styles.toaster}
        position="bottom-right"
        // Always expanded — Sonner absolute + --offset stacking (see ToastStackSync).
        expand
        gap={TOAST_STACK_GAP_PX}
        // Queue owns the visible cap; leave headroom so exiting toasts can animate out.
        visibleToasts={MAX_VISIBLE_TOASTS + 3}
        offset={{
          bottom: 0,
          right: 0,
        }}
      />
      <ToastStackSync gapPx={TOAST_STACK_GAP_PX} containerRef={viewportRef} />
    </div>,
    container,
  );
};

const NotificationProvider = ({ children }: PropsWithChildren): ReactNode => {
  const context = useMemo<INotificationContext>(
    () => ({
      remove: (id: number): void => {
        toast.dismiss(id);
      },
      clearErrorNotifications: (): void => {
        dismissAllToasts();
      },
    }),
    [],
  );

  return <NotificationContext.Provider value={context}>{children}</NotificationContext.Provider>;
};

export { NotificationProvider };
