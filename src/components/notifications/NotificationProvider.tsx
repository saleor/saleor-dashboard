import "./sonnerStyles.css";

import { useTheme } from "@saleor/macaw-ui-next";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { CSSProperties, PropsWithChildren } from "react";
import { toast, Toaster } from "sonner";

import { INotificationContext, NotificationContext } from ".";
import { ToastDebug } from "./ToastDebug";

const NotificationProvider = ({ children }: PropsWithChildren) => {
  const { theme, themeValues } = useTheme();
  const isDark = theme === "defaultDark";

  const context: INotificationContext = {
    show: () => {},
    remove: (id: number) => {
      toast.dismiss(id);
    },
    clearErrorNotifications: () => {
      toast.dismiss();
    },
  };

  const toasterStyle = {
    "--toast-bg": themeValues?.colors.background.default1,
    "--toast-border": themeValues?.colors.border.default1,
    "--toast-text": themeValues?.colors.text.default1,
    "--toast-text-secondary": themeValues?.colors.text.default2,
    // Success toast colors - light vs dark
    "--toast-success-bg": isDark ? "oklch(25% 0.04 145)" : "oklch(97% 0.04 145)",
    "--toast-success-border": isDark ? "oklch(35% 0.06 145)" : "oklch(90% 0.06 145)",
  } as CSSProperties;

  return (
    <NotificationContext.Provider value={context}>
      {children}
      <Toaster
        position="top-right"
        expand={false}
        gap={8}
        closeButton
        theme={isDark ? "dark" : "light"}
        style={toasterStyle}
        icons={{
          success: <CheckCircle2 size={20} />,
          error: <XCircle size={20} />,
          warning: <AlertTriangle size={20} />,
          info: <Info size={20} />,
        }}
      />
      <ToastDebug />
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
