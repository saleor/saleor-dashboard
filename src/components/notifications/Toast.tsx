import { Box, Button, Text, useTheme } from "@saleor/macaw-ui-next";
import { AlertTriangle, CheckCircle2, Info, LucideIcon, X, XCircle } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";
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

const MAX_LINES = 2;

export const Toast = ({ id, type, title, description, action }: ToastProps) => {
  const { theme, themeValues } = useTheme();
  const isDark = theme === "defaultDark";
  const { iconColor, Icon } = toastStylesMap[type];
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  // Check if description text is truncated (only on initial render)
  useEffect(() => {
    const textEl = textRef.current;

    if (textEl) {
      // Use requestAnimationFrame to ensure measurement after render
      requestAnimationFrame(() => {
        if (textEl) {
          // Check if text is clamped by comparing scrollHeight with clientHeight
          const isOverflowing = textEl.scrollHeight > textEl.clientHeight + 1;

          if (isOverflowing) {
            setIsTruncated(true);
          }
        }
      });
    }
  }, [description]);

  // Auto-collapse text when Sonner stack collapses (peek mode)
  useEffect(() => {
    const el = containerRef.current;
    const toastWrapper = el?.closest("[data-sonner-toast]");

    if (!toastWrapper) return;

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === "data-expanded") {
          const isStackExpanded = toastWrapper.getAttribute("data-expanded") === "true";

          if (!isStackExpanded && isExpanded) {
            setIsExpanded(false);
          }
        }
      });
    });

    observer.observe(toastWrapper, { attributes: true });

    return () => observer.disconnect();
  }, [isExpanded]);

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
          <Box
            ref={containerRef}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            position="relative"
            style={{
              overflow: "hidden",
              maxHeight: isExpanded ? "500px" : "3.2em",
              transition: "max-height 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: isTruncated && !isExpanded ? "pointer" : "default",
            }}
            onClick={() => {
              if (isTruncated && !isExpanded) {
                setIsExpanded(true);
              }
            }}
          >
            <Text
              ref={textRef as React.RefObject<HTMLSpanElement>}
              size={2}
              color="default2"
              style={{
                transition: "opacity 0.15s",
                opacity: isTruncated && !isExpanded && isHovering ? 0.6 : 1,
                ...(!isExpanded && {
                  display: "-webkit-box",
                  WebkitLineClamp: MAX_LINES,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }),
              }}
            >
              {description}
            </Text>
            {/* Gradient fade hint for truncated content */}
            {isTruncated && !isExpanded && (
              <Box
                position="absolute"
                __bottom="0"
                __left="0"
                __right="0"
                __height="1.2em"
                style={{
                  background: `linear-gradient(transparent, ${getBackgroundColor()})`,
                  pointerEvents: "none",
                }}
              />
            )}
            {((isTruncated && isHovering) || isExpanded) && (
              <Text
                as="button"
                size={2}
                color="default2"
                onClick={e => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                style={{
                  cursor: "pointer",
                  border: "none",
                  background: "none",
                  padding: 0,
                  marginTop: "4px",
                  outline: "none",
                  opacity: 0.7,
                  transition: "opacity 0.15s",
                  display: "block",
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "0.7")}
              >
                {isExpanded ? "Show less" : "Show more"}
              </Text>
            )}
          </Box>
        )}
        {action && (
          <Box paddingTop={1}>
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
