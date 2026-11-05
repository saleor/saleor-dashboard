import { DashboardCard } from "@dashboard/components/Card";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import { type CommonError, getCommonFormFieldErrorMessage } from "@dashboard/utils/errors/common";
import { Box, Checkbox, Input, Text } from "@saleor/macaw-ui-next";
import { type ChangeEvent, type FocusEvent, type ReactNode } from "react";
import { type FieldError } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import styles from "./DiscountDates.module.css";
import { getDefaultEndDateAfterStart } from "./getDefaultEndDateAfterStart";
import {
  END_SCHEDULE_DATE_FIELDS,
  getNextIncompleteScheduleFields,
  SCHEDULE_DATE_FIELDS,
  type ScheduleDateField,
} from "./incompleteScheduleFields";

interface DiscountDatesProps<ErrorCode> {
  data: {
    endDate: string;
    endTime: string;
    hasEndDate: boolean;
    startDate: string;
    startTime: string;
  };
  disabled: boolean;
  stacked?: boolean;
  /** Render fields without the nested Active Dates card chrome (e.g. Availability banner). */
  unwrapped?: boolean;
  formErrors?: {
    startDate?: FieldError;
  };
  errors: Array<CommonError<ErrorCode>>;
  /** Date and time inputs that are only partly filled in, which report an empty value. */
  incompleteFields?: readonly ScheduleDateField[];
  /** Pass to track partly filled inputs, e.g. to block saving them as empty. */
  onIncompleteFieldsChange?: (fields: ScheduleDateField[]) => void;
  onChange: (event: React.ChangeEvent<any>) => void;
  onBlur?: (event: React.FocusEvent<any>) => void;
}

