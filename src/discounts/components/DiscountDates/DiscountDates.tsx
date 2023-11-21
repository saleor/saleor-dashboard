import { DashboardCard } from "@dashboard/components/Card";
import { DiscountErrorFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getDiscountErrorMessage from "@dashboard/utils/errors/discounts";
import { Box, Checkbox, Input, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface DiscountDatesProps {
  data: {
    endDate: string;
    endTime: string;
    hasEndDate: boolean;
    startDate: string;
    startTime: string;
  };
  disabled: boolean;
  errors: DiscountErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
  onBlur?: (event: React.FocusEvent<any>) => void;
}

const DiscountDates = ({
  data,
  disabled,
  errors,
  onChange,
  onBlur,
}: DiscountDatesProps) => {
  const intl = useIntl();

  const formErrors = getFormErrors(["startDate", "endDate"], errors);

  return (
    <DashboardCard>
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
            disabled={disabled}
            error={!!formErrors.startDate}
            helperText={getDiscountErrorMessage(formErrors.startDate, intl)}
            name="startDate"
            onChange={onChange}
            onBlur={onBlur}
            label={intl.formatMessage(commonMessages.startDate)}
            value={data.startDate}
            type="date"
            width="100%"
          />
          <Input
            disabled={disabled}
            error={!!formErrors.startDate}
            helperText={getDiscountErrorMessage(formErrors.startDate, intl)}
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
          defaultChecked={data.hasEndDate}
          name="hasEndDate"
          onChange={onChange}
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
              disabled={disabled}
              error={!!formErrors.endDate}
              helperText={getDiscountErrorMessage(formErrors.endDate, intl)}
              name="endDate"
              onChange={onChange}
              onBlur={onBlur}
              label={intl.formatMessage(commonMessages.endDate)}
              value={data.endDate}
              type="date"
              width="100%"
            />
            <Input
              disabled={disabled}
              error={!!formErrors.endDate}
              helperText={getDiscountErrorMessage(formErrors.endDate, intl)}
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
