import { SUCCESS_ICON_COLOR } from "@dashboard/colors";

/** Violet color for scheduled states - distinct from link color (accent1) */
const SCHEDULED_COLOR = "oklch(60.6% 0.25 292.717)";

import { ChannelOpts } from "@dashboard/components/ChannelsAvailabilityCard/types";
import { DateTimeTimezoneField } from "@dashboard/components/DateTimeTimezoneField";
import { ProductChannelListingErrorFragment } from "@dashboard/graphql";
import { useCurrentDate } from "@dashboard/hooks/useCurrentDate";
import useDateLocalize from "@dashboard/hooks/useDateLocalize";
import { getFormErrors, getProductErrorMessage } from "@dashboard/utils/errors";
import { Accordion, Box, Button, Checkbox, Spinner, Text, Toggle } from "@saleor/macaw-ui-next";
import {
  AlertTriangle,
  Ban,
  ChevronDown,
  CircleAlert,
  Clock,
  Eye,
  EyeOff,
  Search,
  ShoppingCart,
} from "lucide-react";
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
import { isFutureDate } from "./utils/dateUtils";
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
    isAvailableForPurchase: summary.isAvailableForPurchase,
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

interface PublishedSectionProps {
  summary: ChannelSummary;
  originalSummary?: ChannelSummary;
  onChange?: (isPublished: boolean, publishedAt: string | null) => void;
  errors?: ProductChannelListingErrorFragment[];
  disabled?: boolean;
}

/**
 * PublishedSection - Controls product visibility in storefront
 *
 * IMPORTANT: Saleor's publication logic (from saleor/product/managers.py):
 * - Product is VISIBLE when: isPublished=true AND (publishedAt <= now OR publishedAt IS NULL)
 * - Product is SCHEDULED when: isPublished=true AND publishedAt > now
 * - Product is HIDDEN when: isPublished=false (publishedAt is ignored!)
 *
 * So to schedule a product for future publication:
 * - Set isPublished=true + publishedAt=futureDate
 * - Saleor will hide it until the date, then show it automatically
 *
 * UI Design:
 * - Toggle ON = "Visible or Scheduled" (isPublished=true)
 *   - Optional date picker to schedule for future
 * - Toggle OFF = "Hidden" (isPublished=false), no date picker needed
 */
