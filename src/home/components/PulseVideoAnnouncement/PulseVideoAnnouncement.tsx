import { IS_CLOUD_INSTANCE } from "@dashboard/config";
import {
  getPulsePromotionLink,
  PULSE_POSTER_URL,
  PULSE_VIDEO_URL,
} from "@dashboard/home/getPulsePromotionLink";
import { homeUrl } from "@dashboard/home/urls";
import { PULSE_DOCS_URL } from "@dashboard/links";
import { RippleVideoAnnouncement } from "@dashboard/ripples/components/RippleVideoAnnouncement/RippleVideoAnnouncement";
import { type CornerRippleComponentProps } from "@dashboard/ripples/cornerRipples/selectActiveCornerRipple";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

const messages = defineMessages({
  installCta: {
    id: "XcwOQt",
    defaultMessage: "Install Pulse",
    description: "ripple video announcement CTA to install Saleor Pulse",
  },
  exploreCta: {
    id: "cNCKU1",
    defaultMessage: "Explore Pulse",
    description: "ripple video announcement CTA to explore Saleor Pulse",
  },
  seeDocs: {
    id: "t0awJM",
    defaultMessage: "See docs",
    description: "link to Saleor Pulse documentation from video announcement",
  },
  dismissAriaLabel: {
    id: "pML8C9",
    defaultMessage: "Dismiss Pulse announcement",
    description: "aria label for dismissing Pulse video announcement",
  },
});

/**
 * Bottom-left Pulse video announcement. Uses ripple storage for TTL/dismiss,
 * with a dedicated card UI (not the contextual Tooltip ripple).
 * Mount via CornerRipplesHost — `model` must match the registry entry.
 */
export const PulseVideoAnnouncement = ({
  model,
}: CornerRippleComponentProps): JSX.Element | null => {
  const intl = useIntl();
  const pulseLink = getPulsePromotionLink(IS_CLOUD_INSTANCE);

  // Cloud: deep-link to install. Open source: send people to Home (empty-state promo).
  const primaryAction =
    pulseLink.kind === "internal"
      ? {
          href: pulseLink.to,
          label: <FormattedMessage {...messages.installCta} />,
        }
      : {
          href: homeUrl(),
          label: <FormattedMessage {...messages.exploreCta} />,
        };

  return (
    <RippleVideoAnnouncement
      model={model}
      videoUrl={PULSE_VIDEO_URL}
      posterUrl={PULSE_POSTER_URL}
      dismissAriaLabel={intl.formatMessage(messages.dismissAriaLabel)}
      primaryAction={primaryAction}
      secondaryAction={{
        href: PULSE_DOCS_URL,
        external: true,
        label: <FormattedMessage {...messages.seeDocs} />,
      }}
    />
  );
};
