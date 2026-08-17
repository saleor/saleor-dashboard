import { Box, Button, Text, useTheme } from "@saleor/macaw-ui-next";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info,
  type LucideIcon,
  X,
  XCircle,
} from "lucide-react";
import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { defineMessages, useIntl } from "react-intl";
import { toast } from "sonner";

import styles from "./Toast.module.css";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastStyleConfig {
  Icon: LucideIcon;
  ringClassName: string;
}

const TOAST_STYLES: Record<ToastType, ToastStyleConfig> = {
  success: { Icon: CheckCircle2, ringClassName: styles.toastSuccess },
  error: { Icon: XCircle, ringClassName: styles.toastError },
  warning: { Icon: AlertTriangle, ringClassName: styles.toastWarning },
  info: { Icon: Info, ringClassName: styles.toastInfo },
};

const MAX_LINES = 2;

const measureCollapsedTextHeight = (textEl: HTMLElement): number => {
  const previousDisplay = textEl.style.display;
  const previousOverflow = textEl.style.overflow;
  const previousLineClamp = textEl.style.getPropertyValue("-webkit-line-clamp");
  const previousBoxOrient = textEl.style.getPropertyValue("-webkit-box-orient");

  textEl.style.display = "-webkit-box";
  textEl.style.overflow = "hidden";
  textEl.style.setProperty("-webkit-line-clamp", String(MAX_LINES));
  textEl.style.setProperty("-webkit-box-orient", "vertical");

  const height = textEl.getBoundingClientRect().height;

  textEl.style.display = previousDisplay;
  textEl.style.overflow = previousOverflow;
  textEl.style.setProperty("-webkit-line-clamp", previousLineClamp);
  textEl.style.setProperty("-webkit-box-orient", previousBoxOrient);

  return height;
};

const messages = defineMessages({
  closeNotification: {
    id: "bzcuDv",
    defaultMessage: "Close notification",
    description: "accessible label for toast dismiss button",
  },
  showLess: {
    id: "D0Rbqc",
    defaultMessage: "Show less",
    description: "collapse truncated toast description",
  },
  showMore: {
    id: "/kh7MF",
    defaultMessage: "Show more",
    description: "expand truncated toast description",
  },
});

export interface ToastProps {
  id: string | number;
  type: ToastType;
  title: string;
  description?: ReactNode;
  /**
   * Auto-dismiss duration in ms. When finite, a progress hairline animates
   * remaining time and pauses while the toast is hovered / focused.
   */
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Called before Sonner removes the toast — wires the notification queue. */
  onRemoved?: () => void;
}

