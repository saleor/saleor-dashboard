import { ExternalLinkNext } from "@dashboard/components/ExternalLink";
import Link from "@dashboard/components/Link";
import { IS_CLOUD_INSTANCE } from "@dashboard/config";
import { HOMEPAGE_WIDGETS_DOCS_URL } from "@dashboard/links";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { useEffect, useRef } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import { getPulsePromotionLink, PULSE_POSTER_URL, PULSE_VIDEO_URL } from "./getPulsePromotionLink";
import styles from "./HomeEmptyState.module.css";

const messages = defineMessages({
  eyebrow: {
    id: "7UOtno",
    defaultMessage: "Saleor Pulse",
    description: "eyebrow label for Pulse homepage promotion",
  },
  headline: {
    id: "8wYH6R",
    defaultMessage: "See how your store is doing",
    description: "homepage empty state headline promoting Pulse",
  },
  description: {
    id: "fUE1ip",
    defaultMessage: "Install Pulse to unlock real-time analytics on this page.",
    description: "homepage empty state supporting copy for Pulse",
  },
  installCta: {
    id: "Fbkcn2",
    defaultMessage: "Install Pulse",
    description: "CTA to install Saleor Pulse from homepage empty state",
  },
  exploreCta: {
    id: "y9464e",
    defaultMessage: "Explore Pulse",
    description: "CTA to learn about Saleor Pulse for open-source users",
  },
  videoLabel: {
    id: "3zQ8xn",
    defaultMessage: "Preview of Saleor Pulse analytics",
    description: "accessible label for Pulse promo video",
  },
  createOwnHomepage: {
    id: "ZKBRtP",
    defaultMessage: "Create your own app homepage?",
    description: "secondary docs link below Pulse homepage empty state",
  },
});

export const HomeEmptyState = (): JSX.Element => {
  const intl = useIntl();
  const videoRef = useRef<HTMLVideoElement>(null);
  const pulseLink = getPulsePromotionLink(IS_CLOUD_INSTANCE);
  const href = pulseLink.kind === "internal" ? pulseLink.to : pulseLink.href;
  const isExternal = pulseLink.kind === "external";

  // Native `autoPlay` is fine for soft promo; honor reduced-motion by keeping the poster.
  useEffect(function respectReducedMotionPreference() {
    const video = videoRef.current;

    if (!video || typeof window.matchMedia !== "function") {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.autoplay = false;
      video.pause();
    }
  }, []);

  return (
    <Box height="100%" padding={6}>
      <Box
        as="section"
        className={styles.root}
        borderRadius={4}
        borderColor="default1"
        borderWidth={1}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100%"
        padding={8}
        gap={8}
      >
        <Box className={styles.preview} __width="min(100%, 520px)">
          <Box className={styles.frame}>
            <video
              ref={videoRef}
              className={styles.video}
              controls
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={PULSE_POSTER_URL}
              aria-label={intl.formatMessage(messages.videoLabel)}
            >
              <source src={PULSE_VIDEO_URL} type="video/mp4" />
            </video>
          </Box>
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          __textAlign="center"
          gap={2}
          __maxWidth="360px"
        >
          <Text size={2} color="default2" fontWeight="medium">
            <FormattedMessage {...messages.eyebrow} />
          </Text>
          <Text size={6} fontWeight="medium">
            <FormattedMessage {...messages.headline} />
          </Text>
          <Text size={3} color="default2">
            <FormattedMessage {...messages.description} />
          </Text>
          <Box className={styles.cta}>
            <Link
              href={href}
              inline={false}
              {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <Button variant="primary" data-test-id="home-pulse-cta">
                <FormattedMessage {...(isExternal ? messages.exploreCta : messages.installCta)} />
              </Button>
            </Link>
          </Box>
        </Box>

        <ExternalLinkNext
          href={HOMEPAGE_WIDGETS_DOCS_URL}
          target="_blank"
          size={2}
          color="default2"
          fontWeight="medium"
          textDecoration={{ hover: "underline" }}
          data-test-id="home-create-own-homepage-link"
        >
          <FormattedMessage {...messages.createOwnHomepage} />
        </ExternalLinkNext>
      </Box>
    </Box>
  );
};