const DiscountDatesFields = <ErrorCode,>({
  data,
  disabled,
  stacked = false,
  errors,
  formErrors,
  incompleteFields = [],
  onIncompleteFieldsChange,
  onChange,
  onBlur,
}: Omit<DiscountDatesProps<ErrorCode>, "unwrapped">): React.ReactNode => {
  const intl = useIntl();
  const apiErrors = getFormErrors([...SCHEDULE_DATE_FIELDS], errors);
  // A partly filled input always reports an empty value, so one with a value is complete.
  const isStartDateIncomplete = incompleteFields.includes("startDate") && !data.startDate;
  // The start hour also shows start date errors, since the API saves both as one value, but not
  // a partly entered start date, which only the date input can fix.
  const startHourError =
    apiErrors.startTime ?? (isStartDateIncomplete ? undefined : apiErrors.startDate);

  const trackIncompleteInput = (target: HTMLInputElement): void => {
    if (!onIncompleteFieldsChange) {
      return;
    }

    const nextIncompleteFields = getNextIncompleteScheduleFields(incompleteFields, target);

    if (nextIncompleteFields) {
      onIncompleteFieldsChange(nextIncompleteFields);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange(event);
    trackIncompleteInput(event.currentTarget);
  };

  // Typing into an empty input fires no change event until the value is complete, so
  // a partly filled input is also caught when it loses focus.
  const handleInputBlur = (event: FocusEvent<HTMLInputElement>): void => {
    onBlur?.(event);
    trackIncompleteInput(event.currentTarget);
  };

  const dateRowClassName = stacked ? styles.dateRowStacked : styles.dateRow;

  const handleHasEndDateChange = (): void => {
    const enabling = !data.hasEndDate;

    onChange({
      target: {
        name: "hasEndDate",
        value: enabling,
      },
    } as ChangeEvent<any>);

    // End inputs unmount when turned off and remount empty or seeded when turned back on.
    if (incompleteFields.some(field => END_SCHEDULE_DATE_FIELDS.includes(field))) {
      onIncompleteFieldsChange?.(
        incompleteFields.filter(field => !END_SCHEDULE_DATE_FIELDS.includes(field)),
      );
    }

    if (!enabling) {
      return;
    }

    // Seed end date to the day after start so the calendar opens near a valid choice
    // instead of an unrelated month (or a leftover date before start).
    const defaultEndDate = getDefaultEndDateAfterStart(data.startDate);
    const shouldSetEndDate = !!defaultEndDate && (!data.endDate || data.endDate <= data.startDate);

    if (shouldSetEndDate) {
      onChange({
        target: {
          name: "endDate",
          value: defaultEndDate,
        },
      } as ChangeEvent<any>);
    }

    if (!data.endTime) {
      onChange({
        target: {
          name: "endTime",
          // Match start hour when present; otherwise end-of-day so an empty hour
          // does not look unfinished in the picker.
          value: data.startTime || "23:59",
        },
      } as ChangeEvent<any>);
    }
  };

  return (
    <Box className={styles.root}>
      <Box className={dateRowClassName}>
        <Box className={styles.field}>
          <Input
            data-test-id="start-date-input"
            disabled={disabled}
            error={!!apiErrors.startDate || !!formErrors?.startDate}
            helperText={
              getCommonFormFieldErrorMessage(apiErrors.startDate, intl) ||
              formErrors?.startDate?.message
            }
            name="startDate"
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            label={intl.formatMessage(commonMessages.startDate)}
            value={data.startDate}
            type="date"
            width="100%"
          />
        </Box>
        <Box className={styles.field}>
          <Input
            data-test-id="start-hour-input"
            disabled={disabled}
            error={!!startHourError}
            helperText={getCommonFormFieldErrorMessage(startHourError, intl)}
            name="startTime"
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            label={intl.formatMessage(commonMessages.startHour)}
            value={data.startTime}
            type="time"
            width="100%"
          />
        </Box>
      </Box>
      <Checkbox
        marginY={4}
        checked={data.hasEndDate}
        data-test-id="has-end-date"
        name="hasEndDate"
        disabled={disabled}
        onCheckedChange={handleHasEndDateChange}
        onBlur={onBlur}
      >
        <Text>
          <FormattedMessage
            id="AVF5T5"
            defaultMessage="Set end date"
            description="voucher end date, switch button"
          />
        </Text>
      </Checkbox>
      {data.hasEndDate && (
        <Box className={dateRowClassName}>
          <Box className={styles.field}>
            <Input
              data-test-id="end-date-input"
              disabled={disabled}
              error={!!apiErrors.endDate}
              helperText={getCommonFormFieldErrorMessage(apiErrors.endDate, intl)}
              name="endDate"
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              label={intl.formatMessage(commonMessages.endDate)}
              value={data.endDate}
              type="date"
              min={data.startDate || undefined}
              width="100%"
            />
          </Box>
          <Box className={styles.field}>
            <Input
              data-test-id="end-hour-input"
              disabled={disabled}
              // API has a single endDate DateTime; empty time defaults to 00:00 in joinDateTime.
              // Do not paint endDate validation onto the hour field — it reads as "hour required".
              error={!!apiErrors.endTime}
              helperText={getCommonFormFieldErrorMessage(apiErrors.endTime, intl)}
              name="endTime"
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              label={intl.formatMessage(commonMessages.endHour)}
              value={data.endTime}
              type="time"
              width="100%"
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export const DiscountDates = <ErrorCode,>({
  unwrapped = false,
  ...props
}: DiscountDatesProps<ErrorCode>): React.ReactNode => {
  const fields: ReactNode = <DiscountDatesFields {...props} />;

  if (unwrapped) {
    return <Box data-test-id="active-dates-section">{fields}</Box>;
  }

  return (
    <DashboardCard data-test-id="active-dates-section">
      <DashboardCard.Header>
        <DashboardCard.Title
          size={props.stacked ? 6 : 5}
          fontWeight={props.stacked ? "medium" : "bold"}
        >
          <FormattedMessage
            id="zKOGkU"
            defaultMessage="Active Dates"
            description="time during discount is active, header"
          />
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>{fields}</DashboardCard.Content>
    </DashboardCard>
  );
};
