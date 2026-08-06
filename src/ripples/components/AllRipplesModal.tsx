import githubLogo from "@assets/images/github-logo.svg";
import { Link } from "@dashboard/components/Link";
import { DashboardModal } from "@dashboard/components/Modal";
import { useAnalytics } from "@dashboard/components/ProductAnalytics/useAnalytics";
import { usePulsePromotionLink } from "@dashboard/home/usePulsePromotionLink";
import useNavigator from "@dashboard/hooks/useNavigator";
import { PULSE_DOCS_URL } from "@dashboard/links";
import { getStatusColor, type PillStatusType } from "@dashboard/misc";
import { allRipples } from "@dashboard/ripples/allRipples";
import { useRippleStorage } from "@dashboard/ripples/hooks/useRipplesStorage";
import { rippleActionMessages } from "@dashboard/ripples/messages";
import { rippleIntroducedRipples } from "@dashboard/ripples/ripples/introducedRipples";
import { type Ripple, type RippleAction, type RippleType } from "@dashboard/ripples/types";
import { isExternalURL } from "@dashboard/utils/urls";
import { Box, Button, Text, useTheme, vars } from "@saleor/macaw-ui-next";
import { ChevronRightIcon } from "lucide-react";
import { cloneElement, isValidElement, type ReactNode, useEffect, useMemo, useState } from "react";
import SVG from "react-inlinesvg";
import { defineMessages, useIntl } from "react-intl";

import styles from "./AllRipplesModal.module.css";

const rippleDescriptionTextProps = {
  fontSize: 3 as const,
  color: "default2" as const,
  __lineHeight: "1.6" as const,
};

export const RippleGlobalDescription = ({ content }: { content: ReactNode }) => {
  if (typeof content === "string") {
    return <Text {...rippleDescriptionTextProps}>{content}</Text>;
  }

  if (isValidElement(content) && content.type === Text) {
    return cloneElement(content, {
      ...rippleDescriptionTextProps,
      ...content.props,
      color: content.props.color ?? rippleDescriptionTextProps.color,
      fontSize: content.props.fontSize ?? rippleDescriptionTextProps.fontSize,
    });
  }

  return <Box {...rippleDescriptionTextProps}>{content}</Box>;
};

interface RippleEntry {
  ripple: Ripple;
  dateDisplay: string;
}

export const getRipplesSortedAndGroupedByMonths = (
  ripples: Ripple[],
): Record<string, RippleEntry[]> =>
  ripples
    .sort((r1, r2) => r2.dateAdded.getTime() - r1.dateAdded.getTime())
    .reduce<Record<string, RippleEntry[]>>((acc, ripple) => {
      const logYear = ripple.dateAdded.getFullYear();
      const logMonth = ripple.dateAdded.toLocaleString("default", { month: "long" });
      const monthKey = `${logYear} ${logMonth}`;

      if (!acc[monthKey]) {
        acc[monthKey] = [];
      }

      acc[monthKey].push({
        ripple,
        dateDisplay: ripple.dateAdded.toLocaleDateString("default", {
          month: "short",
          year: "numeric",
        }),
      });

      return acc;
    }, {});

const rippleTypeToPillStatus: Record<RippleType, PillStatusType> = {
  feature: "success",
  improvement: "info",
  bugfix: "error",
  newApp: "attention",
};

const rippleTypeMessages = defineMessages({
  feature: {
    id: "lZTwh4",
    defaultMessage: "Feature",
  },
  improvement: {
    id: "cpI605",
    defaultMessage: "Improvement",
  },
  bugfix: {
    id: "RUwHjA",
    defaultMessage: "Bug Fix",
  },
  newApp: {
    id: "bqsyq+",
    defaultMessage: "New App",
    description: "ripple type badge for a newly available app",
  },
});

const TypeBadge = ({ type }: { type: RippleType }) => {
  const intl = useIntl();
  const { theme: currentTheme } = useTheme();
  const colors = getStatusColor({ status: rippleTypeToPillStatus[type], currentTheme });

  return (
    <Box
      as="span"
      paddingX={2}
      paddingY={0.5}
      borderRadius={2}
      fontSize={1}
      fontWeight="medium"
      __backgroundColor={colors.base}
      __color={colors.text}
      __borderColor={colors.border}
      borderWidth={1}
      borderStyle="solid"
    >
      {intl.formatMessage(rippleTypeMessages[type])}
    </Box>
  );
};

const RippleActionContent = ({ label, isHovered }: { label: string; isHovered: boolean }) => (
  <>
    <Text
      fontSize={3}
      __color={vars.colors.text.accent1}
      textDecoration={isHovered ? "underline" : "none"}
    >
      {label}
    </Text>
    <Box
      __color={vars.colors.text.accent1}
      __transition="transform 0.2s ease"
      __transform={isHovered ? "translateX(4px)" : "translateX(0)"}
      display="flex"
      alignItems="center"
    >
      <ChevronRightIcon size={16} />
    </Box>
  </>
);

