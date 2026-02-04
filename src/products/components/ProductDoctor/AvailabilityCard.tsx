import { DashboardCard } from "@dashboard/components/Card";
import { ChannelOpts } from "@dashboard/components/ChannelsAvailabilityCard/types";
import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import {
  ChannelFragment,
  ProductChannelListingAddInput,
  ProductChannelListingErrorFragment,
} from "@dashboard/graphql";
import { rippleProductAvailabilityDiagnostics } from "@dashboard/products/ripples/productAvailabilityDiagnostics";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { Accordion, Box, Button, Skeleton, Spinner, Text, Tooltip } from "@saleor/macaw-ui-next";
import { CheckCircle, ChevronLeft, ChevronRight, Info, Search, X, XCircle } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";

import { AvailabilityChannelItem } from "./AvailabilityChannelItem";
import {
  ChannelVerificationResult,
  usePublicApiVerification,
} from "./hooks/usePublicApiVerification";
import { messages } from "./messages";
import {
  countIssuesBySeverity,
  filterChannelsBySearch,
  getDirtyChannelIds,
  groupIssuesByChannel,
  paginateItems,
} from "./utils/channelUtils";
import { mergeFormDataWithChannelSummaries } from "./utils/mergeChannelSummaries";
import { DiagnosticsPermissions, DiagnosticsResult } from "./utils/types";

