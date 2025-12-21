import { Box, Button, Text, useTheme } from "@saleor/macaw-ui-next";
import { AlertTriangle, CheckCircle2, Info, LucideIcon, X, XCircle } from "lucide-react";
import { ReactNode } from "react";
import { toast } from "sonner";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastStyles {
  iconColor: "success1" | "critical1" | "warning1" | "default1";
  Icon: LucideIcon;
}

const toastStylesMap: Record<ToastType, ToastStyles> = {
  success: {
    iconColor: "success1",
    Icon: CheckCircle2,
  },
  error: {
    iconColor: "critical1",
    Icon: XCircle,
  },
  warning: {
    iconColor: "warning1",
    Icon: AlertTriangle,
  },
  info: {
    iconColor: "default1",
    Icon: Info,
  },
};

export interface ToastProps {
  id: string | number;
  type: ToastType;
  title: string;
  description?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const Toast = ({ id, type, title, description, action }: ToastProps) => {
  const { theme, themeValues } = useTheme();
  const isDark = theme === "defaultDark";
  const { iconColor, Icon } = toastStylesMap[type];

  // Use the same background colors as the original non-headless version:
  // - Success: custom oklch green
  // - Others: default UI background
  const getBackgroundColor = () => {
    if (type === "success") {
      return isDark ? "oklch(25% 0.04 145)" : "oklch(97% 0.04 145)";
    }

    return themeValues?.colors.background.default1;
  };

  const handleDismiss = () => {
    toast.dismiss(id);
  };

  return (
    <Box
      display="flex"
      alignItems="flex-start"
      gap={3}
      padding={4}
      borderRadius={3}
      boxShadow="defaultModal"
      borderColor="default1"
      borderWidth={1}
      borderStyle="solid"
      __backgroundColor={getBackgroundColor()}
      __width="380px"
      position="relative"
    >
      {/* Icon */}
      <Box color={iconColor} __lineHeight="0" flexShrink="0" paddingTop={0.5}>
        <Icon size={20} strokeWidth={2} />
      </Box>

      {/* Content */}
      <Box display="flex" flexDirection="column" gap={1} flexGrow="1" __minWidth="0">
        <Text size={3} fontWeight="medium">
          {title}
        </Text>
        {description && (
          <Text size={2} color="default2">
            {description}
          </Text>
        )}
        {action && (
          <Box paddingTop={2}>
            <Button
              variant="tertiary"
              size="small"
              onClick={() => {
                action.onClick();
                handleDismiss();
              }}
            >
              {action.label}
            </Button>
          </Box>
        )}
      </Box>

      {/* Close button */}
      <Box
        as="button"
        onClick={handleDismiss}
        cursor="pointer"
        padding={1}
        borderRadius={2}
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="default2"
        borderWidth={0}
        __backgroundColor="transparent"
        style={{
          outline: "none",
          opacity: 0.6,
          transition: "opacity 0.15s",
        }}
      >
        <X size={16} />
      </Box>
    </Box>
  );
};
