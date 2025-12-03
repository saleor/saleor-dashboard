import Link from "@dashboard/components/Link";
import { commonMessages } from "@dashboard/intl";
import { DOCS_ULRS } from "@dashboard/links";
import { Box, Button, Checkbox, Input, Text, Tooltip } from "@saleor/macaw-ui-next";
import { CircleAlertIcon, TriangleAlertIcon } from "lucide-react";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

interface AutomaticallyCompleteCheckoutsProps {
  isChecked: boolean;
  hasError: boolean;
  disabled?: boolean;
  delay: number | string | null;
  cutOffDate: string;
  cutOffTime: string;
  useCutOffDate: boolean;
  // Saved values from backend - used to track initial state for warnings
  savedIsEnabled: boolean;
  savedCutOffDate: string;
  savedCutOffTime: string;
  onCheckboxChange: () => void;
  onDelayChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCutOffDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCutOffTimeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUseCutOffDateChange: () => void;
}

const formatTimeDifference = (milliseconds: number, locale: string): string => {
  const absMs = Math.abs(milliseconds);
  const minutes = Math.round(absMs / (1000 * 60));
  const hours = Math.round(absMs / (1000 * 60 * 60));
  const days = Math.round(absMs / (1000 * 60 * 60 * 24));

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "always", style: "long" });

  // Get absolute duration string (we handle direction in message)
  if (days >= 1) {
    return rtf.format(days, "day").replace(/^in /, "").replace(/ ago$/, "");
  }

  if (hours >= 1) {
    return rtf.format(hours, "hour").replace(/^in /, "").replace(/ ago$/, "");
  }

  return rtf.format(minutes, "minute").replace(/^in /, "").replace(/ ago$/, "");
};

const formatDateTime = (date: string, time: string, locale: string): string => {
  if (!date) {
    return "";
  }

  const dateObj = new Date(`${date}T${time || "00:00"}`);

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
};

