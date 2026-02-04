import { Box, Button, Text, useTheme } from "@saleor/macaw-ui-next";
import { AlertTriangle, CheckCircle2, Info, LucideIcon, X, XCircle } from "lucide-react";
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastStyleConfig {
  iconColor: "success1" | "critical1" | "warning1" | "default1";
  Icon: LucideIcon;
}

const TOAST_STYLES: Record<ToastType, ToastStyleConfig> = {
  success: { iconColor: "success1", Icon: CheckCircle2 },
  error: { iconColor: "critical1", Icon: XCircle },
  warning: { iconColor: "warning1", Icon: AlertTriangle },
  info: { iconColor: "default1", Icon: Info },
};

const MAX_LINES = 2;
const COLLAPSED_MAX_HEIGHT = "3.2em";
const EXPANDED_MAX_HEIGHT = "500px";
const ANIMATION_TIMING = "0.15s cubic-bezier(0.4, 0, 0.2, 1)";

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
  const { iconColor, Icon } = TOAST_STYLES[type];

  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isToggleHovering, setIsToggleHovering] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const isDark = theme === "defaultDark";

  const backgroundColor = useMemo(() => {
    if (type === "success") {
      return isDark ? "oklch(25% 0.04 145)" : "oklch(97% 0.04 145)";
    }

    return themeValues?.colors.background.default1;
  }, [type, isDark, themeValues]);

  const handleDismiss = useCallback(() => {
    toast.dismiss(id);
  }, [id]);

  const handleExpand = useCallback(() => {
    if (isTruncated && !isExpanded) {
      setIsExpanded(true);
    }
  }, [isTruncated, isExpanded]);

  const handleToggleExpand = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(prev => !prev);
  }, []);

  const handleActionClick = useCallback(() => {
    action?.onClick();
    handleDismiss();
  }, [action, handleDismiss]);

  const handleMouseEnter = useCallback(() => setIsHovering(true), []);
  const handleMouseLeave = useCallback(() => setIsHovering(false), []);
  const handleToggleMouseEnter = useCallback(() => setIsToggleHovering(true), []);
  const handleToggleMouseLeave = useCallback(() => setIsToggleHovering(false), []);

  // Check if description text is truncated
  useEffect(() => {
    const textEl = textRef.current;

    if (!textEl) return;

    requestAnimationFrame(() => {
      const isOverflowing = textEl.scrollHeight > textEl.clientHeight + 1;

      if (isOverflowing) {
        setIsTruncated(true);
      }
    });
  }, [description]);

  // Auto-collapse text when Sonner stack collapses (peek mode)
  useEffect(() => {
    const toastWrapper = containerRef.current?.closest("[data-sonner-toast]");

    if (!toastWrapper) return;

    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.attributeName === "data-expanded") {
          const isStackExpanded = toastWrapper.getAttribute("data-expanded") === "true";

          if (!isStackExpanded) {
            setIsExpanded(false);
          }
        }
      }
    });

    observer.observe(toastWrapper, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const showToggle = (isTruncated && isHovering) || isExpanded;

  return (
    <Box
      data-test-type={type}
      display="flex"
      alignItems="flex-start"
      gap={3}
      padding={4}
      borderRadius={3}
      boxShadow="defaultModal"
      borderColor="default1"
      borderWidth={1}
      borderStyle="solid"
      __backgroundColor={backgroundColor}
      __width="380px"
      __minHeight="94px"
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
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleExpand}
            position="relative"
            style={{
              overflow: "hidden",
              maxHeight: isExpanded ? EXPANDED_MAX_HEIGHT : COLLAPSED_MAX_HEIGHT,
              transition: `max-height ${ANIMATION_TIMING}`,
              cursor: isTruncated && !isExpanded ? "pointer" : "default",
            }}
          >
            <Text
              ref={textRef as React.RefObject<HTMLSpanElement>}
              size={2}
              color="default2"
              style={{
                transition: `opacity ${ANIMATION_TIMING}`,
                opacity: isTruncated && !isExpanded && isHovering ? 0.7 : 1,
                ...(!isExpanded && {
                  display: "-webkit-box",
                  WebkitLineClamp: MAX_LINES,
                  WebkitBoxOrient: "vertical" as const,
                  overflow: "hidden",
                }),
              }}
            >
              {description}
            </Text>

            {isTruncated && !isExpanded && (
              <Box
                position="absolute"
                __bottom="0"
                __left="0"
                __right="0"
                __height="1.2em"
                style={{
                  background: `linear-gradient(transparent, ${backgroundColor})`,
                  pointerEvents: "none",
                }}
              />
            )}

            {showToggle && (
              <Box
                as="button"
                onClick={handleToggleExpand}
                onMouseEnter={handleToggleMouseEnter}
                onMouseLeave={handleToggleMouseLeave}
                style={{
                  cursor: "pointer",
                  border: "none",
                  background: "none",
                  padding: 0,
                  marginTop: "4px",
                  outline: "none",
                  opacity: isToggleHovering ? 1 : 0.7,
                  transition: `opacity ${ANIMATION_TIMING}`,
                  display: "block",
                }}
              >
                <Text size={2} color="default2">
                  {isExpanded ? "Show less" : "Show more"}
                </Text>
              </Box>
            )}
          </Box>
        )}

        {action && (
          <Box paddingTop={1}>
            <Button variant="tertiary" size="small" onClick={handleActionClick}>
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
          transition: `opacity ${ANIMATION_TIMING}`,
        }}
      >
        <X size={16} />
      </Box>
    </Box>
  );
};
