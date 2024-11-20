import bag from "@assets/images/bag-icon.svg";
import community from "@assets/images/community-icon.svg";
import discord from "@assets/images/discord-icon.svg";
import extension from "@assets/images/extension-icon.svg";
import github from "@assets/images/github-logo.svg";
import externalLink from "@assets/images/rounded-external-link-icon.svg";
import star from "@assets/images/star-icon.svg";
import { Button, HelpIcon, Paragraph, sprinkles } from "@saleor/macaw-ui-next";
import React from "react";
import SVG from "react-inlinesvg";
import { FormattedMessage, IntlShape } from "react-intl";

import { InfoTile } from "./HomeInfoTile";
import {
  APPS_DOCS_URL,
  CHECKOUT_DOCS_URL,
  DASHBOARD_DOCS_URL,
  SALEOR_DISCORD_URL,
  SALEOR_GITHUB_URL,
  TECHNICAL_HELP_CTA_URL,
} from "./links";

const noShrink = sprinkles({ flexShrink: "0" });

// Headings
const CommunityIcon = () => <SVG src={community} className={noShrink} />;
const StarIcon = () => <SVG src={star} className={noShrink} />;
const ExtensionIcon = () => <SVG src={extension} className={noShrink} />;
const BagIcon = () => <SVG src={bag} className={noShrink} />;

// Bottom actions
const GitHubIcon = () => <SVG src={github} className={noShrink} />;
const DiscordIcon = () => <SVG src={discord} className={noShrink} />;
const ExternalLinkIcon = () => <SVG src={externalLink} className={noShrink} />;

export const getTilesData = ({ intl }: { intl: IntlShape }): InfoTile[] => [
  {
    id: "technical-help",
    header: (
      <>
        <HelpIcon />
        <FormattedMessage defaultMessage="Need technical help?" id="g9HrbF" />
      </>
    ),
    content: (
      <Paragraph>
        <FormattedMessage
          defaultMessage="Save hours of evaluating Saleor on your own by speaking with our solution engineer."
          id="RABrGb"
        />
      </Paragraph>
    ),
    bottomActions: (
      <Button
        as="a"
        target="_blank"
        href={TECHNICAL_HELP_CTA_URL}
        variant="primary"
        alignSelf="start"
      >
        <FormattedMessage
          defaultMessage="Get in touch"
          id="HRXLYk"
          description="cta button label"
        />
      </Button>
    ),
  },
  {
    id: "dashboard-updates",
    header: (
      <>
        <StarIcon />
        <FormattedMessage defaultMessage="Recent Dashboard Updates" id="z9f2oQ" />
      </>
    ),
    content: (
      <Paragraph>
        <FormattedMessage
          defaultMessage="Discover the latest enhancements, new features, fixes, and performance improvements that make your dashboard experience even better."
          id="swOKYO"
        />
      </Paragraph>
    ),
    bottomActions: (
      <Button
        as="a"
        target="_blank"
        href={DASHBOARD_DOCS_URL}
        variant="secondary"
        alignSelf="start"
      >
        <FormattedMessage
          defaultMessage="Explore Updates"
          id="zp9VHt"
          description="cta button label"
        />
        <ExternalLinkIcon />
      </Button>
    ),
  },
  {
    id: "saleor-app-store",
    header: (
      <>
        <ExtensionIcon />
        <FormattedMessage defaultMessage="Explore Saleor App Store" id="/H9LeU" />
      </>
    ),
    content: (
      <Paragraph>
        <FormattedMessage
          defaultMessage="Add new functionalities on top of Saleor and integrate it with third-party services. They can be installed, managed, and rendered in here in Saleor Dashboard."
          id="XVQpjm"
        />
      </Paragraph>
    ),
    bottomActions: (
      <Button as="a" target="_blank" href={APPS_DOCS_URL} variant="secondary" alignSelf="start">
        <FormattedMessage
          defaultMessage="View Documentation"
          id="a+WuZg"
          description="cta button label"
        />
        <ExternalLinkIcon />
      </Button>
    ),
  },
  {
    id: "learn-checkout",
    header: (
      <>
        <BagIcon />
        <FormattedMessage defaultMessage="Learn Saleor checkout process flow" id="Cc3Z40" />
      </>
    ),
    content: (
      <Paragraph>
        <FormattedMessage
          defaultMessage="Full coverage of advanced checkout cases like split payments, split fulfillments, and orchestrated payments."
          id="RBkNPr"
        />
      </Paragraph>
    ),
    bottomActions: (
      <Button as="a" target="_blank" href={CHECKOUT_DOCS_URL} variant="secondary" alignSelf="start">
        <FormattedMessage
          defaultMessage="View Documentation"
          id="a+WuZg"
          description="cta button label"
        />
        <ExternalLinkIcon />
      </Button>
    ),
  },
  {
    id: "community",
    header: (
      <>
        <CommunityIcon />
        <FormattedMessage defaultMessage="Join the open source community" id="Wk00wL" />
      </>
    ),
    content: (
      <Paragraph>
        <FormattedMessage
          defaultMessage="Join our OS community of industry experts and learn more about open source at Saleor."
          id="Tp5T7U"
        />
      </Paragraph>
    ),
    bottomActions: (
      <>
        <Button
          as="a"
          target="_blank"
          href={SALEOR_GITHUB_URL}
          variant="secondary"
          alignSelf="start"
          marginTop="auto"
        >
          <GitHubIcon />
          {intl.formatMessage({
            defaultMessage: "GitHub",
            id: "wO9wb5",
          })}
        </Button>

        <Button
          as="a"
          target="_blank"
          href={SALEOR_DISCORD_URL}
          variant="secondary"
          alignSelf="start"
          marginTop="auto"
        >
          <DiscordIcon />
          {intl.formatMessage({
            defaultMessage: "Discord",
            id: "FvmV6q",
          })}
        </Button>
      </>
    ),
  },
];