const PublishedSection = ({
  summary,
  originalSummary,
  onChange,
  errors = [],
  disabled = false,
}: PublishedSectionProps) => {
  const intl = useIntl();
  const formErrors = getFormErrors(["publishedAt"], errors);
  const localizeDate = useDateLocalize();

  const originalWasScheduled =
    originalSummary?.isPublished && isFutureDate(originalSummary.publishedAt);
  const originalWasVisible =
    originalSummary?.isPublished && !isFutureDate(originalSummary.publishedAt);

  const [showDatePicker, setShowDatePicker] = React.useState(originalWasScheduled);

  const prevOriginalDateRef = React.useRef(originalSummary?.publishedAt);

  React.useEffect(() => {
    if (prevOriginalDateRef.current !== originalSummary?.publishedAt) {
      prevOriginalDateRef.current = originalSummary?.publishedAt;
      setShowDatePicker(
        originalSummary?.isPublished && isFutureDate(originalSummary?.publishedAt ?? null),
      );
    }
  }, [originalSummary?.publishedAt, originalSummary?.isPublished]);

  // Derived UI state based on user's checkbox choice
  const isScheduleMode = summary.isPublished && showDatePicker;
  const isVisibleMode = summary.isPublished && !showDatePicker;
  const publishedInPast = summary.publishedAt
    ? Date.parse(summary.publishedAt) < Date.now()
    : false;

  // Warning: user is scheduling a currently-visible product
  const movedToScheduled = originalWasVisible && isScheduleMode && !!summary.publishedAt;

  const handleDateChange = (newDate: string) => {
    onChange?.(true, newDate);
  };

  const handleToggle = (checked: boolean) => {
    if (onChange) {
      onChange(checked, null);
      setShowDatePicker(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Box display="flex" flexDirection="column">
        <Box display="flex" alignItems="center" gap={3}>
          <Box display="flex" alignItems="center">
            {summary.isPublished ? (
              isScheduleMode ? (
                <Clock size={18} color={SCHEDULED_COLOR} strokeWidth={2} />
              ) : (
                <Eye size={18} color={SUCCESS_ICON_COLOR} strokeWidth={2} />
              )
            ) : (
              <EyeOff size={18} color="var(--mu-colors-text-default2)" strokeWidth={1.5} />
            )}
          </Box>
          <Text size={2} fontWeight="medium" __flex="1">
            {intl.formatMessage(messages.publishedLabel)}
          </Text>
          <Toggle
            pressed={summary.isPublished}
            onPressedChange={onChange ? handleToggle : undefined}
            disabled={disabled || !onChange}
          />
        </Box>

        {summary.isPublished && (
          <Box marginLeft={8}>
            {isVisibleMode && (
              <Text size={2} color="default2">
                {summary.publishedAt && publishedInPast
                  ? intl.formatMessage(messages.sinceDate, {
                      date: localizeDate(summary.publishedAt),
                    })
                  : intl.formatMessage(messages.visibleNow)}
              </Text>
            )}
            {isScheduleMode && summary.publishedAt && (
              <Text
                size={2}
                color={publishedInPast ? "warning1" : undefined}
                __color={publishedInPast ? undefined : SCHEDULED_COLOR}
              >
                {publishedInPast
                  ? intl.formatMessage(messages.scheduledDatePassed, {
                      date: localizeDate(summary.publishedAt, "lll"),
                    })
                  : intl.formatMessage(messages.scheduledForDate, {
                      date: localizeDate(summary.publishedAt, "lll"),
                    })}
              </Text>
            )}
          </Box>
        )}
      </Box>

      {!summary.isPublished && (
        <Box marginLeft={8}>
          <InfoCallout>
            <Text size={2} fontWeight="medium">
              {intl.formatMessage(messages.notVisibleToCustomers)}
            </Text>{" "}
            {intl.formatMessage(messages.publicApiReturnsNull)}
          </InfoCallout>
        </Box>
      )}

      {/* Schedule publication option - only when published (toggle ON) */}
      {summary.isPublished && (
        <Box marginLeft={8} display="flex" flexDirection="column" gap={2}>
          <Checkbox
            checked={showDatePicker}
            disabled={disabled || !onChange}
            onCheckedChange={checked => {
              const isChecked = checked === true;

              setShowDatePicker(isChecked);

              if (isChecked) {
                if (originalWasScheduled && originalSummary?.publishedAt !== summary.publishedAt) {
                  onChange?.(true, originalSummary.publishedAt);
                }
              } else {
                const originalDate = originalWasVisible ? originalSummary?.publishedAt : null;

                if (originalDate !== summary.publishedAt) {
                  onChange?.(true, originalDate ?? null);
                }
              }
            }}
          >
            <Text size={2}>{intl.formatMessage(messages.schedulePublication)}</Text>
          </Checkbox>

          {showDatePicker && (
            <>
              <DateTimeTimezoneField
                name={`channel:publicationTime:${summary.id}`}
                value={summary.publishedAt || ""}
                onChange={handleDateChange}
                error={!!formErrors.publishedAt}
                helperText={
                  formErrors.publishedAt ? getProductErrorMessage(formErrors.publishedAt, intl) : ""
                }
                fullWidth
                disabled={disabled}
              />
              {movedToScheduled && !publishedInPast && (
                <Box
                  display="flex"
                  alignItems="flex-start"
                  gap={1}
                  paddingX={2}
                  paddingY={1.5}
                  borderRadius={2}
                  __backgroundColor="var(--mu-colors-background-warning1Pressed)"
                >
                  <Box __minWidth="14px" paddingTop={0.5}>
                    <AlertTriangle size={14} color="var(--mu-colors-text-warning1)" />
                  </Box>
                  <Text size={1} color="warning1">
                    {intl.formatMessage(messages.schedulingWarning, {
                      date: localizeDate(summary.publishedAt!, "lll"),
                    })}
                  </Text>
                </Box>
              )}
              {publishedInPast && (
                <Box
                  display="flex"
                  alignItems="flex-start"
                  gap={1}
                  paddingX={2}
                  paddingY={1.5}
                  borderRadius={2}
                  __backgroundColor="oklch(95% 0.03 292.717)"
                >
                  <Box __minWidth="14px" paddingTop={0.5}>
                    <AlertTriangle size={14} color={SCHEDULED_COLOR} />
                  </Box>
                  <Text size={1} __color={SCHEDULED_COLOR}>
                    {intl.formatMessage(messages.pastDateInfo)}
                  </Text>
                </Box>
              )}
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

interface AvailableForPurchaseSectionProps {
  summary: ChannelSummary;
  originalSummary?: ChannelSummary;
  onChange?: (isAvailable: boolean, availableAt: string | null) => void;
  errors?: ProductChannelListingErrorFragment[];
  disabled?: boolean;
}

/**
 * AvailableForPurchaseSection - Controls product purchasability in storefront
 *
 * IMPORTANT: Saleor's availability logic is DIFFERENT from publication!
 *
 * Unlike isPublished (which is a stored boolean), isAvailableForPurchase is COMPUTED:
 * - DB only stores: available_for_purchase_at (date)
 * - API computes: isAvailableForPurchase = (date IS NOT NULL AND date <= NOW)
 *
 * This means:
 * - When date is NULL → isAvailableForPurchase = false (not available)
 * - When date is in PAST → isAvailableForPurchase = true (available now)
 * - When date is in FUTURE → isAvailableForPurchase = false (scheduled!)
 *
 * UI Design:
 * - Toggle ON = "Available or Scheduled" (date is set - past or future)
 * - Toggle OFF = "Not available" (date is null)
 * - We determine toggle state from availableForPurchaseAt, NOT isAvailableForPurchase
 */
const AvailableForPurchaseSection = ({
  summary,
  originalSummary,
  onChange,
  errors = [],
  disabled = false,
}: AvailableForPurchaseSectionProps) => {
  const intl = useIntl();
  const localizeDate = useDateLocalize();
  const formErrors = getFormErrors(["availableForPurchaseAt"], errors);

  const originalWasScheduled = isFutureDate(originalSummary?.availableForPurchaseAt);
  const originalWasAvailable = !!originalSummary?.availableForPurchaseAt && !originalWasScheduled;

  const [isScheduleMode, setScheduleMode] = React.useState(originalWasScheduled);

  const prevOriginalDateRef = React.useRef(originalSummary?.availableForPurchaseAt);

  React.useEffect(() => {
    if (prevOriginalDateRef.current !== originalSummary?.availableForPurchaseAt) {
      prevOriginalDateRef.current = originalSummary?.availableForPurchaseAt;
      setScheduleMode(isFutureDate(originalSummary?.availableForPurchaseAt));
    }
  }, [originalSummary?.availableForPurchaseAt]);

  const hasDate = !!summary.availableForPurchaseAt;
  const dateInPast = hasDate && !isFutureDate(summary.availableForPurchaseAt);
  const isAvailableMode = hasDate && !isScheduleMode;

  const movedToScheduled = originalWasAvailable && isScheduleMode && hasDate;

  const handleDateChange = (newDate: string) => {
    onChange?.(true, newDate);
  };

  const handleToggle = (checked: boolean) => {
    if (checked) {
      onChange?.(true, new Date().toISOString());
    } else {
      onChange?.(false, null);
    }

    setScheduleMode(false);
  };

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Box display="flex" flexDirection="column">
        <Box display="flex" alignItems="center" gap={3}>
          <Box display="flex" alignItems="center">
            {hasDate ? (
              isScheduleMode ? (
                <Clock size={18} color={SCHEDULED_COLOR} strokeWidth={2} />
              ) : (
                <ShoppingCart size={18} color={SUCCESS_ICON_COLOR} strokeWidth={2} />
              )
            ) : (
              <Ban size={18} color="var(--mu-colors-text-default2)" strokeWidth={1.5} />
            )}
          </Box>
          <Text size={2} fontWeight="medium" __flex="1">
            {intl.formatMessage(messages.availableForPurchaseLabel)}
          </Text>
          <Toggle
            pressed={hasDate}
            onPressedChange={onChange ? handleToggle : undefined}
            disabled={disabled || !onChange}
          />
        </Box>

        {hasDate && (
          <Box marginLeft={8}>
            {isAvailableMode && (
              <Text size={2} color="default2">
                {intl.formatMessage(messages.sinceDate, {
                  date: localizeDate(summary.availableForPurchaseAt!),
                })}
              </Text>
            )}
            {isScheduleMode && summary.availableForPurchaseAt && (
              <Text
                size={2}
                color={dateInPast ? "warning1" : undefined}
                __color={dateInPast ? undefined : SCHEDULED_COLOR}
              >
                {dateInPast
                  ? intl.formatMessage(messages.scheduledDatePassed, {
                      date: localizeDate(summary.availableForPurchaseAt, "lll"),
                    })
                  : intl.formatMessage(messages.scheduledAvailabilityDate, {
                      date: localizeDate(summary.availableForPurchaseAt, "lll"),
                    })}
              </Text>
            )}
          </Box>
        )}
      </Box>

      {!hasDate && (
        <Box marginLeft={8}>
          <InfoCallout>
            <Text size={2} fontWeight="medium">
              {intl.formatMessage(messages.visibleButNotPurchasable)}
            </Text>{" "}
            {intl.formatMessage(messages.cannotAddToCart)}
          </InfoCallout>
        </Box>
      )}

      {/* Schedule availability option - only when available (toggle ON) */}
      {hasDate && onChange && (
        <Box marginLeft={8} display="flex" flexDirection="column" gap={2}>
          <Checkbox
            checked={isScheduleMode}
            onCheckedChange={checked => {
              const isChecked = checked === true;

              if (isChecked) {
                if (
                  originalWasScheduled &&
                  originalSummary?.availableForPurchaseAt &&
                  originalSummary.availableForPurchaseAt !== summary.availableForPurchaseAt
                ) {
                  onChange(
                    originalSummary.isAvailableForPurchase ?? false,
                    originalSummary.availableForPurchaseAt,
                  );
                }
              } else {
                const originalDate = originalWasAvailable
                  ? originalSummary?.availableForPurchaseAt
                  : new Date().toISOString();
                const originalIsAvailable = originalWasAvailable
                  ? (originalSummary?.isAvailableForPurchase ?? true)
                  : true;

                if (originalDate !== summary.availableForPurchaseAt) {
                  onChange(originalIsAvailable, originalDate ?? null);
                }
              }

              setScheduleMode(isChecked);
            }}
          >
            <Text size={2}>{intl.formatMessage(messages.scheduleAvailability)}</Text>
          </Checkbox>

          {isScheduleMode && (
            <>
              <DateTimeTimezoneField
                name={`channel:availableForPurchase:${summary.id}`}
                value={summary.availableForPurchaseAt || ""}
                onChange={handleDateChange}
                error={!!formErrors.availableForPurchaseAt}
                helperText={
                  formErrors.availableForPurchaseAt
                    ? getProductErrorMessage(formErrors.availableForPurchaseAt, intl)
                    : ""
                }
                fullWidth
                disabled={disabled}
              />
              {movedToScheduled && (
                <Box
                  display="flex"
                  alignItems="flex-start"
                  gap={1}
                  paddingX={2}
                  paddingY={1.5}
                  borderRadius={2}
                  __backgroundColor="var(--mu-colors-background-warning1Pressed)"
                >
                  <Box __minWidth="14px" paddingTop={0.5}>
                    <AlertTriangle size={14} color="var(--mu-colors-text-warning1)" />
                  </Box>
                  <Text size={2} color="warning1">
                    {intl.formatMessage(messages.schedulingAvailabilityWarning)}
                  </Text>
                </Box>
              )}
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

interface VisibleInListingsSectionProps {
  summary: ChannelSummary;
  onChange?: (visible: boolean) => void;
}

const VisibleInListingsSection = ({ summary, onChange }: VisibleInListingsSectionProps) => {
  const intl = useIntl();

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Box display="flex" alignItems="center" gap={3}>
        <Box display="flex" alignItems="center">
          <Eye
            size={18}
            color={
              summary.visibleInListings ? SUCCESS_ICON_COLOR : "var(--mu-colors-text-default2)"
            }
            strokeWidth={summary.visibleInListings ? 2 : 1.5}
          />
        </Box>
        <Text size={2} fontWeight="medium" __flex="1">
          {intl.formatMessage(messages.visibleInListingsLabel)}
        </Text>
        <Toggle
          pressed={summary.visibleInListings}
          onPressedChange={onChange}
          disabled={!onChange}
        />
      </Box>

      <Box marginLeft={8}>
        {summary.visibleInListings ? (
          <Text size={2} color="default2">
            {intl.formatMessage(messages.visibleInListingsOnDescription)}
          </Text>
        ) : (
          <InfoCallout>
            <Text size={2} fontWeight="medium">
              {intl.formatMessage(messages.visibleInListingsOffTitle)}
            </Text>{" "}
            {intl.formatMessage(messages.visibleInListingsOffDescription)}
          </InfoCallout>
        )}
      </Box>
    </Box>
  );
};

interface StatusDotProps {
  status: "live" | "scheduled" | "hidden";
  size?: "small" | "default";
  hasIssues?: boolean;
  issueType?: "error" | "warning";
}

const StatusDot = ({
  status,
  size = "default",
  hasIssues = false,
  issueType = "warning",
}: StatusDotProps) => {
  const dotSize = size === "small" ? 8 : 10;

  const getStatusColor = () => {
    // If there are issues, show the issue color instead of status color
    if (hasIssues) {
      return issueType === "error"
        ? "var(--mu-colors-background-critical1)"
        : "var(--mu-colors-background-warning1)";
    }

    switch (status) {
      case "live":
        return "var(--mu-colors-background-success1)";
      case "scheduled":
        return SCHEDULED_COLOR;
      case "hidden":
        return "var(--mu-colors-text-default2)";
    }
  };

  return (
    <Box
      borderRadius="100%"
      __width={`${dotSize}px`}
      __height={`${dotSize}px`}
      __backgroundColor={getStatusColor()}
      flexShrink="0"
    />
  );
};

const DirtyBadge = () => {
  const intl = useIntl();

  return (
    <Box
      backgroundColor="warning1"
      paddingX={2}
      paddingY={0}
      borderRadius={8}
      borderWidth={1}
      borderStyle="solid"
      borderColor="warning1"
    >
      <Text size={1} color="warning1" fontWeight="medium" __fontSize="10px" __lineHeight="16px">
        {intl.formatMessage(messages.editedBadge)}
      </Text>
    </Box>
  );
};

const ErrorBadge = () => {
  const intl = useIntl();

  return (
    <Box
      backgroundColor="critical1"
      paddingX={2}
      paddingY={0.5}
      borderRadius={2}
      borderWidth={1}
      borderStyle="solid"
      borderColor="critical1"
    >
      <Text size={1} color="critical1" fontWeight="medium">
        {intl.formatMessage(messages.errorBadge)}
      </Text>
    </Box>
  );
};

interface CurrencyBadgeProps {
  currency: string;
}

const CurrencyBadge = ({ currency }: CurrencyBadgeProps) => (
  <Box backgroundColor="default1" paddingX={2} paddingY={1} borderRadius={2}>
    <Text size={1} color="default2" fontWeight="medium">
      {currency}
    </Text>
  </Box>
);

interface InfoCalloutProps {
  children: React.ReactNode;
}

const InfoCallout = ({ children }: InfoCalloutProps) => (
  <Box
    __backgroundColor="var(--mu-colors-background-default2)"
    borderRadius={3}
    paddingX={3}
    paddingY={2}
  >
    <Text size={2} color="default2">
      {children}
    </Text>
  </Box>
);

interface IssueBadgeProps {
  count: number;
  type: "error" | "warning";
}

const IssueBadge = ({ count, type }: IssueBadgeProps) => {
  const intl = useIntl();
  const iconColor =
    type === "error" ? "var(--mu-colors-text-critical1)" : "var(--mu-colors-text-warning1)";
  const title = intl.formatMessage(messages.channelHasIssues, { count });

  return (
    <Box display="flex" alignItems="center" title={title} position="relative">
      {type === "error" ? (
        <AlertTriangle size={16} color={iconColor} />
      ) : (
        <CircleAlert size={16} color={iconColor} />
      )}
      {count > 1 && (
        <Text
          size={1}
          color={type === "error" ? "critical1" : "warning1"}
          fontWeight="medium"
          __position="absolute"
          __top="-4px"
          __right="-6px"
          __fontSize="10px"
        >
          {count}
        </Text>
      )}
    </Box>
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
