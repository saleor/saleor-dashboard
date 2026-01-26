import { ChannelOpts } from "@dashboard/components/ChannelsAvailabilityCard/types";
import { ProductChannelListingErrorFragment } from "@dashboard/graphql";
import { useCurrentDate } from "@dashboard/hooks/useCurrentDate";
import { Accordion, Box, Button, Spinner, Text } from "@saleor/macaw-ui-next";
import { AlertTriangle, ChevronDown, CircleAlert, Search } from "lucide-react";
import * as React from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";

import {
  getAvailabilityStatus,
  isPurchasable,
  PublicApiVerificationBadge,
} from "./AvailabilityCard";
import { ChannelVerificationResult } from "./hooks/usePublicApiVerification";
import { messages } from "./messages";
import { CurrencyBadge, DirtyBadge, ErrorBadge, IssueBadge, StatusDot } from "./primitives";
import {
  AvailableForPurchaseSection,
  PublishedSection,
  VisibleInListingsSection,
} from "./sections";
import { AvailabilityIssue, ChannelSummary } from "./utils/types";

interface AvailabilityChannelItemProps {
  summary: ChannelSummary;
  originalSummary?: ChannelSummary;
  isLast: boolean;
  isDirty?: boolean;
  onChange?: (channelId: string, data: ChannelOpts) => void;
  disabled?: boolean;
  errors?: ProductChannelListingErrorFragment[];
  /** Diagnostic issues for this channel */
  issues?: AvailabilityIssue[];
  isExpanded?: boolean;
  /** Public API verification result for this channel */
  verificationResult?: ChannelVerificationResult;
  onVerify?: () => void;
}

export const AvailabilityChannelItem = ({
  summary,
  originalSummary,
  isLast,
  isDirty = false,
  onChange,
  disabled = false,
  errors = [],
  issues = [],
  isExpanded = false,
  verificationResult,
  onVerify,
}: AvailabilityChannelItemProps) => {
  const intl = useIntl();
  const dateNow = useCurrentDate();
  const status = getAvailabilityStatus(originalSummary ?? summary, dateNow);
  const hasIssues = issues.length > 0;
  const issueErrorCount = issues.filter(i => i.severity === "error").length;

  const getCurrentOpts = (): ChannelOpts => ({
    isPublished: summary.isPublished,
    publishedAt: summary.publishedAt,
    isAvailableForPurchase: summary.isAvailableForPurchase ?? undefined,
    availableForPurchase: summary.availableForPurchaseAt ?? undefined,
    visibleInListings: summary.visibleInListings,
  });

  const handleChange = (updates: Partial<ChannelOpts>) => {
    if (onChange) {
      onChange(summary.id, {
        ...getCurrentOpts(),
        ...updates,
      });
    }
  };

  const getStatusLabel = () => {
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
          cursor="pointer"
          backgroundColor={{ default: "transparent", hover: "default2" }}
          __transition="background-color 0.2s ease"
        >
          <Box display="flex" alignItems="center" gap={2} __flex="1" __minWidth="0px">
            <StatusDot
              status={status}
              hasIssues={hasIssues}
              issueType={issueErrorCount > 0 ? "error" : "warning"}
            />
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
            {hasIssues && (
              <IssueBadge count={issues.length} type={issueErrorCount > 0 ? "error" : "warning"} />
            )}
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            {errors.length > 0 && <ErrorBadge />}
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
            summary={summary}
            originalSummary={originalSummary}
            onChange={
              onChange
                ? (isPublished, publishedAt) => handleChange({ isPublished, publishedAt })
                : undefined
            }
            errors={errors}
            disabled={disabled}
          />

          <AvailableForPurchaseSection
            summary={summary}
            originalSummary={originalSummary}
            onChange={
              onChange
                ? (isAvailable, availableAt) =>
                    handleChange({
                      isAvailableForPurchase: isAvailable,
                      availableForPurchase: availableAt,
                    })
                : undefined
            }
            errors={errors}
            disabled={disabled}
          />

          <VisibleInListingsSection
            summary={summary}
            onChange={
              onChange && !disabled
                ? visible => handleChange({ visibleInListings: visible })
                : undefined
            }
          />

          <DeliveryConfigurationSection issues={issues} />

          {/* Public API verification section */}
          <PublicApiVerificationSection
            verificationResult={verificationResult}
            onVerify={onVerify}
          />
        </Box>
      </Accordion.Content>
    </Accordion.Item>
  );
};

interface DeliveryConfigurationSectionProps {
  issues: AvailabilityIssue[];
}

const DeliveryConfigurationSection = ({ issues }: DeliveryConfigurationSectionProps) => {
  const intl = useIntl();

  // Only show when there are issues to display
  if (issues.length === 0) {
    return null;
  }

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
      <Text size={2} fontWeight="medium" color="default2">
        {intl.formatMessage(messages.configurationTitle)}
      </Text>

      <Box display="flex" flexDirection="column" gap={2}>
        {issues.map(issue => (
          <IssueCallout key={issue.id} issue={issue} />
        ))}
      </Box>
    </Box>
  );
};

interface PublicApiVerificationSectionProps {
  verificationResult?: ChannelVerificationResult;
  onVerify?: () => void;
}

const PublicApiVerificationSection = ({
  verificationResult,
  onVerify,
}: PublicApiVerificationSectionProps) => {
  const intl = useIntl();
  const isVerifying = verificationResult?.status === "loading";

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
            disabled={isVerifying}
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

      {verificationResult && <PublicApiVerificationBadge result={verificationResult} />}
    </Box>
  );
};

interface IssueCalloutProps {
  issue: AvailabilityIssue;
}

const IssueCallout = ({ issue }: IssueCalloutProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const isError = issue.severity === "error";
  const Icon = isError ? AlertTriangle : CircleAlert;
  const iconColor = isError ? "critical1" : "warning1";

  return (
    <Box display="flex" gap={2} alignItems="flex-start">
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
          <Text size={2} fontWeight="medium" color={iconColor}>
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