export const Toast = ({
  id,
  type,
  title,
  description,
  duration,
  action,
  onRemoved,
}: ToastProps): ReactNode => {
  const intl = useIntl();
  const { theme } = useTheme();
  const { Icon, ringClassName } = TOAST_STYLES[type];

  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  /** Pixel height while animating; undefined lets line-clamp size the box naturally. */
  const [clipHeight, setClipHeight] = useState<number | undefined>(undefined);
  /** Keep full text visible (no clamp) while height animates closed, then clamp. */
  const [clampLines, setClampLines] = useState(true);

  const clipRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  /** True while collapsing — blocks the expand layout effect from re-opening height. */
  const isCollapsingRef = useRef(false);
  const hoverPausedRef = useRef(false);

  const isDark = theme === "defaultDark";
  const showProgress = typeof duration === "number" && Number.isFinite(duration) && duration > 0;
  const [progress, setProgress] = useState(1);

  const toastClassName = useMemo(() => {
    const parts = [styles.toast, ringClassName];

    if (isDark) {
      parts.push(styles.toastDark);
    }

    return parts.join(" ");
  }, [isDark, ringClassName]);

  const handleDismiss = useCallback(() => {
    onRemoved?.();
    toast.dismiss(id);
  }, [id, onRemoved]);

  const resetDescriptionLayout = useCallback(() => {
    isCollapsingRef.current = false;
    setIsExpanded(false);
    setClampLines(true);
    setClipHeight(undefined);
  }, []);

  const expandDescription = useCallback(() => {
    const clipEl = clipRef.current;
    const textEl = textRef.current;

    if (!clipEl || !textEl || !isTruncated || isExpanded || isCollapsingRef.current) {
      return;
    }

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setClampLines(false);
      setIsExpanded(true);
      setClipHeight(undefined);

      return;
    }

    const from = clipEl.getBoundingClientRect().height;

    setClipHeight(from);
    setClampLines(false);
    setIsExpanded(true);
  }, [isExpanded, isTruncated]);

  const collapseDescription = useCallback(() => {
    const clipEl = clipRef.current;
    const textEl = textRef.current;

    if (!clipEl || !textEl || !isExpanded || isCollapsingRef.current) {
      return;
    }

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      resetDescriptionLayout();

      return;
    }

    const from = Math.round(clipEl.getBoundingClientRect().height);
    const to = Math.round(measureCollapsedTextHeight(textEl));

    if (from <= to) {
      resetDescriptionLayout();

      return;
    }

    isCollapsingRef.current = true;
    // Lock current height, then on the next frame animate to the clamped size.
    // Text stays unclamped so overflow:hidden clips smoothly while shrinking.
    setClipHeight(from);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setClipHeight(to);
      });
    });
  }, [isExpanded, resetDescriptionLayout]);

  const handleToggleExpand = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      if (isExpanded) {
        collapseDescription();
      } else {
        expandDescription();
      }
    },
    [collapseDescription, expandDescription, isExpanded],
  );

  const handleExpand = useCallback(() => {
    expandDescription();
  }, [expandDescription]);

  const handleDescriptionTransitionEnd = useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      // currentTarget: Macaw Box may nest nodes; only the clip wrapper animates height.
      if (e.propertyName !== "height" || e.target !== e.currentTarget) {
        return;
      }

      if (isCollapsingRef.current) {
        resetDescriptionLayout();

        return;
      }

      if (isExpanded) {
        setClipHeight(undefined);
      }
    },
    [isExpanded, resetDescriptionLayout],
  );

  // Fallback if transitionend is skipped (equal heights, reduced-motion races, etc.).
  useEffect(
    function finishCollapseIfStuck() {
      if (!isCollapsingRef.current || clipHeight === undefined) {
        return;
      }

      const timeoutId = window.setTimeout(() => {
        if (isCollapsingRef.current) {
          resetDescriptionLayout();
        }
      }, 400);

      return () => window.clearTimeout(timeoutId);
    },
    [clipHeight, resetDescriptionLayout],
  );

  const handleActionClick = useCallback(() => {
    action?.onClick();
    handleDismiss();
  }, [action, handleDismiss]);

  useEffect(
    function measureDescriptionTruncation() {
      const textEl = textRef.current;

      if (!textEl) return;

      requestAnimationFrame(() => {
        const isOverflowing = textEl.scrollHeight > textEl.clientHeight + 1;

        if (isOverflowing) {
          setIsTruncated(true);
        }
      });
    },
    [description],
  );

  useLayoutEffect(
    function animateExpandToMeasuredHeight() {
      // Do not fight the collapse animation — it also keeps isExpanded/clampLines
      // in the “open” state until the height transition finishes.
      if (!isExpanded || clampLines || clipHeight === undefined || isCollapsingRef.current) {
        return;
      }

      const textEl = textRef.current;

      if (!textEl) {
        return;
      }

      const fullHeight = textEl.scrollHeight;

      if (fullHeight > 0 && fullHeight !== clipHeight) {
        setClipHeight(fullHeight);
      }
    },
    [isExpanded, clampLines, clipHeight, description],
  );

  useEffect(
    function runAutoDismissTimer() {
      if (!showProgress || duration === undefined) {
        return;
      }

      const total = duration;
      let remaining = total;
      let frameId = 0;
      let last = performance.now();

      const tick = (now: number) => {
        const delta = now - last;

        last = now;

        if (!hoverPausedRef.current) {
          remaining = Math.max(0, remaining - delta);
          setProgress(remaining / total);

          if (remaining <= 0) {
            onRemoved?.();
            toast.dismiss(id);

            return;
          }
        }

        frameId = requestAnimationFrame(tick);
      };

      frameId = requestAnimationFrame(tick);

      return () => cancelAnimationFrame(frameId);
    },
    [duration, id, onRemoved, showProgress],
  );

  const handleRootMouseEnter = useCallback(() => {
    hoverPausedRef.current = true;
  }, []);

  const handleRootMouseLeave = useCallback(() => {
    hoverPausedRef.current = false;
  }, []);

  const progressStyle: CSSProperties = {
    transform: `scaleX(${progress})`,
  };

  const descriptionClipStyle: CSSProperties | undefined =
    clipHeight === undefined
      ? undefined
      : {
          height: clipHeight,
        };

  return (
    <Box
      data-test-type={type}
      className={toastClassName}
      display="flex"
      alignItems="flex-start"
      gap={3}
      padding={4}
      borderRadius={4}
      onMouseEnter={handleRootMouseEnter}
      onMouseLeave={handleRootMouseLeave}
    >
      <Box className={styles.icon} __lineHeight="0" flexShrink="0" paddingTop={0.5}>
        <Icon size={20} strokeWidth={2} aria-hidden />
      </Box>

      <Box display="flex" flexDirection="column" gap={1} flexGrow="1" __minWidth="0">
        <Text size={3} fontWeight="medium">
          {title}
        </Text>

        {description && (
          <Box display="flex" flexDirection="column" __minWidth="0">
            <Box
              ref={clipRef}
              className={styles.description}
              onClick={handleExpand}
              onTransitionEnd={handleDescriptionTransitionEnd}
              position="relative"
              style={{
                ...descriptionClipStyle,
                cursor: isTruncated && !isExpanded ? "pointer" : "default",
              }}
            >
              <Text
                ref={textRef as React.RefObject<HTMLSpanElement>}
                className={
                  clampLines
                    ? `${styles.descriptionText} ${styles.descriptionTextClamped}`
                    : styles.descriptionText
                }
                size={2}
                color="default2"
              >
                {description}
              </Text>

              {isTruncated && clampLines && (
                <Box
                  className={styles.fade}
                  position="absolute"
                  __bottom="0"
                  __left="0"
                  __right="0"
                  __height="1.2em"
                />
              )}
            </Box>

            {isTruncated && (
              <button
                type="button"
                className={styles.toggle}
                onClick={handleToggleExpand}
                aria-expanded={isExpanded}
                aria-label={intl.formatMessage(isExpanded ? messages.showLess : messages.showMore)}
              >
                {isExpanded ? (
                  <ChevronUp size={14} strokeWidth={2} aria-hidden />
                ) : (
                  <ChevronDown size={14} strokeWidth={2} aria-hidden />
                )}
              </button>
            )}
          </Box>
        )}

        {action && (
          <Box paddingTop={1}>
            <Button variant="secondary" size="small" onClick={handleActionClick}>
              {action.label}
            </Button>
          </Box>
        )}
      </Box>

      <button
        type="button"
        className={styles.dismiss}
        onClick={handleDismiss}
        aria-label={intl.formatMessage(messages.closeNotification)}
      >
        <Box
          as="span"
          display="flex"
          alignItems="center"
          justifyContent="center"
          padding={1}
          borderRadius={2}
          color="default2"
        >
          <X size={16} aria-hidden />
        </Box>
      </button>

      {showProgress && (
        <div className={styles.progressTrack} data-test-id="toast-progress" aria-hidden>
          <div className={styles.progressBar} style={progressStyle} />
        </div>
      )}
    </Box>
  );
};
