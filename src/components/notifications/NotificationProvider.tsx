import { PropsWithChildren, ReactNode, useMemo } from "react";
import { createPortal } from "react-dom";
import { toast, Toaster } from "sonner";

import { INotificationContext, NotificationContext } from ".";

const stopPropagation = (e: React.SyntheticEvent): void => {
  e.stopPropagation();
};

const ToasterPortal = (): ReactNode => {
  const container = document.getElementById("toast-portal");

  if (!container) {
    return null;
  }

  return createPortal(
    // Stop event propagation to prevent clicks on toasts from closing modals
    <div onClick={stopPropagation} onPointerDown={stopPropagation}>
      <Toaster position="top-right" expand={false} gap={8} visibleToasts={5} />
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
        toast.dismiss();
      },
    }),
    [],
  );

  return (
    <NotificationContext.Provider value={context}>
      {children}
      <ToasterPortal />
    </NotificationContext.Provider>
  );
};

export { NotificationProvider };
