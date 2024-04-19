import { DashboardCard } from "@dashboard/components/Card";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import { CommonError, getCommonFormFieldErrorMessage } from "@dashboard/utils/errors/common";
import { Box, Checkbox, Input, Text } from "@saleor/macaw-ui-next";
import React, { ChangeEvent } from "react";
import { FieldError } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

interface DiscountDatesProps<ErrorCode> {
  data: {
    endDate: string;
    endTime: string;
    hasEndDate: boolean;
    startDate: string;
    startTime: string;
  };
  disabled: boolean;
  formErrors?: {
    startDate?: FieldError;
  };
  errors: Array<CommonError<ErrorCode>>;
  onChange: (event: React.ChangeEvent<any>) => void;
  onBlur?: (event: React.FocusEvent<any>) => void;
}

const DiscountDates = <ErrorCode,>({
  data,
  disabled,
  errors,
  formErrors,
  onChange,
  onBlur,
}: DiscountDatesProps<ErrorCode>) => {
  const intl = useIntl();
  const apiErrors = getFormErrors(["startDate", "endDate"], errors);

  return (
    <DashboardCard data-test-id="active-dates-section">
      <DashboardCard.Title>
        <FormattedMessage
          id="zKOGkU"
          defaultMessage="Active Dates"
          description="time during discount is active, header"
        />
      </DashboardCard.Title>

      <DashboardCard.Content>
        <Box display="flex" gap={4}>
          <Input
            data-test-id="start-date-input"
            disabled={disabled}
            error={!!apiErrors.startDate || !!formErrors?.startDate}
            helperText={
              getCommonFormFieldErrorMessage(apiErrors.startDate, intl) ||
              formErrors?.startDate?.message
            }
            name="startDate"
            onChange={onChange}
            onBlur={onBlur}
            label={intl.formatMessage(commonMessages.startDate)}
            value={data.startDate}
            type="date"
            width="100%"
          />
          <Input
            data-test-id="start-hour-input"
            disabled={disabled}
            error={!!apiErrors.startDate}
            helperText={getCommonFormFieldErrorMessage(apiErrors.startDate, intl)}
            name="startTime"
            onChange={onChange}
            onBlur={onBlur}
            label={intl.formatMessage(commonMessages.startHour)}
            value={data.startTime}
            type="time"
            width="100%"
          />
        </Box>
        <Checkbox
          marginY={4}
          checked={data.hasEndDate}
          data-test-id="has-end-date"
          name="hasEndDate"
          disabled={disabled}
          onCheckedChange={() => {
            onChange({
              target: {
                name: "hasEndDate",
                value: !data.hasEndDate,
              },
            } as ChangeEvent<any>);
          }}
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
          <Box display="flex" gap={4}>
            <Input
              data-test-id="end-date-input"
              disabled={disabled}
              error={!!apiErrors.endDate}
              helperText={getCommonFormFieldErrorMessage(apiErrors.endDate, intl)}
              name="endDate"
              onChange={onChange}
              onBlur={onBlur}
              label={intl.formatMessage(commonMessages.endDate)}
              value={data.endDate}
              type="date"
              width="100%"
            />
            <Input
              data-test-id="end-hour-input"
              disabled={disabled}
              error={!!apiErrors.endDate}
              helperText={getCommonFormFieldErrorMessage(apiErrors.endDate, intl)}
              name="endTime"
              onChange={onChange}
              onBlur={onBlur}
              label={intl.formatMessage(commonMessages.endHour)}
              value={data.endTime}
              type="time"
              width="100%"
            />
          </Box>
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

export default DiscountDates;
