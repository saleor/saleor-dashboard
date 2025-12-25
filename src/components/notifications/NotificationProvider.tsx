import "./notifications.css";

import { PropsWithChildren, useMemo } from "react";
import { toast, Toaster } from "sonner";

import { INotificationContext, NotificationContext } from ".";
import { ToastDebug } from "./ToastDebug";

const NotificationProvider = ({ children }: PropsWithChildren) => {
  const context = useMemo<INotificationContext>(
    () => ({
      show: () => {},
      remove: (id: number) => {
        toast.dismiss(id);
      },
      clearErrorNotifications: () => {
        toast.dismiss();
      },
    }),
    [],
  );

  return (
    <NotificationContext.Provider value={context}>
      {children}
      <Toaster position="top-right" expand={false} gap={8} visibleToasts={5} />
      <ToastDebug />
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