const PulseInstallRippleAction = ({
  action,
  onActionClick,
}: {
  action: NonNullable<Ripple["actions"]>[number];
  onActionClick: () => void;
}) => {
  const pulseLink = usePulsePromotionLink();
  const resolvedAction = useMemo((): RippleAction => {
    if (pulseLink.loading) {
      return action;
    }

    // Rebuild as RippleActionWithHref — spreading `action` can retain onClick
    // and violate the mutually exclusive RippleAction union.
    if (pulseLink.kind === "internal" && pulseLink.intent === "open") {
      return {
        href: pulseLink.to,
        label: rippleActionMessages.openPulse,
        hideInModal: action.hideInModal,
      };
    }

    if (pulseLink.kind === "internal") {
      return {
        href: pulseLink.to,
        label: action.label,
        hideInModal: action.hideInModal,
      };
    }

    return {
      href: pulseLink.href,
      label: rippleActionMessages.explorePulse,
      hideInModal: action.hideInModal,
    };
  }, [action, pulseLink]);

  return <RippleAction action={resolvedAction} onActionClick={onActionClick} />;
};

/** Pulse primary CTA (install/open/explore) — not the docs link. */
const isPulsePrimaryRippleAction = (action: RippleAction): boolean =>
  !!action.href && action.href !== PULSE_DOCS_URL;

