import Link from "@dashboard/components/Link";
import { useRippleStorage } from "@dashboard/ripples/hooks/useRipplesStorage";
import { type Ripple } from "@dashboard/ripples/types";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { X } from "lucide-react";
import { type ReactNode, useEffect, useRef } from "react";

import styles from "./RippleVideoAnnouncement.module.css";

export interface RippleVideoAnnouncementAction {
  label: ReactNode;
  href: string;
  external?: boolean;
}

interface RippleVideoAnnouncementProps {
  model: Ripple;
  videoUrl: string;
  posterUrl?: string;
  primaryAction: RippleVideoAnnouncementAction;
  secondaryAction?: RippleVideoAnnouncementAction;
  /** Accessible label for the dismiss control. */
  dismissAriaLabel: string;
}

const ActionLink = ({
  action,
  children,
}: {
  action: RippleVideoAnnouncementAction;
  children: ReactNode;
}): JSX.Element => {
  if (action.external) {
    return (
      <Link href={action.href} target="_blank" rel="noopener noreferrer" inline={false}>
        {children}
      </Link>
    );
  }

  return (
    <Link href={action.href} inline={false}>
      {children}
    </Link>
  );
};

/**
 * Corner video announcement that reuses ripple storage (TTL / dismiss)
 * without going through the contextual Tooltip `<Ripple />` UI.
 */
export const RippleVideoAnnouncement = ({
  model,
  videoUrl,
  posterUrl,
  primaryAction,
  secondaryAction,
  dismissAriaLabel,
}: RippleVideoAnnouncementProps): JSX.Element | null => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { getShouldShow, setFirstSeenFlag, setManuallyHidden } = useRippleStorage();
  const shouldShow = getShouldShow(model);

  useEffect(
    function markVideoAnnouncementSeen() {
      if (!shouldShow) {
        return;
      }

      setFirstSeenFlag(model);
    },
    [model, setFirstSeenFlag, shouldShow],
  );

  useEffect(
    function startVideoAfterDelay() {
      const video = videoRef.current;

      if (!shouldShow || !video) {
        return;
      }

      const prefersReducedMotion =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        video.pause();

        return;
      }

      const timeoutId = window.setTimeout(() => {
        void video.play().catch(() => undefined);
      }, 1000);

      return function clearDelayedPlayback(): void {
        window.clearTimeout(timeoutId);
      };
    },
    [shouldShow],
  );

  if (!shouldShow) {
    return null;
  }

  const handleDismiss = (): void => {
    setManuallyHidden(model);
  };

  const handlePrimaryAction = (): void => {
    setManuallyHidden(model);
  };

  return (
    <Box
      as="aside"
      className={styles.root}
      borderRadius={4}
      borderWidth={1}
      borderColor="default1"
      backgroundColor="default1"
      overflow="hidden"
      data-test-id={`ripple-video-announcement-${model.ID}`}
    >
      <Box className={styles.videoWrap}>
        <video
          ref={videoRef}
          className={styles.video}
          controls
          muted
          loop
          playsInline
          preload="metadata"
          poster={posterUrl}
          aria-label={model.content.oneLiner}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      </Box>

      <Box padding={4} display="flex" flexDirection="column" gap={3}>
        <Box display="flex" alignItems="flex-start" gap={2}>
          <Box display="flex" flexDirection="column" gap={1} __flex="1" __minWidth="0">
            <Text size={4} fontWeight="medium">
              {model.content.oneLiner}
            </Text>
            <Text size={2} color="default2" as="p">
              {model.content.contextual}
            </Text>
          </Box>
          <Button
            type="button"
            variant="tertiary"
            icon={<X size={16} />}
            onClick={event => {
              event.preventDefault();
              event.stopPropagation();
              handleDismiss();
            }}
            aria-label={dismissAriaLabel}
            data-test-id="ripple-video-announcement-dismiss"
          />
        </Box>

        <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
          {secondaryAction ? (
            <ActionLink action={secondaryAction}>
              <Button
                variant="tertiary"
                size="small"
                data-test-id="ripple-video-announcement-secondary-cta"
              >
                {secondaryAction.label}
              </Button>
            </ActionLink>
          ) : null}
          <ActionLink action={primaryAction}>
            <Button
              variant="primary"
              size="small"
              onClick={handlePrimaryAction}
              data-test-id="ripple-video-announcement-cta"
            >
              {primaryAction.label}
            </Button>
          </ActionLink>
        </Box>
      </Box>
    </Box>
  );
};