interface AvailabilityCardProps {
  diagnostics: DiagnosticsResult;
  totalChannelsCount: number;
  onManageClick?: () => void;
  onChannelChange?: (channelId: string, data: ChannelOpts) => void;
  disabled?: boolean;
  /** Form's current channel data - used to display pending (unsaved) changes */
  formChannelData?: ProductChannelListingAddInput[];
  /** Channel IDs marked for removal */
  removeChannels?: string[];
  /** All available channels - needed to create summaries for newly added channels */
  channels?: ChannelFragment[];
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
  removeChannels = [],
  channels = [],
  errors = [],
  productId,
}: AvailabilityCardProps) => {
  const intl = useIntl();
  const [expandedChannel, setExpandedChannel] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const PAGE_SIZE = 10;

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

  // Debounce public API verification to avoid rapid calls when user is changing settings
  const VERIFICATION_DEBOUNCE_MS = 800;

  useEffect(() => {
    if (!expandedChannelSummary || !productId) {
      return;
    }

    const timeoutId = setTimeout(() => {
      verifyChannel(expandedChannelSummary.id, expandedChannelSummary.slug);
    }, VERIFICATION_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [expandedChannelSummary, productId, verifyChannel, expandedChannelAvailabilityKey]);

  const { errorCount, warningCount } = useMemo(() => countIssuesBySeverity(issues), [issues]);

  const issuesByChannel = useMemo(() => groupIssuesByChannel(issues), [issues]);

  // Merge form data with diagnostic summaries and include newly added channels
  const mergedSummaries = useMemo(
    () => mergeFormDataWithChannelSummaries(channelSummaries, formChannelData, channels),
    [channelSummaries, formChannelData, channels],
  );

  const dirtyChannels = useMemo(
    () => getDirtyChannelIds(channelSummaries, formChannelData),
    [channelSummaries, formChannelData],
  );

  // Filter channels by search query
  const filteredSummaries = useMemo(
    () => filterChannelsBySearch(mergedSummaries, searchQuery),
    [mergedSummaries, searchQuery],
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredSummaries.length / PAGE_SIZE);
  const paginatedSummaries = paginateItems(filteredSummaries, currentPage, PAGE_SIZE);
  const showPagination = filteredSummaries.length > PAGE_SIZE;

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Reset expanded channel if it's no longer in the visible list
  useEffect(() => {
    if (expandedChannel && !paginatedSummaries.find(s => s.id === expandedChannel)) {
      setExpandedChannel(undefined);
    }
  }, [paginatedSummaries, expandedChannel]);

  const listedChannelsCount = mergedSummaries.length;

  return (
    <DashboardCard data-test-id="availability-card">
      <DashboardCard.Header>
        <Box display="flex" flexDirection="column" gap={1}>
          <DashboardCard.Title>
            <Box display="flex" alignItems="center" gap={2}>
              {intl.formatMessage(messages.availabilityTitle)}
              <Ripple model={rippleProductAvailabilityDiagnostics} />
            </Box>
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
          <Button
            variant="secondary"
            size="small"
            onClick={onManageClick}
            data-test-id="channels-availability-manage-button"
          >
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

            {/* Search input - always visible when there are channels */}
            <ChannelSearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={intl.formatMessage(messages.searchChannelsPlaceholder)}
            />

            {/* No results message */}
            {filteredSummaries.length === 0 ? (
              <Box
                padding={4}
                borderWidth={1}
                borderStyle="solid"
                borderColor="default1"
                borderRadius={4}
              >
                <Text size={2} color="default2">
                  {intl.formatMessage(messages.noChannelsMatchSearch)}
                </Text>
              </Box>
            ) : (
              <>
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
                    {paginatedSummaries.map((summary, index) => {
                      const channelErrors = errors.filter(error =>
                        error.channels?.includes(summary.id),
                      );
                      const channelIssues = issuesByChannel.get(summary.id) || [];

                      return (
                        <AvailabilityChannelItem
                          key={summary.id}
                          summary={summary}
                          originalSummary={channelSummaries.find(s => s.id === summary.id)}
                          isLast={index === paginatedSummaries.length - 1}
                          isDirty={dirtyChannels.includes(summary.id)}
                          isMarkedForRemoval={removeChannels.includes(summary.id)}
                          isNew={!channelSummaries.find(s => s.id === summary.id)}
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

                {/* Pagination controls - only when needed */}
                {showPagination && (
                  <ChannelPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredSummaries.length}
                    pageSize={PAGE_SIZE}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            )}
          </Box>
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

// Re-export utilities for external consumers
export { getAvailabilityStatus, isPurchasable } from "./utils/availabilityStatus";

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

  // When there are issues, show the summary (with limited permissions indicator if applicable)
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
      {hasMissingPermissions && (
        <Tooltip>
          <Tooltip.Trigger>
            <Box display="flex" alignItems="center" __cursor="help">
              <Info size={14} color="var(--mu-colors-text-default2)" />
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
      )}
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

interface ChannelSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const ChannelSearchInput = ({ value, onChange, placeholder }: ChannelSearchInputProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      paddingX={3}
      paddingY={2}
      borderWidth={1}
      borderStyle="solid"
      borderColor="default1"
      borderRadius={3}
      backgroundColor="default1"
    >
      <Box display="flex" alignItems="center" flexShrink="0">
        <Search size={16} color="var(--mu-colors-text-default2)" />
      </Box>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Escape") {
            onChange("");
            inputRef.current?.blur();
          }
        }}
        placeholder={placeholder}
        data-test-id="channel-search-input"
        style={{
          flex: 1,
          border: "none",
          outline: "none",
          backgroundColor: "transparent",
          fontSize: "14px",
          color: "var(--mu-colors-text-default1)",
          minWidth: 0,
        }}
      />
      {value && (
        <Box
          as="button"
          type="button"
          display="flex"
          alignItems="center"
          justifyContent="center"
          padding={0}
          borderWidth={0}
          backgroundColor="transparent"
          cursor="pointer"
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
          data-test-id="channel-search-clear"
        >
          <X size={16} color="var(--mu-colors-text-default2)" />
        </Box>
      )}
    </Box>
  );
};

interface ChannelPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const ChannelPagination = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: ChannelPaginationProps) => {
  const intl = useIntl();
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Text size={2} color="default2">
        {intl.formatMessage(messages.paginationShowing, { start, end, total: totalItems })}
      </Text>
      <Box display="flex" alignItems="center" gap={2}>
        <Button
          variant="secondary"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          icon={<ChevronLeft size={iconSize.medium} strokeWidth={iconStrokeWidth} />}
          data-test-id="pagination-prev"
        />
        <Button
          variant="secondary"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          icon={<ChevronRight size={iconSize.medium} strokeWidth={iconStrokeWidth} />}
          data-test-id="pagination-next"
        />
      </Box>
    </Box>
  );
};
