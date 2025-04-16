import bag from "@assets/images/bag-icon.svg";
import community from "@assets/images/community-icon.svg";
import discord from "@assets/images/discord-icon.svg";
import extension from "@assets/images/extension-icon.svg";
import github from "@assets/images/github-logo.svg";
import externalLink from "@assets/images/rounded-external-link-icon.svg";
import star from "@assets/images/star-icon.svg";
import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import { useTheme } from "@dashboard/theme";
import { Button, CloseIcon, HelpIcon, Paragraph, sprinkles } from "@saleor/macaw-ui-next";
import React from "react";
import SVG from "react-inlinesvg";
import { FormattedMessage, IntlShape } from "react-intl";

import {
  APPS_DOCS_URL,
  CHECKOUT_DOCS_URL,
  COMMUNITY_LIVE_UPDATE_URL,
  DASHBOARD_DOCS_URL,
  SALEOR_DISCORD_URL,
  SALEOR_GITHUB_URL,
  TECHNICAL_HELP_CTA_URL,
} from "./links";
import { WelcomePageInfoTile, WelcomePageInfoTileProps } from "./WelcomePageInfoTile";

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

export const CommunityLiveUpdate = ({
  onTileButtonClick,
}: {
  onTileButtonClick: (tileId: string) => void;
}) => {
  const { theme } = useTheme();

  const [isDismissed, setIsDismissed] = useLocalStorage("community-live-update-dismissed", false);

  if (isDismissed) {
    return null;
  }

  return (
    <WelcomePageInfoTile
      id="community-live-update"
      __backgroundColor={theme === "defaultLight" ? "#F5F3FF" : undefined}
      __borderColor="#9767E4"
      position="relative"
      header={<FormattedMessage defaultMessage="✨ Join Live Community Update" id="dcFARy" />}
      content={
        <>
          <Paragraph>
            <FormattedMessage
              defaultMessage="Tune in for live updates with product news, tips, and how teams are building with Saleor."
              id="FcC842"
            />
          </Paragraph>
          <Paragraph fontWeight="bold" paddingTop={1}>
            <FormattedMessage defaultMessage="April 24th at 3 PM CET | 9 AM EDT" id="Vrch8P" />
          </Paragraph>
          <Button
            position="absolute"
            top={1}
            right={1}
            variant="tertiary"
            icon={<CloseIcon />}
            size="small"
            __width="20px"
            __height="20px"
            onClick={() => setIsDismissed(true)}
          />
        </>
      }
      bottomActions={
        <Button
          as="a"
          target="_blank"
          href={COMMUNITY_LIVE_UPDATE_URL}
          variant="secondary"
          onClick={() => onTileButtonClick("community-live-update")}
        >
          <FormattedMessage defaultMessage="Join us on Discord" id="jzO3qY" />
          <DiscordIcon />
        </Button>
      }
    />
  );
};

export const getTilesData = ({
  intl,
  onTileButtonClick,
}: {
  intl: IntlShape;
  onTileButtonClick: (tileId: string) => void;
}): WelcomePageInfoTileProps[] => [
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
        onClick={() => onTileButtonClick("technical-help")}
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
        onClick={() => onTileButtonClick("dashboard-updates")}
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
      <Button
        as="a"
        target="_blank"
        href={APPS_DOCS_URL}
        variant="secondary"
        alignSelf="start"
        onClick={() => onTileButtonClick("saleor-app-store")}
      >
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
      <Button
        as="a"
        target="_blank"
        href={CHECKOUT_DOCS_URL}
        variant="secondary"
        alignSelf="start"
        onClick={() => onTileButtonClick("learn-checkout")}
      >
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
          onClick={() => onTileButtonClick("community-github")}
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
          onClick={() => onTileButtonClick("community-discord")}
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