const RippleAction = ({
  action,
  onActionClick,
}: {
  action: NonNullable<Ripple["actions"]>[number];
  onActionClick: () => void;
}) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const [isHovered, setIsHovered] = useState(false);
  const label = intl.formatMessage(action.label);

  if (action.href) {
    const external = isExternalURL(action.href);

    const handleClick = (): void => {
      onActionClick();

      if (!external) {
        navigate(action.href);
      }
    };

    // Internal hrefs must go through Dashboard Link (basename / SPA). Opening
    // them with target="_blank" broke in-app install deep-links under /dashboard.
    return (
      <Link
        href={action.href}
        inline={false}
        className={styles.actionLink}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <RippleActionContent label={label} isHovered={isHovered} />
      </Link>
    );
  }

  return (
    <Box
      as="button"
      display="flex"
      alignItems="center"
      gap={1}
      cursor="pointer"
      onClick={() => {
        action.onClick?.();
        onActionClick();
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      backgroundColor="transparent"
      borderWidth={0}
      padding={0}
    >
      <RippleActionContent label={label} isHovered={isHovered} />
    </Box>
  );
};

interface RippleEntryRowProps {
  ripple: Ripple;
  dateDisplay: string;
  isLast: boolean;
  onActionClick: () => void;
}

const RippleEntryRow = ({ ripple, dateDisplay, isLast, onActionClick }: RippleEntryRowProps) => {
  return (
    <Box display="flex" gap={4}>
      {/* Timeline column - dot and line */}
      <Box display="flex" flexDirection="column" alignItems="center" __width="6px" __minWidth="6px">
        {/* Dot container - same height as date row for alignment */}
        <Box display="flex" alignItems="center" __height="20px">
          <Box
            __width="6px"
            __height="6px"
            __minWidth="6px"
            __minHeight="6px"
            borderRadius="100%"
            __backgroundColor={vars.colors.text.default1}
          />
        </Box>
        {/* Connecting line */}
        {!isLast && <Box __width="1px" __flexGrow="1" backgroundColor="default1Hovered" />}
      </Box>

      {/* Content column */}
      <Box __flexGrow="1" paddingBottom={6}>
        {/* Date and Type badge row */}
        <Box display="flex" alignItems="center" gap={3} marginBottom={3} __height="20px">
          <Text as="span" fontSize={2} color="default2">
            {dateDisplay}
          </Text>
          <TypeBadge type={ripple.type} />
        </Box>

        {/* Title */}
        <Text
          as="h3"
          display="block"
          fontSize={4}
          fontWeight="bold"
          marginBottom={2}
          color="default1"
        >
          {ripple.content.oneLiner}
        </Text>

        {ripple.media?.kind === "video" ? (
          <Box
            className={styles.mediaVideoWrap}
            marginBottom={3}
            borderRadius={3}
            overflow="hidden"
          >
            <video
              className={styles.mediaVideo}
              controls
              muted
              playsInline
              preload="metadata"
              poster={ripple.media.poster}
              aria-label={ripple.content.oneLiner}
            >
              <source src={ripple.media.src} type="video/mp4" />
            </video>
          </Box>
        ) : null}

        {/* Description */}
        <RippleGlobalDescription content={ripple.content.global} />

        {/* Actions - filter out actions marked as hideInModal */}
        {ripple.actions?.some(action => !action.hideInModal) ? (
          <Box display="flex" flexWrap="wrap" alignItems="center" gap={4} marginTop={3}>
            {ripple.actions
              .filter(action => !action.hideInModal)
              .map((action, index) =>
                ripple.ID === "saleor-pulse" && isPulsePrimaryRippleAction(action) ? (
                  <PulseInstallRippleAction
                    key={`${ripple.ID}-action-${index}`}
                    action={action}
                    onActionClick={onActionClick}
                  />
                ) : (
                  <RippleAction
                    key={`${ripple.ID}-action-${index}`}
                    action={action}
                    onActionClick={onActionClick}
                  />
                ),
              )}
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};

interface AllRipplesModalProps {
  open: boolean;
  onChange: (open: boolean) => void;
}

export const AllRipplesModal = ({ open, onChange }: AllRipplesModalProps) => {
  const intl = useIntl();
  const { hideAllRipples, setManuallyHidden } = useRippleStorage();
  const { trackEvent } = useAnalytics();

  const flattenedRipples = useMemo(
    () => Object.values(getRipplesSortedAndGroupedByMonths(allRipples)).flat(),
    [],
  );

  const lastUpdatedDate = useMemo(() => {
    const latestRipple = allRipples.reduce((latest, ripple) =>
      ripple.dateAdded > latest.dateAdded ? ripple : latest,
    );

    return latestRipple.dateAdded.toLocaleDateString("default", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  useEffect(
    function trackRipplesModalOpen() {
      if (open) {
        trackEvent("ripples.modal-opened");
        setManuallyHidden(rippleIntroducedRipples);
      }
    },
    [open, trackEvent, setManuallyHidden],
  );

  const handleClose = (): void => {
    onChange(false);
  };

  const handleCloseAndHideAll = (): void => {
    hideAllRipples();
    handleClose();
  };

  return (
    <DashboardModal onChange={onChange} open={open}>
      <DashboardModal.Content size="sm">
        <DashboardModal.ContextHeader
          description={intl.formatMessage({
            defaultMessage: "Latest updates and improvements",
            id: "ctdEON",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "What's New",
            id: "RKHBh0",
          })}
        </DashboardModal.ContextHeader>

        <DashboardModal.Body>
          <DashboardModal.Inset>
            {flattenedRipples.map((entry, index) => (
              <RippleEntryRow
                key={entry.ripple.ID}
                ripple={entry.ripple}
                dateDisplay={entry.dateDisplay}
                isLast={index === flattenedRipples.length - 1}
                onActionClick={handleClose}
              />
            ))}
          </DashboardModal.Inset>
        </DashboardModal.Body>

        <DashboardModal.Actions
          alignItems="stretch"
          backgroundColor="default1"
          flexDirection="column"
          gap={0}
          justifyContent="flex-start"
        >
          <Box className={styles.footerButtonRow}>
            <Button variant="secondary" onClick={handleCloseAndHideAll}>
              {intl.formatMessage({
                defaultMessage: "Close and hide all hints",
                id: "pJ5/7G",
              })}
            </Button>
            <Button onClick={handleClose}>
              {intl.formatMessage({
                defaultMessage: "Close",
                id: "rbrahO",
              })}
            </Button>
          </Box>

          <Box className={styles.footerMetaRow}>
            <Box display="flex" alignItems="center" gap={1}>
              <Text fontSize={1} color="default2">
                {intl.formatMessage(
                  {
                    defaultMessage: "Last updated: {date}",
                    id: "ZdCdo5",
                  },
                  { date: lastUpdatedDate },
                )}
                ,{" "}
              </Text>
              <Box
                as="a"
                href="https://github.com/saleor/saleor-dashboard/releases"
                target="_blank"
                rel="noopener noreferrer"
                display="flex"
                alignItems="center"
                gap={1}
                __opacity={{ default: "0.7", hover: "1" }}
                __color={vars.colors.text.default2}
                textDecoration={{ default: "none", hover: "underline" }}
                fontSize={1}
              >
                <SVG src={githubLogo} width={12} height={12} />
                {intl.formatMessage({
                  defaultMessage: "Releases",
                  id: "JEw8ys",
                })}
              </Box>
            </Box>
            <Box
              as="a"
              href="https://github.com/saleor/saleor-dashboard/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              display="flex"
              alignItems="center"
              gap={1}
              fontSize={1}
              __color={vars.colors.text.accent1}
              textDecoration={{ default: "none", hover: "underline" }}
            >
              {intl.formatMessage({
                defaultMessage: "Suggest a change",
                id: "FN+iLO",
              })}
              <ChevronRightIcon size={12} />
            </Box>
          </Box>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
