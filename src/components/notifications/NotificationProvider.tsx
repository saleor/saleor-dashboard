import { PropsWithChildren, useMemo } from "react";
import { toast, Toaster } from "sonner";

import { INotificationContext, NotificationContext } from ".";

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
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
