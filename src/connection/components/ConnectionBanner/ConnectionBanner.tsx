import { connectionBannerHeightVariable } from "@dashboard/components/AppLayout/consts";
import { ButtonWithLoader } from "@dashboard/components/ButtonWithLoader/ButtonWithLoader";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { CircleCheck, CloudOff, type LucideIcon, WifiOff } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { type MessageDescriptor, useIntl } from "react-intl";

import { type ConnectionStatus } from "../../connectionMonitor";
import { connectionMessages as messages } from "../../messages";
import styles from "./ConnectionBanner.module.css";

type VisibleStatus = Extract<ConnectionStatus, "offline" | "unreachable" | "restored">;

const content: Record<
  VisibleStatus,
  { Icon: LucideIcon; title: MessageDescriptor; description: MessageDescriptor | null }
> = {
  offline: {
    Icon: WifiOff,
    title: messages.offlineTitle,
    description: messages.offlineDescription,
  },
  unreachable: {
    Icon: CloudOff,
    title: messages.unreachableTitle,
    description: messages.unreachableDescription,
  },
  restored: { Icon: CircleCheck, title: messages.restored, description: null },
};

/** A little longer than the closing animation, after which the banner forgets its text. */
const FORGET_AFTER_CLOSE_MS = 200;

const isVisible = (status: ConnectionStatus): status is VisibleStatus =>
  status === "offline" || status === "unreachable" || status === "restored";

/** Keeps the banner's current height on the document, so full-height pages make room for it. */
const useHeightVariable = (): React.RefObject<HTMLDivElement> => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(function reportBannerHeight() {
    const element = ref.current;

    if (!element || typeof ResizeObserver === "undefined") {
      return;
    }

    const root = document.documentElement;
    const observer = new ResizeObserver(() => {
      root.style.setProperty(
        connectionBannerHeightVariable,
        `${element.getBoundingClientRect().height}px`,
      );
    });

    observer.observe(element);

    return (): void => {
      observer.disconnect();
      root.style.removeProperty(connectionBannerHeightVariable);
    };
  }, []);

  return ref;
};

interface ConnectionBannerProps {
  status: ConnectionStatus;
  /** A check the merchant asked for is running. */
  checkingNow: boolean;
  onTryNow: () => void;
}

interface TryNowButtonProps {
  checkingNow: boolean;
  onTryNow: () => void;
  /** Called when the button goes away while it has focus. */
  onRemovedWithFocus: () => void;
}

const TryNowButton = ({
  checkingNow,
  onTryNow,
  onRemovedWithFocus,
}: TryNowButtonProps): React.ReactNode => {
  const intl = useIntl();
  const ref = useRef<HTMLSpanElement>(null);

  // Runs before the button leaves the page, while it still has focus, so focus can be moved
  // somewhere nearby instead of falling back to the top of the document. `onRemovedWithFocus`
  // must be stable, or this would also run while the button stays.
  useLayoutEffect(
    function keepFocusWhenRemoved() {
      const wrapper = ref.current;

      return (): void => {
        if (wrapper?.contains(document.activeElement)) {
          onRemovedWithFocus();
        }
      };
    },
    [onRemovedWithFocus],
  );

  return (
    <span ref={ref}>
      <ButtonWithLoader
        variant="secondary"
        size="small"
        transitionState={checkingNow ? "loading" : "default"}
        onClick={onTryNow}
        data-test-id="connection-banner-try-now"
      >
        {intl.formatMessage(messages.tryNow)}
      </ButtonWithLoader>
    </span>
  );
};

/**
 * The connection to Saleor, shown above the page while it is lost and briefly once it's back.
 * Stays mounted while hidden: its live regions must exist before their text changes, or screen
 * readers don't announce it.
 */
export const ConnectionBanner = ({
  status,
  checkingNow,
  onTryNow,
}: ConnectionBannerProps): React.ReactNode => {
  const intl = useIntl();
  const ref = useHeightVariable();
  // While the banner closes, it keeps showing what it said last. Before the first outage, and
  // once it has closed, it has nothing to say, so screen readers and find-in-page don't meet
  // hidden text.
  const [shown, setShown] = useState<VisibleStatus | null>(null);

  if (isVisible(status) && status !== shown) {
    setShown(status);
  }

  const open = isVisible(status);
  const view = shown ? content[shown] : null;
  const lost = shown === "offline" || shown === "unreachable";
  const focusBanner = useCallback(() => ref.current?.focus({ preventScroll: true }), [ref]);

  useEffect(
    function forgetTextOnceClosed() {
      if (open) {
        return;
      }

      const timer = setTimeout(() => setShown(null), FORGET_AFTER_CLOSE_MS);

      return (): void => clearTimeout(timer);
    },
    [open],
  );

  return (
    <div
      ref={ref}
      // Takes focus if Try now goes away while focused, so keyboard users stay at the banner.
      tabIndex={-1}
      className={clsx(styles.banner, open && styles.open, shown === "restored" && styles.restored)}
      data-test-id="connection-banner"
      data-test-state={open ? shown : "hidden"}
    >
      <div className={styles.clip}>
        <div className={styles.row}>
          <div className={styles.message}>
            {view && (
              <view.Icon
                aria-hidden
                className={styles.icon}
                size={iconSize.small}
                strokeWidth={iconStrokeWidthBySize.small}
              />
            )}
            <div className={styles.text}>
              {/* Losing the connection stops saving from working, so it interrupts. */}
              <div role="alert">
                {view && lost && (
                  <Text size={3}>
                    <Text size={3} fontWeight="medium">
                      {intl.formatMessage(view.title)}
                    </Text>{" "}
                    {view.description && intl.formatMessage(view.description)}
                  </Text>
                )}
              </div>
              <div role="status">
                {view && !lost && (
                  <Text size={3} fontWeight="medium">
                    {intl.formatMessage(view.title)}
                  </Text>
                )}
              </div>
            </div>
          </div>
          {open && shown === "unreachable" && (
            <TryNowButton
              checkingNow={checkingNow}
              onTryNow={onTryNow}
              onRemovedWithFocus={focusBanner}
            />
          )}
        </div>
      </div>
    </div>
  );
};
