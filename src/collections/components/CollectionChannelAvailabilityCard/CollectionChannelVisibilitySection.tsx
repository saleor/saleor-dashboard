import { type ChannelCollectionData } from "@dashboard/channels/utils";
import { SCHEDULED_COLOR, SUCCESS_ICON_COLOR } from "@dashboard/colors";
import { DateTimeTimezoneField } from "@dashboard/components/DateTimeTimezoneField";
import { StopPropagation } from "@dashboard/components/StopPropagation";
import { type CollectionChannelListingErrorFragment } from "@dashboard/graphql";
import useDateLocalize from "@dashboard/hooks/useDateLocalize";
import { isFutureDate } from "@dashboard/utils/date/isFutureDate";
import { getFormErrors, getProductErrorMessage } from "@dashboard/utils/errors";
import { Box, Checkbox, Text, Toggle } from "@saleor/macaw-ui-next";
import { Clock, Eye, EyeOff } from "lucide-react";
import { type KeyboardEvent, useState } from "react";
import { defineMessages, useIntl } from "react-intl";

import styles from "./CollectionChannelVisibilitySection.module.css";

const messages = defineMessages({
  publishedLabel: {
    id: "YXHLuV",
    defaultMessage: "Published",
    description: "Label for collection published toggle when visible now",
  },
  scheduledLabel: {
    id: "hg79SY",
    defaultMessage: "Scheduled",
    description: "Label for collection toggle row when publication is scheduled",
  },
  sinceDate: {
    id: "zcHJoO",
    defaultMessage: "since {date}",
    description: "Collection visible since date in channel availability",
  },
  visibleNow: {
    id: "BikTYV",
    defaultMessage: "Visible now",
    description: "Collection is visible in channel without scheduled date",
  },
  scheduledForDate: {
    id: "r6AVkm",
    defaultMessage: "Scheduled for {date}",
    description: "Collection scheduled for future publication in channel",
  },
  schedulePublication: {
    id: "Uu5x44",
    defaultMessage: "Schedule for later",
    description: "Checkbox to schedule collection publication in channel",
  },
});

interface CollectionChannelVisibilitySectionProps {
  channelId: string;
  isPublished: boolean;
  publishedAt: string | null;
  savedChannelListing?: Pick<ChannelCollectionData, "isPublished" | "publishedAt">;
  disabled?: boolean;
  errors?: CollectionChannelListingErrorFragment[];
  onChange: (isPublished: boolean, publishedAt: string | null) => void;
}

export const CollectionChannelVisibilitySection = ({
  channelId,
  isPublished,
  publishedAt,
  savedChannelListing,
  disabled = false,
  errors = [],
  onChange,
}: CollectionChannelVisibilitySectionProps) => {
  const intl = useIntl();
  const localizeDate = useDateLocalize();
  const formErrors = getFormErrors(["publishedAt"], errors);
  const savedWasScheduled =
    savedChannelListing?.isPublished && isFutureDate(savedChannelListing.publishedAt);
  const [showDatePicker, setShowDatePicker] = useState(
    isPublished && isFutureDate(publishedAt ?? savedChannelListing?.publishedAt),
  );

  const isScheduleMode = isPublished && showDatePicker;
  const isVisibleMode = isPublished && !showDatePicker;
  const publishedInPast = publishedAt ? Date.parse(publishedAt) < Date.now() : false;

  const handleToggle = (checked: boolean) => {
    if (checked) {
      // Restore the saved publication date so off → on returns to a clean form.
      const dateToRestore = savedChannelListing?.publishedAt ?? null;

      onChange(true, dateToRestore);
      setShowDatePicker(Boolean(savedWasScheduled));
    } else {
      onChange(false, null);
      setShowDatePicker(false);
    }
  };

  const handleRowKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleToggle(!isPublished);
    }
  };

  return (
    <StopPropagation>
      <Box display="flex" flexDirection="column" gap={3}>
        <Box display="flex" flexDirection="column">
          <Box
            className={styles.toggleRow}
            data-disabled={disabled ? "true" : undefined}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-pressed={isPublished}
            onClick={() => {
              if (!disabled) {
                handleToggle(!isPublished);
              }
            }}
            onKeyDown={handleRowKeyDown}
          >
            <Box display="flex" alignItems="center" flexShrink="0">
              {isPublished ? (
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
              {isScheduleMode
                ? intl.formatMessage(messages.scheduledLabel)
                : intl.formatMessage(messages.publishedLabel)}
            </Text>
            <Box
              className={styles.toggleControl}
              onClick={event => event.stopPropagation()}
              onPointerDown={event => event.stopPropagation()}
            >
              <Toggle
                pressed={isPublished}
                onPressedChange={handleToggle}
                disabled={disabled}
                tabIndex={-1}
                aria-hidden
                data-test-id={`collection-channel-published-toggle-${channelId}`}
              />
            </Box>
          </Box>

          {isPublished && (
            <Box marginLeft={8}>
              {isVisibleMode && (
                <Text size={2} color="default2">
                  {publishedAt && publishedInPast
                    ? intl.formatMessage(messages.sinceDate, {
                        date: localizeDate(publishedAt),
                      })
                    : intl.formatMessage(messages.visibleNow)}
                </Text>
              )}
              {isScheduleMode && publishedAt && (
                <Text size={2} __color={SCHEDULED_COLOR}>
                  {intl.formatMessage(messages.scheduledForDate, {
                    date: localizeDate(publishedAt, "lll"),
                  })}
                </Text>
              )}
            </Box>
          )}
        </Box>

        {isPublished && (
          <Box marginLeft={8} display="flex" flexDirection="column" gap={2}>
            <Checkbox
              checked={showDatePicker}
              disabled={disabled}
              onCheckedChange={checked => {
                const isChecked = checked === true;

                setShowDatePicker(isChecked);

                if (!isChecked) {
                  onChange(true, null);
                }
              }}
            >
              <Text size={2}>{intl.formatMessage(messages.schedulePublication)}</Text>
            </Checkbox>

            {showDatePicker && (
              <DateTimeTimezoneField
                name={`collection:publicationTime:${channelId}`}
                value={publishedAt || ""}
                onChange={dateTime => onChange(true, dateTime)}
                error={!!formErrors.publishedAt}
                helperText={
                  formErrors.publishedAt ? getProductErrorMessage(formErrors.publishedAt, intl) : ""
                }
                fullWidth
                disabled={disabled}
              />
            )}
          </Box>
        )}
      </Box>
    </StopPropagation>
  );
};

CollectionChannelVisibilitySection.displayName = "CollectionChannelVisibilitySection";
