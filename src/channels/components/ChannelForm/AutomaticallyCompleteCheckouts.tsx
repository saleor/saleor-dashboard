import Link from "@dashboard/components/Link";
import { commonMessages } from "@dashboard/intl";
import { DOCS_ULRS } from "@dashboard/links";
import { Box, Button, Checkbox, InfoIcon, Input, Text, WarningIcon } from "@saleor/macaw-ui-next";
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
  onCheckboxChange: () => void;
  onDelayChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCutOffDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCutOffTimeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const hasCutOffDate = (cutOffDate: string) => !!cutOffDate;

export const AutomaticallyCompleteCheckouts = ({
  isChecked,
  hasError,
  disabled,
  delay,
  cutOffDate,
  cutOffTime,
  onCheckboxChange,
  onDelayChange,
  onCutOffDateChange,
  onCutOffTimeChange,
}: AutomaticallyCompleteCheckoutsProps) => {
  const intl = useIntl();
  const [showCutOffDate, setShowCutOffDate] = React.useState(hasCutOffDate(cutOffDate));
  // Track if automatic completion was enabled initially from the database
  const wasInitiallyEnabled = React.useRef(isChecked);
  // Track if cut-off date was set initially from the database
  const initiallyHadCutOffDate = React.useRef(hasCutOffDate(cutOffDate));
  // Track if user has unchecked the main checkbox (for showing info message)
  const [hasBeenUnchecked, setHasBeenUnchecked] = React.useState(false);
  // Track if user has enabled cut-off date (for showing info message)
  const [hasEnabledCutOffDate, setHasEnabledCutOffDate] = React.useState(false);

  const handleMainCheckboxChange = () => {
    if (isChecked && wasInitiallyEnabled.current) {
      // User is disabling a feature that was previously enabled
      setHasBeenUnchecked(true);
    }

    onCheckboxChange();
  };

  const handleCutOffDateCheckboxChange = () => {
    const newShowCutOffDate = !showCutOffDate;

    setShowCutOffDate(newShowCutOffDate);

    if (newShowCutOffDate && !initiallyHadCutOffDate.current) {
      // User is enabling cut-off date when it wasn't initially set
      setHasEnabledCutOffDate(true);
    }

    if (!newShowCutOffDate) {
      // Clear the date and time when disabling
      onCutOffDateChange({ target: { name: "automaticCompletionCutOffDate", value: "" } } as any);
      onCutOffTimeChange({ target: { name: "automaticCompletionCutOffTime", value: "" } } as any);
    }
  };

  // Show warning when:
  // - Automatic completion is NOW enabled
  // - Cut-off date is not enabled
  // - Feature was NOT enabled initially (first time enabling)
  const showWarning = isChecked && !showCutOffDate && !wasInitiallyEnabled.current;

  const handleSetCurrentDateTime = () => {
    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const time = now.toTimeString().slice(0, 5);

    onCutOffDateChange({ target: { name: "automaticCompletionCutOffDate", value: date } } as any);
    onCutOffTimeChange({ target: { name: "automaticCompletionCutOffTime", value: time } } as any);
  };

  // Show info message when user disables automatic completion that was previously enabled
  const showDisabledInfo = !isChecked && hasBeenUnchecked && wasInitiallyEnabled.current;

  // Show warning when user sets delay to 0 (immediate completion)
  // Handle both number and string "0" from input
  const showZeroDelayWarning = isChecked && (delay === 0 || delay === "0");

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
            color="info1"
            padding={2}
            gap={1}
            borderRadius={3}
          >
            <InfoIcon size="small" color="info1" />
            <Text size={2} color="info1">
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
                color="warning1"
                padding={2}
                gap={1}
                borderRadius={3}
              >
                <WarningIcon size="small" color="warning1" />
                <Text size={2} color="warning1">
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
            <Checkbox
              name="enableCutOffDate"
              data-test-id="enable-cutoff-date-checkbox"
              checked={showCutOffDate}
              onCheckedChange={handleCutOffDateCheckboxChange}
              disabled={disabled}
            >
              <Text size={4}>
                <FormattedMessage {...messages.automaticCompletionCutOffDateCheckboxLabel} />
              </Text>
            </Checkbox>
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

            {showWarning && (
              <Box paddingLeft={4} paddingTop={3}>
                <Box
                  display="flex"
                  alignItems="center"
                  backgroundColor="warning1"
                  color="warning1"
                  padding={2}
                  gap={1}
                  borderRadius={3}
                >
                  <WarningIcon size="small" color="warning1" />
                  <Text size={2} color="warning1">
                    <FormattedMessage {...messages.automaticCompletionCutOffDateWarning} />
                  </Text>
                </Box>
              </Box>
            )}

            {showCutOffDate && (
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
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={handleSetCurrentDateTime}
                    disabled={disabled}
                    alignSelf="start"
                  >
                    <FormattedMessage {...messages.automaticCompletionSetCurrentDateTime} />
                  </Button>
                </Box>
                {hasEnabledCutOffDate &&
                  wasInitiallyEnabled.current &&
                  !initiallyHadCutOffDate.current && (
                    <Box paddingLeft={4} paddingTop={3}>
                      <Box
                        display="flex"
                        alignItems="center"
                        backgroundColor="info1"
                        color="info1"
                        padding={2}
                        gap={1}
                        borderRadius={3}
                      >
                        <InfoIcon size="small" color="info1" />
                        <Text size={2} color="info1">
                          <FormattedMessage {...messages.automaticCompletionCutOffDateInfo} />
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
