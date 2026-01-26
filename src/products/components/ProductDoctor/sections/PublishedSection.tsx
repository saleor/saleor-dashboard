import { SUCCESS_ICON_COLOR } from "@dashboard/colors";
import { DateTimeTimezoneField } from "@dashboard/components/DateTimeTimezoneField";
import { ProductChannelListingErrorFragment } from "@dashboard/graphql";
import useDateLocalize from "@dashboard/hooks/useDateLocalize";
import { getFormErrors, getProductErrorMessage } from "@dashboard/utils/errors";
import { Box, Checkbox, Text, Toggle } from "@saleor/macaw-ui-next";
import { AlertTriangle, Clock, Eye, EyeOff } from "lucide-react";
import * as React from "react";
import { useIntl } from "react-intl";

import { messages } from "../messages";
import { InfoCallout, SCHEDULED_BACKGROUND_COLOR, SCHEDULED_COLOR } from "../primitives";
import { isFutureDate } from "../utils/dateUtils";
import { ChannelSummary } from "../utils/types";

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
export const PublishedSection = ({
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

  // Initialize from original data - component should be keyed by originalSummary?.publishedAt
  // to reset state when the underlying data changes
  const [showDatePicker, setShowDatePicker] = React.useState(originalWasScheduled);

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
      if (checked) {
        // Always restore original publishedAt to return to original state (clean form)
        // This works for both visible products (past/null date) and scheduled products (future date)
        const dateToRestore = originalSummary?.publishedAt ?? null;

        onChange(true, dateToRestore);
        setShowDatePicker(originalWasScheduled);
      } else {
        onChange(false, null);
        setShowDatePicker(false);
      }
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
                  __backgroundColor={SCHEDULED_BACKGROUND_COLOR}
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
