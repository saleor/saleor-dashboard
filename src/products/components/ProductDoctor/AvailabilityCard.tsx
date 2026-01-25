import { DashboardCard } from "@dashboard/components/Card";
import { ChannelOpts } from "@dashboard/components/ChannelsAvailabilityCard/types";
import {
  ProductChannelListingAddInput,
  ProductChannelListingErrorFragment,
} from "@dashboard/graphql";
import { areChannelFieldsDifferent } from "@dashboard/products/components/ProductUpdatePage/formChannels";
import { Accordion, Box, Button, Skeleton, Spinner, Text, Tooltip } from "@saleor/macaw-ui-next";
import { CheckCircle, Info, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";

import { AvailabilityChannelItem } from "./AvailabilityChannelItem";
import {
  ChannelVerificationResult,
  usePublicApiVerification,
} from "./hooks/usePublicApiVerification";
import { messages } from "./messages";
import {
  AvailabilityIssue,
  ChannelSummary,
  DiagnosticsPermissions,
  DiagnosticsResult,
} from "./utils/types";

interface AvailabilityCardProps {
  diagnostics: DiagnosticsResult;
  totalChannelsCount: number;
  onManageClick?: () => void;
  onChannelChange?: (channelId: string, data: ChannelOpts) => void;
  disabled?: boolean;
  /** Form's current channel data - used to display pending (unsaved) changes */
  formChannelData?: ProductChannelListingAddInput[];
  /** Validation errors for channel listings */
  errors?: ProductChannelListingErrorFragment[];
  /** Product ID - needed for public API verification */
  productId?: string;
}

export const AvailabilityCard = ({
  diagnostics,
  totalChannelsCount,
  onManageClick,
  onChannelChange,
  disabled = false,
  formChannelData,
  errors = [],
  productId,
}: AvailabilityCardProps) => {
  const intl = useIntl();
  const [expandedChannel, setExpandedChannel] = useState<string | undefined>(undefined);

  const { channelSummaries, issues, hasErrors, hasWarnings, isLoading, permissions } = diagnostics;

  const verification = usePublicApiVerification(productId || "");

  const { verifyChannel } = verification;

  const expandedChannelSummary = useMemo(() => {
    if (!expandedChannel) {
      return null;
    }

    return channelSummaries.find(s => s.id === expandedChannel) ?? null;
  }, [expandedChannel, channelSummaries]);

  const expandedChannelAvailabilityKey = expandedChannelSummary
    ? `${expandedChannelSummary.isPublished}-${expandedChannelSummary.publishedAt}-${expandedChannelSummary.isAvailableForPurchase}-${expandedChannelSummary.availableForPurchaseAt}-${expandedChannelSummary.visibleInListings}`
    : "";

  useEffect(() => {
    if (expandedChannelSummary && productId) {
      verifyChannel(expandedChannelSummary.id, expandedChannelSummary.slug);
    }
  }, [expandedChannelSummary, productId, verifyChannel, expandedChannelAvailabilityKey]);

  const errorCount = issues.filter(i => i.severity === "error").length;
  const warningCount = issues.filter(i => i.severity === "warning").length;

  const issuesByChannel = useMemo(() => {
    const map = new Map<string, AvailabilityIssue[]>();

    issues.forEach(issue => {
      const existing = map.get(issue.channelId) || [];

      map.set(issue.channelId, [...existing, issue]);
    });

    return map;
  }, [issues]);

  // Merge form data with diagnostic summaries to show pending changes
  const mergedSummaries = useMemo((): ChannelSummary[] => {
    if (!formChannelData) {
      return channelSummaries;
    }

    return channelSummaries.map(summary => {
      const formData = formChannelData.find(fc => fc.channelId === summary.id);

      if (!formData) {
        return summary;
      }

      return {
        ...summary,
        isPublished:
          formData.isPublished !== undefined && formData.isPublished !== null
            ? formData.isPublished
            : summary.isPublished,
        publishedAt:
          formData.publishedAt !== undefined ? formData.publishedAt : summary.publishedAt,
        isAvailableForPurchase:
          formData.isAvailableForPurchase !== undefined && formData.isAvailableForPurchase !== null
            ? formData.isAvailableForPurchase
            : summary.isAvailableForPurchase,
        availableForPurchaseAt:
          formData.availableForPurchaseAt !== undefined
            ? formData.availableForPurchaseAt
            : summary.availableForPurchaseAt,
        visibleInListings:
          formData.visibleInListings !== undefined && formData.visibleInListings !== null
            ? formData.visibleInListings
            : summary.visibleInListings,
      };
    });
  }, [channelSummaries, formChannelData]);

  const dirtyChannels = useMemo((): string[] => {
    if (!formChannelData) {
      return [];
    }

    return channelSummaries
      .filter(summary => {
        const formData = formChannelData.find(fc => fc.channelId === summary.id);

        if (!formData) {
          return false;
        }

        return areChannelFieldsDifferent(formData, summary);
      })
      .map(summary => summary.id);
  }, [channelSummaries, formChannelData]);

  const listedChannelsCount = mergedSummaries.length;

  return (
    <DashboardCard data-test-id="availability-card">
      <DashboardCard.Header>
        <Box display="flex" flexDirection="column" gap={1}>
          <DashboardCard.Title>
            {intl.formatMessage(messages.availabilityTitle)}
          </DashboardCard.Title>
          {!isLoading && (
            <Text size={2} color="default2">
              {intl.formatMessage(messages.availabilitySubtitle, {
                listed: listedChannelsCount,
                total: totalChannelsCount,
              })}
            </Text>
          )}
        </Box>
        {onManageClick && (
          <Button variant="secondary" size="small" onClick={onManageClick}>
            {intl.formatMessage(messages.manageButton)}
          </Button>
        )}
      </DashboardCard.Header>

      <DashboardCard.Content>
        {isLoading ? (
          <Box padding={4}>
            <Skeleton height={4} marginBottom={2} />
            <Skeleton height={4} __width="60%" />
          </Box>
        ) : mergedSummaries.length === 0 ? (
          <Box padding={4}>
            <Text size={2} color="default2">
              {intl.formatMessage(messages.noChannelsListed)}
            </Text>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap={4}>
            <DiagnosticSummaryBanner
              hasErrors={hasErrors}
              hasWarnings={hasWarnings}
              errorCount={errorCount}
              warningCount={warningCount}
              permissions={permissions}
            />

            <Box
              borderWidth={1}
              borderStyle="solid"
              borderColor="default1"
              borderRadius={4}
              overflow="hidden"
            >
              <Accordion
                value={expandedChannel}
                onValueChange={(value: string) => setExpandedChannel(value)}
              >
                {mergedSummaries.map((summary, index) => {
                  const channelErrors = errors.filter(error =>
                    error.channels?.includes(summary.id),
                  );
                  const channelIssues = issuesByChannel.get(summary.id) || [];

                  return (
                    <AvailabilityChannelItem
                      key={summary.id}
                      summary={summary}
                      originalSummary={channelSummaries.find(s => s.id === summary.id)}
                      isLast={index === mergedSummaries.length - 1}
                      isDirty={dirtyChannels.includes(summary.id)}
                      onChange={onChannelChange}
                      disabled={disabled}
                      errors={channelErrors}
                      issues={channelIssues}
                      isExpanded={expandedChannel === summary.id}
                      verificationResult={verification.getChannelResult(summary.id)}
                      onVerify={
                        productId
                          ? () => verification.verifyChannel(summary.id, summary.slug)
                          : undefined
                      }
                    />
                  );
                })}
              </Accordion>
            </Box>
          </Box>
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

export const getAvailabilityStatus = (
  summary: ChannelSummary,
  dateNow: number,
): "live" | "scheduled" | "hidden" => {
  // Product is not published - hidden from public API
  if (!summary.isPublished) {
    return "hidden";
  }

  // Check if publication date is in the future (scheduled)
  // Note: Saleor auto-sets publishedAt to current server time when publishing without a date
  // We add a small tolerance (2 seconds) to avoid "scheduled" flash due to clock differences
  const CLOCK_TOLERANCE_MS = 2000;
  const publishedAtTime = summary.publishedAt ? Date.parse(summary.publishedAt) : null;
  const isScheduledForFuture =
    publishedAtTime !== null && publishedAtTime > dateNow + CLOCK_TOLERANCE_MS;

  if (isScheduledForFuture) {
    return "scheduled"; // Will become visible when date arrives
  }

  // Product is visible (published with past/no date)
  return "live";
};

export const isPurchasable = (summary: ChannelSummary, dateNow: number): boolean => {
  const availableAtTime = summary.availableForPurchaseAt
    ? Date.parse(summary.availableForPurchaseAt)
    : null;

  if (availableAtTime === null) {
    return false;
  }

  return availableAtTime <= dateNow;
};

interface DiagnosticSummaryBannerProps {
  hasErrors: boolean;
  hasWarnings: boolean;
  errorCount: number;
  warningCount: number;
  permissions: DiagnosticsPermissions;
}

const DiagnosticSummaryBanner = ({
  hasErrors,
  hasWarnings,
  errorCount,
  warningCount,
  permissions,
}: DiagnosticSummaryBannerProps) => {
  const intl = useIntl();

  const hasMissingPermissions = permissions.missingPermissions.length > 0;
  const hasIssues = hasErrors || hasWarnings;

  const getStatusColor = () => {
    if (hasErrors) {
      return "var(--mu-colors-background-critical1)";
    }

    if (hasWarnings) {
      return "var(--mu-colors-background-warning1)";
    }

    return "var(--mu-colors-background-success1)";
  };

  const getTextColor = (): "critical1" | "warning1" | "default2" => {
    if (hasErrors) {
      return "critical1";
    }

    if (hasWarnings) {
      return "warning1";
    }

    return "default2";
  };

  // When no issues but missing permissions, show "Limited" with tooltip
  if (!hasIssues && hasMissingPermissions) {
    return (
      <Tooltip>
        <Tooltip.Trigger>
          <Box display="flex" alignItems="center" gap={2} __cursor="help">
            <Info size={14} color="var(--mu-colors-text-default2)" />
            <Text size={2} color="default2">
              {intl.formatMessage(messages.limitedDiagnostics)}
            </Text>
          </Box>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <Tooltip.Arrow />
          <Box padding={2} __maxWidth="350px">
            <Text size={2}>
              {intl.formatMessage(messages.limitedDiagnosticsDescription, {
                permissions: permissions.missingPermissions.join(", "),
              })}
            </Text>
          </Box>
        </Tooltip.Content>
      </Tooltip>
    );
  }

  // When no issues and full permissions, show success
  if (!hasIssues) {
    return (
      <Box display="flex" alignItems="center" gap={2}>
        <Box
          borderRadius="100%"
          __width="8px"
          __height="8px"
          __backgroundColor={getStatusColor()}
          flexShrink="0"
        />
        <Text size={2} color={getTextColor()}>
          {intl.formatMessage(messages.allChannelsHealthy)}
        </Text>
      </Box>
    );
  }

  // When there are issues, show the summary
  return (
    <Box display="flex" alignItems="center" gap={2}>
      <Box
        borderRadius="100%"
        __width="8px"
        __height="8px"
        __backgroundColor={getStatusColor()}
        flexShrink="0"
      />
      <Text size={2} color={getTextColor()}>
        {intl.formatMessage(messages.issuesSummary, {
          errorCount,
          warningCount,
          hasErrors: hasErrors ? "true" : "false",
          hasWarnings: hasWarnings ? "true" : "false",
        })}
      </Text>
    </Box>
  );
};

interface PublicApiVerificationBadgeProps {
  result: ChannelVerificationResult;
}

export const PublicApiVerificationBadge = ({ result }: PublicApiVerificationBadgeProps) => {
  const intl = useIntl();

  if (result.status === "loading") {
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <Box __width="14px" __height="14px" display="flex" alignItems="center">
          <Spinner />
        </Box>
        <Text size={1} color="default2">
          {intl.formatMessage(messages.verifyingPublicApi)}
        </Text>
      </Box>
    );
  }

  if (result.status === "error") {
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <XCircle size={14} color="var(--mu-colors-text-critical1)" />
        <Text size={1} color="critical1">
          {intl.formatMessage(messages.publicApiVerificationError)}
        </Text>
      </Box>
    );
  }

  if (!result.result) {
    return null;
  }

  const { productFound, isAvailable, variantsWithStock } = result.result;

  if (!productFound) {
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <XCircle size={14} color="var(--mu-colors-text-default2)" />
        <Text size={1} color="default2">
          {intl.formatMessage(messages.publicApiNotVisible)}
        </Text>
      </Box>
    );
  }

  if (isAvailable && variantsWithStock > 0) {
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <CheckCircle size={14} color="var(--mu-colors-text-success1)" />
        <Text size={1} color="success1">
          {intl.formatMessage(messages.publicApiPurchasable)}
        </Text>
        <Text size={1} color="default2">
          · {intl.formatMessage(messages.publicApiVariantsInStock, { count: variantsWithStock })}
        </Text>
      </Box>
    );
  }

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <XCircle size={14} color="var(--mu-colors-text-warning1)" />
      <Text size={1} color="warning1">
        {intl.formatMessage(messages.publicApiNotPurchasable)}
      </Text>
      {variantsWithStock === 0 && (
        <Text size={1} color="default2">
          · {intl.formatMessage(messages.publicApiNoVariantsInStock)}
        </Text>
      )}
    </Box>
  );
};
