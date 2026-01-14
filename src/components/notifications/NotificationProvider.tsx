import { PropsWithChildren, useMemo } from "react";
import { toast, Toaster } from "sonner";

import { useRegisterDevTool } from "../DevTools";
import { INotificationContext, NotificationContext } from ".";
import { NotificationsDebugPanel } from "./NotificationsDebugPanel";

const NotificationProvider = ({ children }: PropsWithChildren) => {
  useRegisterDevTool({
    id: "notifications",
    label: "Notifications",
    component: NotificationsDebugPanel,
  });

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
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
