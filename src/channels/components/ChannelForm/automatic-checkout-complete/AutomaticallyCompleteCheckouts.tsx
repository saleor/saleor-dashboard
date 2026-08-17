import Link from "@dashboard/components/Link";
import { commonMessages } from "@dashboard/intl";
import { DOCS_ULRS } from "@dashboard/links";
import { Box, Button, Input, Paragraph, Text } from "@saleor/macaw-ui-next";
import { CircleAlertIcon, TriangleAlertIcon } from "lucide-react";
import { type ChangeEvent } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ChannelSettingNestedField } from "../ChannelSettingToggleRow";
import { messages } from "../messages";
import { useAutomaticCompletionHandlers } from "./useAutomaticCompletionHandlers";
import {
  type CutOffDateComparison,
  useAutomaticCompletionWarnings,
} from "./useAutomaticCompletionWarnings";
import { getMinimumCutoffDate } from "./utils";

interface AutomaticallyCompleteCheckoutsFieldsProps {
  isChecked: boolean;
  hasError: boolean;
  disabled?: boolean;
  delay: number | string | null;
  cutOffDate: string;
  cutOffTime: string;
  cutOffDateError?: boolean;
  savedIsEnabled: boolean;
  savedCutOffDate: string;
  savedCutOffTime: string;
  onDelayChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onCutOffDateChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onCutOffTimeChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const CutOffDateEarlyWarning = ({
  cutOffDateComparison,
}: {
  cutOffDateComparison: CutOffDateComparison;
}) => (
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
}) => (
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

const DelayZeroWarning = () => (
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

/** Nested delay / cut-off fields for the auto-complete toggle row. */
export const AutomaticallyCompleteCheckoutsFields = ({
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
  onDelayChange,
  onCutOffDateChange,
  onCutOffTimeChange,
}: AutomaticallyCompleteCheckoutsFieldsProps) => {
  const intl = useIntl();
  const minCutoffDate = getMinimumCutoffDate();

  const { handleSetCurrentDateTime, handleResetToSaved } = useAutomaticCompletionHandlers({
    savedCutOffDate,
    savedCutOffTime,
    onCheckboxChange: () => {},
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
    <>
      {showDisabledInfo ? (
        <ChannelSettingNestedField>
          <AutocompleteDisabledAfterEnablingWarning />
        </ChannelSettingNestedField>
      ) : null}
      <ChannelSettingNestedField>
        <Text size={3} fontWeight="medium">
          <FormattedMessage {...messages.automaticCompletionDelayLabel} />
        </Text>
        <Box __width="120px">
          <Input
            type="number"
            name="automaticCompletionDelay"
            data-test-id="automatic-completion-delay-input"
            value={delay ?? ""}
            onChange={onDelayChange}
            disabled={disabled}
            error={hasError}
            min={0}
          />
        </Box>
        <Text size={2} color="default2">
          <FormattedMessage {...messages.automaticCompletionDelayDescription} />
        </Text>
        {showZeroDelayWarning ? <DelayZeroWarning /> : null}
      </ChannelSettingNestedField>
      <ChannelSettingNestedField>
        <Paragraph marginBottom={1}>
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
        {!savedIsEnabled ? (
          <Box paddingTop={3}>
            <NoCutOffDateWarning />
          </Box>
        ) : null}
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
              type="button"
              onClick={handleSetCurrentDateTime}
              disabled={disabled}
            >
              <FormattedMessage {...messages.automaticCompletionSetCurrentDateTime} />
            </Button>
            {(showCutOffDateEarlierWarning || showCutOffDateLaterInfo) && (
              <Button
                variant="secondary"
                size="small"
                type="button"
                onClick={handleResetToSaved}
                disabled={disabled}
              >
                <FormattedMessage {...messages.automaticCompletionResetToSaved} />
              </Button>
            )}
          </Box>
        </Box>
        {showCutOffDateEarlierWarning ? (
          <Box paddingTop={3}>
            <CutOffDateEarlyWarning cutOffDateComparison={cutOffDateComparison} />
          </Box>
        ) : null}
        {showCutOffDateLaterInfo ? (
          <Box paddingTop={3}>
            <CutOffDateLaterWarning cutOffDateComparison={cutOffDateComparison} />
          </Box>
        ) : null}
      </ChannelSettingNestedField>
    </>
  );
};
