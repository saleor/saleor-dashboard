import Link from "@dashboard/components/Link";
import { commonMessages } from "@dashboard/intl";
import { DOCS_ULRS } from "@dashboard/links";
import { Box, Button, Checkbox, Input, Paragraph, Text } from "@saleor/macaw-ui-next";
import { CircleAlertIcon, TriangleAlertIcon } from "lucide-react";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "../messages";
import { useAutomaticCompletionHandlers } from "./useAutomaticCompletionHandlers";
import {
  CutOffDateComparison,
  useAutomaticCompletionWarnings,
} from "./useAutomaticCompletionWarnings";
import { getMinimumCutoffDate } from "./utils";

interface AutomaticallyCompleteCheckoutsProps {
  isChecked: boolean;
  hasError: boolean;
  disabled?: boolean;
  delay: number | string | null;
  cutOffDate: string;
  cutOffTime: string;
  cutOffDateError?: boolean;
  // Saved values from backend - used to track initial state for warnings
  savedIsEnabled: boolean;
  savedCutOffDate: string;
  savedCutOffTime: string;
  onCheckboxChange: () => void;
  onDelayChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCutOffDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCutOffTimeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CutOffDateEarlyWarning = ({
  cutOffDateComparison,
}: {
  cutOffDateComparison: CutOffDateComparison;
}) => {
  return (
    <Box
      display="flex"
      alignItems="flex-start"
      backgroundColor="warning1"
      color="default1"
      padding={2}
      gap={2}
      borderRadius={3}
    >
      <Box flexShrink="0" paddingTop={0.5}>
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
  );
};

const NoCutOffDateWarning = () => (
  <Box
    display="flex"
    alignItems="flex-start"
    backgroundColor="warning1"
    color="default1"
    padding={2}
    gap={2}
    borderRadius={3}
  >
    <Box flexShrink="0" paddingTop={0.5}>
      <TriangleAlertIcon size={16} />
    </Box>
    <Text size={2}>
      <FormattedMessage {...messages.automaticCompletionCutOffDateWarning} />
    </Text>
  </Box>
);

const CutOffDateLaterWarning = ({
  cutOffDateComparison,
}: {
  cutOffDateComparison: CutOffDateComparison;
}) => {
  return (
    <Box
      display="flex"
      alignItems="flex-start"
      backgroundColor="info1"
      color="default1"
      padding={2}
      gap={2}
      borderRadius={3}
    >
      <Box flexShrink="0" paddingTop={0.5}>
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
  );
};

const DelayZeroWarning = () => {
  return (
    <Box
      display="flex"
      alignItems="flex-start"
      backgroundColor="warning1"
      color="default1"
      padding={2}
      gap={2}
      borderRadius={3}
    >
      <Box flexShrink="0" paddingTop={0.5}>
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
                rel="noopener noreferrer"
              >
                <FormattedMessage defaultMessage="Learn more" id="TdTXXf" />
              </Link>
            ),
          }}
        />
      </Text>
    </Box>
  );
};

const AutocompleteDisabledAfterEnablingWarning = () => (
  <Box
    display="flex"
    alignItems="flex-start"
    backgroundColor="info1"
    color="default1"
    padding={2}
    gap={2}
    borderRadius={3}
  >
    <Box flexShrink="0" paddingTop={0.5}>
      <CircleAlertIcon size={16} />
    </Box>
    <Text size={2}>
      <FormattedMessage {...messages.automaticCompletionDisabledInfo} />
    </Text>
  </Box>
);

const FeatureDescription = () => (
  <Text size={2} color="default2">
    <FormattedMessage
      {...messages.automaticallyCompleteCheckoutsDescription}
      values={{
        link: (
          <Link
            style={{ fontSize: "inherit" }}
            href={DOCS_ULRS.TRANSACTIONS_AUTOMATIC_CHECKOUT_COMPLETION}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FormattedMessage defaultMessage="Learn more" id="TdTXXf" />
          </Link>
        ),
      }}
    />
  </Text>
);

export const AutomaticallyCompleteCheckouts = ({
  isChecked,
  hasError,
  disabled,
  delay,
  cutOffDate,
  cutOffTime,
  cutOffDateError,
  savedIsEnabled,
  savedCutOffDate,
  savedCutOffTime,
  onCheckboxChange,
  onDelayChange,
  onCutOffDateChange,
  onCutOffTimeChange,
}: AutomaticallyCompleteCheckoutsProps) => {
  const intl = useIntl();
  const minCutoffDate = getMinimumCutoffDate();

  const { handleMainCheckboxChange, handleSetCurrentDateTime, handleResetToSaved } =
    useAutomaticCompletionHandlers({
      savedCutOffDate,
      savedCutOffTime,
      onCheckboxChange,
      onCutOffDateChange,
      onCutOffTimeChange,
    });

  const {
    showDisabledInfo,
    showZeroDelayWarning,
    showCutOffDateEarlierWarning,
    showCutOffDateLaterInfo,
    cutOffDateComparison,
  } = useAutomaticCompletionWarnings({
    isChecked,
    delay,
    cutOffDate,
    cutOffTime,
    savedIsEnabled,
    savedCutOffDate,
    savedCutOffTime,
    intl,
  });

  return (
    <Box paddingX={6} paddingBottom={6}>
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
      <Box paddingLeft={4} marginLeft={0.5} marginTop={1}>
        <FeatureDescription />
      </Box>

      {showDisabledInfo && (
        <Box paddingLeft={4} paddingTop={3}>
          <AutocompleteDisabledAfterEnablingWarning />
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
              error={hasError}
              min={0}
            />
            <Text size={2} color="default2" marginTop={1} display="block">
              <FormattedMessage {...messages.automaticCompletionDelayDescription} />
            </Text>
          </Box>

          {showZeroDelayWarning && (
            <Box paddingLeft={0}>
              <DelayZeroWarning />
            </Box>
          )}

          <Box>
            <Box>
              <Paragraph marginBottom={2}>
                <FormattedMessage defaultMessage="Cut-off date" id="0Kz+nM" />
              </Paragraph>
              <Text size={2} color="default2">
                <FormattedMessage
                  {...messages.automaticCompletionCutOffDateDescription}
                  values={{
                    link: (
                      <Link
                        href={DOCS_ULRS.TRANSACTIONS_AUTOMATIC_CHECKOUT_COMPLETION}
                        target="_blank"
                        style={{ fontSize: "inherit" }}
                        rel="noopener noreferrer"
                      >
                        <FormattedMessage defaultMessage="Learn more" id="TdTXXf" />
                      </Link>
                    ),
                  }}
                />
              </Text>
            </Box>

            {!savedIsEnabled && (
              <Box paddingTop={3}>
                <NoCutOffDateWarning />
              </Box>
            )}

            <>
              <Box paddingTop={3} display="flex" flexDirection="column" gap={2}>
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
                    min={minCutoffDate}
                    error={cutOffDateError}
                    helperText={
                      cutOffDateError
                        ? intl.formatMessage(messages.automaticCompletionCutOffDateTooOldError)
                        : undefined
                    }
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
                <Box paddingTop={3}>
                  <CutOffDateEarlyWarning cutOffDateComparison={cutOffDateComparison} />
                </Box>
              )}

              {showCutOffDateLaterInfo && (
                <Box paddingTop={3}>
                  <CutOffDateLaterWarning cutOffDateComparison={cutOffDateComparison} />
                </Box>
              )}
            </>
          </Box>
        </Box>
      )}
    </Box>
  );
};