export const AutomaticallyCompleteCheckouts = ({
  isChecked,
  hasError,
  disabled,
  delay,
  cutOffDate,
  cutOffTime,
  useCutOffDate,
  savedIsEnabled,
  savedCutOffDate,
  savedCutOffTime,
  onCheckboxChange,
  onDelayChange,
  onCutOffDateChange,
  onCutOffTimeChange,
  onUseCutOffDateChange,
}: AutomaticallyCompleteCheckoutsProps) => {
  const intl = useIntl();

  const handleMainCheckboxChange = () => {
    onCheckboxChange();
  };

  const handleSetCurrentDateTime = () => {
    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const time = now.toTimeString().slice(0, 5);

    onCutOffDateChange({ target: { name: "automaticCompletionCutOffDate", value: date } } as any);
    onCutOffTimeChange({ target: { name: "automaticCompletionCutOffTime", value: time } } as any);
  };

  const handleResetToSaved = () => {
    onCutOffDateChange({
      target: { name: "automaticCompletionCutOffDate", value: savedCutOffDate },
    } as any);
    onCutOffTimeChange({
      target: { name: "automaticCompletionCutOffTime", value: savedCutOffTime },
    } as any);
  };

  // Check if form has changes from saved state (to avoid showing warnings on initial load)
  const hasEnabledChanged = isChecked !== savedIsEnabled;

  // Show info when user disables automatic completion that was previously enabled
  const showDisabledInfo = !isChecked && savedIsEnabled && hasEnabledChanged;

  // Show warning when user sets delay to 0 (immediate completion)
  const showZeroDelayWarning = isChecked && (delay === 0 || delay === "0");

  // Calculate date comparison data for warnings
  const cutOffDateComparison = React.useMemo(() => {
    if (!isChecked || !cutOffDate || !savedCutOffDate) {
      return {
        isEarlier: false,
        isLater: false,
        timeDifference: "",
        previousDate: "",
        newDate: "",
      };
    }

    const savedDate = new Date(`${savedCutOffDate}T${savedCutOffTime || "00:00"}`);
    const newDate = new Date(`${cutOffDate}T${cutOffTime || "00:00"}`);
    const diffMs = newDate.getTime() - savedDate.getTime();

    return {
      isEarlier: diffMs < 0,
      isLater: diffMs > 0,
      timeDifference: formatTimeDifference(diffMs, intl.locale),
      previousDate: formatDateTime(savedCutOffDate, savedCutOffTime, intl.locale),
      newDate: formatDateTime(cutOffDate, cutOffTime, intl.locale),
    };
  }, [isChecked, cutOffDate, cutOffTime, savedCutOffDate, savedCutOffTime, intl.locale]);

  const showCutOffDateEarlierWarning = cutOffDateComparison.isEarlier;
  const showCutOffDateLaterInfo = cutOffDateComparison.isLater;

  return (
    <Box paddingX={6}>
      <Checkbox
        name="automaticallyCompleteCheckouts"
        data-test-id="automatically-complete-checkouts-checkbox"
        checked={isChecked}
        error={hasError}
        onCheckedChange={handleMainCheckboxChange}
        disabled={disabled}
      >
        <Text>
          <FormattedMessage {...messages.automaticallyCompleteCheckoutsLabel} />
        </Text>
      </Checkbox>
      <Box paddingLeft={4}>
        <Text size={2} color="default2" paddingLeft={0.5}>
          <FormattedMessage
            {...messages.automaticallyCompleteCheckoutsDescription}
            values={{
              link: (
                <Link
                  href={DOCS_ULRS.TRANSACTIONS_AUTOMATIC_CHECKOUT_COMPLETION}
                  target="_blank"
                  rel="noopener noreferer"
                >
                  <FormattedMessage defaultMessage="Learn more" id="TdTXXf" />
                </Link>
              ),
            }}
          />
        </Text>
      </Box>

      {showDisabledInfo && (
        <Box paddingLeft={4} paddingTop={3}>
          <Box
            display="flex"
            alignItems="center"
            backgroundColor="info1"
            color="default1"
            padding={2}
            gap={2}
            borderRadius={3}
          >
            <Box flexShrink="0">
              <CircleAlertIcon size={16} />
            </Box>
            <Text size={2}>
              <FormattedMessage {...messages.automaticCompletionDisabledInfo} />
            </Text>
          </Box>
        </Box>
      )}

      {isChecked && (
        <Box paddingLeft={4} paddingTop={4} display="flex" flexDirection="column" gap={4}>
          <Box>
            <Input
              type="number"
              name="automaticCompletionDelay"
              data-test-id="automatic-completion-delay-input"
              label={intl.formatMessage(messages.automaticCompletionDelayLabel)}
              value={delay ?? ""}
              onChange={onDelayChange}
              disabled={disabled}
              min={0}
              error={hasError}
            />
            <Text size={2} color="default2" paddingTop={1}>
              <FormattedMessage {...messages.automaticCompletionDelayDescription} />
            </Text>
          </Box>

          {showZeroDelayWarning && (
            <Box paddingLeft={0}>
              <Box
                display="flex"
                alignItems="center"
                backgroundColor="warning1"
                color="default1"
                padding={2}
                gap={2}
                borderRadius={3}
              >
                <Box flexShrink="0">
                  <TriangleAlertIcon size={16} />
                </Box>
                <Text size={2}>
                  <FormattedMessage
                    {...messages.automaticCompletionZeroDelayWarning}
                    values={{
                      link: (
                        <Link
                          href={DOCS_ULRS.TRANSACTIONS_AUTOMATIC_CHECKOUT_COMPLETION}
                          target="_blank"
                          rel="noopener noreferer"
                        >
                          <FormattedMessage defaultMessage="Learn more" id="TdTXXf" />
                        </Link>
                      ),
                    }}
                  />
                </Text>
              </Box>
            </Box>
          )}

          <Box>
            {savedIsEnabled ? (
              <Tooltip>
                <Tooltip.Trigger>
                  <Box display="inline-block">
                    <Checkbox
                      name="useCutOffDate"
                      data-test-id="use-cutoff-date-checkbox"
                      checked={useCutOffDate}
                      onCheckedChange={onUseCutOffDateChange}
                      disabled={true}
                    >
                      <Text>
                        <FormattedMessage
                          {...messages.automaticCompletionCutOffDateCheckboxLabel}
                        />
                      </Text>
                    </Checkbox>
                  </Box>
                </Tooltip.Trigger>
                <Tooltip.Content side="bottom">
                  <Tooltip.Arrow />
                  <Box __maxWidth="280px">
                    <FormattedMessage {...messages.automaticCompletionCutOffDateDisabledTooltip} />
                  </Box>
                </Tooltip.Content>
              </Tooltip>
            ) : (
              <Checkbox
                name="useCutOffDate"
                data-test-id="use-cutoff-date-checkbox"
                checked={useCutOffDate}
                onCheckedChange={onUseCutOffDateChange}
                disabled={disabled}
              >
                <Text>
                  <FormattedMessage {...messages.automaticCompletionCutOffDateCheckboxLabel} />
                </Text>
              </Checkbox>
            )}
            <Box paddingLeft={4}>
              <Text size={2} color="default2" paddingLeft={0.5}>
                <FormattedMessage
                  {...messages.automaticCompletionCutOffDateDescription}
                  values={{
                    link: (
                      <Link
                        href={DOCS_ULRS.TRANSACTIONS_AUTOMATIC_CHECKOUT_COMPLETION}
                        target="_blank"
                        rel="noopener noreferer"
                      >
                        <FormattedMessage defaultMessage="Learn more" id="TdTXXf" />
                      </Link>
                    ),
                  }}
                />
              </Text>
            </Box>

            {!useCutOffDate && !savedIsEnabled && (
              <Box paddingLeft={4} paddingTop={3}>
                <Box
                  display="flex"
                  alignItems="center"
                  backgroundColor="warning1"
                  color="default1"
                  padding={2}
                  gap={2}
                  borderRadius={3}
                >
                  <Box flexShrink="0">
                    <TriangleAlertIcon size={16} />
                  </Box>
                  <Text size={2}>
                    <FormattedMessage {...messages.automaticCompletionCutOffDateWarning} />
                  </Text>
                </Box>
              </Box>
            )}

            {useCutOffDate && (
              <>
                <Box paddingLeft={4} paddingTop={3} display="flex" flexDirection="column" gap={2}>
                  <Box display="flex" gap={4}>
                    <Input
                      type="date"
                      name="automaticCompletionCutOffDate"
                      data-test-id="automatic-completion-cutoff-date-input"
                      label={intl.formatMessage(commonMessages.date)}
                      value={cutOffDate}
                      onChange={onCutOffDateChange}
                      disabled={disabled}
                      width="100%"
                    />
                    <Input
                      type="time"
                      name="automaticCompletionCutOffTime"
                      data-test-id="automatic-completion-cutoff-time-input"
                      label={intl.formatMessage(commonMessages.time)}
                      value={cutOffTime}
                      onChange={onCutOffTimeChange}
                      disabled={disabled}
                      width="100%"
                    />
                  </Box>
                  <Box display="flex" gap={2}>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={handleSetCurrentDateTime}
                      disabled={disabled}
                    >
                      <FormattedMessage {...messages.automaticCompletionSetCurrentDateTime} />
                    </Button>
                    {(showCutOffDateEarlierWarning || showCutOffDateLaterInfo) && (
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={handleResetToSaved}
                        disabled={disabled}
                      >
                        <FormattedMessage {...messages.automaticCompletionResetToSaved} />
                      </Button>
                    )}
                  </Box>
                </Box>

                {showCutOffDateEarlierWarning && (
                  <Box paddingLeft={4} paddingTop={3}>
                    <Box
                      display="flex"
                      alignItems="center"
                      backgroundColor="warning1"
                      color="default1"
                      padding={2}
                      gap={2}
                      borderRadius={3}
                    >
                      <Box flexShrink="0">
                        <TriangleAlertIcon size={16} />
                      </Box>
                      <Text size={2}>
                        <FormattedMessage
                          {...messages.automaticCompletionCutOffDateEarlierWarning}
                          values={{
                            timeDifference: cutOffDateComparison.timeDifference,
                            previousDate: cutOffDateComparison.previousDate,
                            newDate: cutOffDateComparison.newDate,
                          }}
                        />
                      </Text>
                    </Box>
                  </Box>
                )}

                {showCutOffDateLaterInfo && (
                  <Box paddingLeft={4} paddingTop={3}>
                    <Box
                      display="flex"
                      alignItems="center"
                      backgroundColor="info1"
                      color="default1"
                      padding={2}
                      gap={2}
                      borderRadius={3}
                    >
                      <Box flexShrink="0">
                        <CircleAlertIcon size={16} />
                      </Box>
                      <Text size={2}>
                        <FormattedMessage
                          {...messages.automaticCompletionCutOffDateLaterInfo}
                          values={{
                            timeDifference: cutOffDateComparison.timeDifference,
                            previousDate: cutOffDateComparison.previousDate,
                            newDate: cutOffDateComparison.newDate,
                          }}
                        />
                      </Text>
                    </Box>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};
