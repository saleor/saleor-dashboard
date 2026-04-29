import { type ChannelOpts } from "@dashboard/components/ChannelsAvailabilityCard/types";
import { type ProductChannelListingErrorFragment } from "@dashboard/graphql";
import { useCurrentDate } from "@dashboard/hooks/useCurrentDate";
import { Accordion, Box, Button, Spinner, Text, Tooltip } from "@saleor/macaw-ui-next";
import { AlertTriangle, ChevronDown, CircleAlert, Info, Search } from "lucide-react";
import * as React from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";

import {
  getAvailabilityStatus,
  isPurchasable,
  PublicApiVerificationBadge,
} from "./AvailabilityCard";
import { type ChannelVerificationResult } from "./hooks/usePublicApiVerification";
import { messages } from "./messages";
import {
  CurrencyBadge,
  DirtyBadge,
  ErrorBadge,
  IssueBadge,
  NewBadge,
  StatusDot,
  ToRemoveBadge,
} from "./primitives";
import { AvailableForPurchaseSection } from "./sections/AvailableForPurchaseSection";
import { PublishedSection } from "./sections/PublishedSection";
import { VisibleInListingsSection } from "./sections/VisibleInListingsSection";
import {
  type AvailabilityIssue,
  type AvailabilityIssueCategory,
  type ChannelSummary,
} from "./utils/types";

interface AvailabilityChannelItemProps {
  summary: ChannelSummary;
  originalSummary?: ChannelSummary;
  isLast: boolean;
  isDirty?: boolean;
  isMarkedForRemoval?: boolean;
  isNew?: boolean;
  onChange?: (channelId: string, data: ChannelOpts) => void;
  disabled?: boolean;
  errors?: ProductChannelListingErrorFragment[];
  /** Diagnostic issues for this channel */
  issues?: AvailabilityIssue[];
  isExpanded?: boolean;
  /** Public API verification result for this channel */
  verificationResult?: ChannelVerificationResult;
  onVerify?: () => void;
  /** Active stock-availability mode for the shop. Used to tailor the reassurance
   *  text under the public-API verification badge. Defaults to legacy. */
  useLegacyShippingZoneStockAvailability?: boolean;
}

