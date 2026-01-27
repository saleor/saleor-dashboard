import { SUCCESS_ICON_COLOR } from "@dashboard/colors";
import { DateTimeTimezoneField } from "@dashboard/components/DateTimeTimezoneField";
import { ProductChannelListingErrorFragment } from "@dashboard/graphql";
import useDateLocalize from "@dashboard/hooks/useDateLocalize";
import { getFormErrors, getProductErrorMessage } from "@dashboard/utils/errors";
import { Box, Checkbox, Text, Toggle } from "@saleor/macaw-ui-next";
import { AlertTriangle, Ban, Clock, ShoppingCart } from "lucide-react";
import * as React from "react";
import { useIntl } from "react-intl";

import { messages } from "../messages";
import { InfoCallout, SCHEDULED_COLOR } from "../primitives";
import { isFutureDate } from "../utils/dateUtils";
import { ChannelSummary } from "../utils/types";

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
export const AvailableForPurchaseSection = ({
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

  // Initialize from original data - component should be keyed by originalSummary?.availableForPurchaseAt
  // to reset state when the underlying data changes
  const [isScheduleMode, setScheduleMode] = React.useState(originalWasScheduled);

  const hasDate = !!summary.availableForPurchaseAt;
  const dateInPast = hasDate && !isFutureDate(summary.availableForPurchaseAt);
  const isAvailableMode = hasDate && !isScheduleMode;

  const movedToScheduled = originalWasAvailable && isScheduleMode && hasDate;

  const handleDateChange = (newDate: string) => {
    onChange?.(true, newDate);
  };

  const handleToggle = (checked: boolean) => {
    if (checked) {
      // Restore original date if it existed, otherwise use current time
      // This allows toggling off→on to return to original state (clean form)
      const dateToUse = originalSummary?.availableForPurchaseAt ?? new Date().toISOString();

      onChange?.(true, dateToUse);
      // Restore schedule mode based on original state
      setScheduleMode(originalWasScheduled);
    } else {
      onChange?.(false, null);
      setScheduleMode(false);
    }
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