export const AvailabilityChannelItem = ({
  summary,
  originalSummary,
  isLast,
  isDirty = false,
  isMarkedForRemoval = false,
  isNew = false,
  onChange,
  disabled = false,
  errors = [],
  issues = [],
  isExpanded = false,
  verificationResult,
  onVerify,
  useLegacyShippingZoneStockAvailability = true,
}: AvailabilityChannelItemProps) => {
  const intl = useIntl();
  const dateNow = useCurrentDate();
  const status = getAvailabilityStatus(originalSummary ?? summary, dateNow);
  // "Blocking" issues (errors/warnings) drive the channel header state — they
  // change the status label, dot color, and surface the issue badge. Info
  // severity issues are advisories: they are still rendered in the body so
  // users see the recommendation, but they should not promote the channel
  // into a "has issues" visual state. This matches the top-level summary
  // banner which counts only errors and warnings.
  const blockingIssues = React.useMemo(
    () => issues.filter(i => i.severity === "error" || i.severity === "warning"),
    [issues],
  );
  const hasBlockingIssues = blockingIssues.length > 0;
  const issueErrorCount = blockingIssues.filter(i => i.severity === "error").length;
  // Channel is effectively disabled if marked for removal or explicitly disabled
  const isEffectivelyDisabled = disabled || isMarkedForRemoval;

  const handleChange = React.useCallback(
    (updates: Partial<ChannelOpts>) => {
      if (onChange) {
        onChange(summary.id, {
          isPublished: summary.isPublished,
          publishedAt: summary.publishedAt,
          isAvailableForPurchase: summary.isAvailableForPurchase ?? undefined,
          availableForPurchase: summary.availableForPurchaseAt ?? undefined,
          visibleInListings: summary.visibleInListings,
          ...updates,
        });
      }
    },
    [onChange, summary],
  );

  const handlePublishedChange = React.useCallback(
    (isPublished: boolean, publishedAt: string | null) => {
      handleChange({ isPublished, publishedAt });
    },
    [handleChange],
  );

  const handleAvailableForPurchaseChange = React.useCallback(
    (isAvailable: boolean, availableAt: string | null) => {
      handleChange({
        isAvailableForPurchase: isAvailable,
        availableForPurchase: availableAt,
      });
    },
    [handleChange],
  );

  const handleVisibleInListingsChange = React.useCallback(
    (visible: boolean) => {
      handleChange({ visibleInListings: visible });
    },
    [handleChange],
  );

  const getStatusLabel = () => {
    // Only blocking issues (errors/warnings) flip the channel into "Issues"
    // status. Info-severity advisories don't change the headline state.
    if (hasBlockingIssues) {
      return intl.formatMessage(messages.status_issues);
    }

    switch (status) {
      case "live":
        return intl.formatMessage(messages.status_live);
      case "scheduled":
        return intl.formatMessage(messages.status_scheduled);
      case "hidden":
        return intl.formatMessage(messages.status_hidden);
    }
  };

  const getStatusDescription = () => {
    // Only blocking issues drive the description override (see getStatusLabel).
    if (hasBlockingIssues) {
      return intl.formatMessage(messages.statusDescription_issues);
    }

    switch (status) {
      case "live":
        if (isPurchasable(originalSummary ?? summary, dateNow)) {
          return intl.formatMessage(messages.statusDescription_live);
        }

        return intl.formatMessage(messages.statusDescription_liveNotPurchasable);
      case "scheduled":
        return intl.formatMessage(messages.statusDescription_scheduled);
      case "hidden":
        return intl.formatMessage(messages.headerDescription_hidden);
    }
  };

  return (
    <Accordion.Item
      value={summary.id}
      borderBottomWidth={isLast ? 0 : 1}
      borderBottomStyle="solid"
      borderColor="default1"
    >
      <Accordion.Trigger>
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          paddingX={4}
          paddingY={3}
          width="100%"
          cursor={isEffectivelyDisabled ? "not-allowed" : "pointer"}
          backgroundColor={{
            default: "transparent",
            hover: isEffectivelyDisabled ? "transparent" : "default2",
          }}
          opacity={isMarkedForRemoval ? "0.6" : "1"}
          __transition="background-color 0.2s ease, opacity 0.2s ease"
        >
          <Box display="flex" alignItems="center" gap={2} __flex="1" __minWidth="0px">
            <Tooltip>
              <Tooltip.Trigger>
                <Box>
                  <StatusDot
                    status={status}
                    hasIssues={hasBlockingIssues}
                    issueType={issueErrorCount > 0 ? "error" : "warning"}
                  />
                </Box>
              </Tooltip.Trigger>
              <Tooltip.Content side="right">
                <Tooltip.Arrow />
                <Box display="flex" flexDirection="column" gap={1}>
                  <Text size={2} fontWeight="medium">
                    {getStatusLabel()}
                  </Text>
                  <Text size={1} color="default2">
                    {getStatusDescription()}
                  </Text>
                  {hasBlockingIssues && (
                    <Text size={1} color={issueErrorCount > 0 ? "critical1" : "warning1"}>
                      {intl.formatMessage(messages.channelHasIssues, {
                        count: blockingIssues.length,
                      })}
                    </Text>
                  )}
                </Box>
              </Tooltip.Content>
            </Tooltip>
            <Text
              size={3}
              fontWeight="medium"
              textOverflow="ellipsis"
              overflow="hidden"
              whiteSpace="nowrap"
              title={summary.name}
            >
              {summary.name}
            </Text>
            {hasBlockingIssues && (
              <IssueBadge
                count={blockingIssues.length}
                type={issueErrorCount > 0 ? "error" : "warning"}
              />
            )}
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            {errors.length > 0 && <ErrorBadge />}
            {isNew && <NewBadge />}
            {isMarkedForRemoval && <ToRemoveBadge />}
            {isDirty && <DirtyBadge />}
            <CurrencyBadge currency={summary.currencyCode} />
            <Box display="flex" alignItems="center" transition="ease" className="accordion-chevron">
              <ChevronDown
                size={16}
                style={{
                  transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              />
            </Box>
          </Box>
        </Box>
      </Accordion.Trigger>

      <Accordion.Content>
        <Box paddingX={4} paddingBottom={4}>
          <Box paddingBottom={2}>
            <Box
              display="flex"
              alignItems="center"
              gap={2}
              backgroundColor="default2"
              borderRadius={3}
              __padding="4px 11px"
            >
              <Box display="flex" alignItems="center" gap={2}>
                <StatusDot status={status} size="small" />
                <Text size={2} fontWeight="medium">
                  {getStatusLabel()}
                </Text>
              </Box>
              <Text size={2} color="default2">
                {getStatusDescription()}
              </Text>
            </Box>
          </Box>
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          gap={5}
          marginX={4}
          marginLeft={6}
          marginBottom={6}
        >
          <PublishedSection
            key={`published-${originalSummary?.isPublished}-${originalSummary?.publishedAt ?? "new"}`}
            summary={summary}
            originalSummary={originalSummary}
            onChange={onChange ? handlePublishedChange : undefined}
            errors={errors}
            disabled={isEffectivelyDisabled}
          />

          <AvailableForPurchaseSection
            key={`available-${originalSummary?.availableForPurchaseAt ?? "new"}`}
            summary={summary}
            originalSummary={originalSummary}
            onChange={onChange ? handleAvailableForPurchaseChange : undefined}
            errors={errors}
            disabled={isEffectivelyDisabled}
          />

          <VisibleInListingsSection
            summary={summary}
            onChange={
              onChange && !isEffectivelyDisabled ? handleVisibleInListingsChange : undefined
            }
          />

          <DeliveryConfigurationSection issues={issues} />

          {/* Public API verification section */}
          <PublicApiVerificationSection
            verificationResult={verificationResult}
            onVerify={onVerify}
            useLegacyShippingZoneStockAvailability={useLegacyShippingZoneStockAvailability}
          />
        </Box>
      </Accordion.Content>
    </Accordion.Item>
  );
};

interface DeliveryConfigurationSectionProps {
  issues: AvailabilityIssue[];
}

/**
 * Issues are grouped into two orthogonal categories — purchasability (cart
 * add-ability) and shipping (order fulfillment) — to mirror the mental model
 * Saleor 3.23+ direct stock-availability mode introduces. Each subsection is
 * rendered only when it has issues; if neither category has any, the whole
 * section is omitted (the empty state is handled by the channel header).
 *
 * The empty-state guard intentionally checks the *renderable* slices rather
 * than `issues.length` so that issues with an unrecognized future category
 * cannot collapse the component to an empty bordered box.
 */
const DeliveryConfigurationSection = ({ issues }: DeliveryConfigurationSectionProps) => {
  const intl = useIntl();
  const purchasabilityIssues = issues.filter(i => i.category === "purchasability");
  const shippingIssues = issues.filter(i => i.category === "shipping");

  if (purchasabilityIssues.length === 0 && shippingIssues.length === 0) {
    return null;
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={5}
      paddingTop={4}
      marginTop={4}
      borderTopWidth={1}
      borderTopStyle="solid"
      borderColor="default1"
    >
      {purchasabilityIssues.length > 0 && (
        <IssueCategorySection
          title={intl.formatMessage(messages.categoryPurchasabilityTitle)}
          issues={purchasabilityIssues}
          category="purchasability"
        />
      )}
      {shippingIssues.length > 0 && (
        <IssueCategorySection
          title={intl.formatMessage(messages.categoryShippingTitle)}
          issues={shippingIssues}
          category="shipping"
        />
      )}
    </Box>
  );
};

interface IssueCategorySectionProps {
  title: string;
  issues: AvailabilityIssue[];
  category: AvailabilityIssueCategory;
}

const IssueCategorySection = ({ title, issues, category }: IssueCategorySectionProps) => (
  <Box
    display="flex"
    flexDirection="column"
    gap={3}
    data-test-id="issue-category-section"
    data-test-category={category}
  >
    <Text size={2} fontWeight="medium" color="default2">
      {title}
    </Text>
    <Box display="flex" flexDirection="column" gap={2}>
      {issues.map(issue => (
        <IssueCallout key={issue.id} issue={issue} />
      ))}
    </Box>
  </Box>
);

interface PublicApiVerificationSectionProps {
  verificationResult?: ChannelVerificationResult;
  onVerify?: () => void;
  useLegacyShippingZoneStockAvailability: boolean;
}

const VERIFICATION_COOLDOWN_MS = 1500;

const PublicApiVerificationSection = ({
  verificationResult,
  onVerify,
  useLegacyShippingZoneStockAvailability,
}: PublicApiVerificationSectionProps) => {
  const intl = useIntl();
  const isVerifying = verificationResult?.status === "loading";
  const [isInCooldown, setIsInCooldown] = React.useState(false);

  // Start cooldown after verification completes (success or error)
  React.useEffect(() => {
    if (verificationResult?.status === "success" || verificationResult?.status === "error") {
      setIsInCooldown(true);

      const timeoutId = setTimeout(() => setIsInCooldown(false), VERIFICATION_COOLDOWN_MS);

      return () => clearTimeout(timeoutId);
    }
  }, [verificationResult?.status]);

  const isButtonDisabled = isVerifying || isInCooldown;

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={3}
      paddingTop={4}
      marginTop={4}
      borderTopWidth={1}
      borderTopStyle="solid"
      borderColor="default1"
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Text size={2} fontWeight="medium" color="default2">
          {intl.formatMessage(messages.publicApiVerificationTitle)}
        </Text>
        {onVerify && (
          <Button
            variant="secondary"
            size="small"
            onClick={onVerify}
            disabled={isButtonDisabled}
            data-test-id="verify-public-api-button"
          >
            {isVerifying ? (
              <>
                <Box __width="14px" __height="14px" display="flex" alignItems="center">
                  <Spinner />
                </Box>
                <Box marginLeft={1}>{intl.formatMessage(messages.verifyingPublicApi)}</Box>
              </>
            ) : (
              <>
                <Search size={14} />
                <Box marginLeft={1}>{intl.formatMessage(messages.testButton)}</Box>
              </>
            )}
          </Button>
        )}
      </Box>

      {verificationResult && (
        <PublicApiVerificationBadge
          result={verificationResult}
          useLegacyShippingZoneStockAvailability={useLegacyShippingZoneStockAvailability}
        />
      )}
    </Box>
  );
};

interface IssueCalloutProps {
  issue: AvailabilityIssue;
}

type IssueSeverity = AvailabilityIssue["severity"];

interface IssueVisuals {
  Icon: typeof AlertTriangle;
  /** macaw-ui color token applied to the icon. */
  iconColor: "critical1" | "warning1" | "default2";
  /** macaw-ui color token applied to the issue title. Info issues render the
   *  title in default text color so they don't look like an actionable warning. */
  titleColor: "critical1" | "warning1" | "default1";
}

const getIssueVisuals = (severity: IssueSeverity): IssueVisuals => {
  switch (severity) {
    case "error":
      return { Icon: AlertTriangle, iconColor: "critical1", titleColor: "critical1" };
    case "warning":
      return { Icon: CircleAlert, iconColor: "warning1", titleColor: "warning1" };
    case "info":
      return { Icon: Info, iconColor: "default2", titleColor: "default1" };
  }
};

const IssueCallout = ({ issue }: IssueCalloutProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const { Icon, iconColor, titleColor } = getIssueVisuals(issue.severity);

  return (
    <Box
      display="flex"
      gap={2}
      alignItems="flex-start"
      data-test-id="availability-issue-callout"
      data-test-issue-id={issue.id}
      data-test-severity={issue.severity}
    >
      <Box color={iconColor} flexShrink="0" paddingTop={0.5}>
        <Icon size={14} />
      </Box>
      <Box display="flex" flexDirection="column" gap={1} __flex="1">
        <Box
          as="button"
          type="button"
          display="flex"
          alignItems="center"
          gap={1}
          padding={0}
          borderWidth={0}
          __cursor="pointer"
          __backgroundColor="transparent"
          __textAlign="left"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Text size={2} fontWeight="medium" color={titleColor}>
            {issue.message}
          </Text>
          <ChevronDown
            size={14}
            style={{
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </Box>
        {isExpanded && (
          <Box display="flex" flexDirection="column" gap={1}>
            <Text size={2} color="default2">
              {issue.description}
            </Text>
            {issue.actionUrl && issue.actionLabel && (
              <Link to={issue.actionUrl}>
                <Text size={2} color="accent1" textDecoration="underline">
                  {issue.actionLabel}
                </Text>
              </Link>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};
