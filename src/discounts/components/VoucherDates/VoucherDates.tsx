import { DashboardCard } from "@dashboard/components/Card";
import { DiscountErrorFragment } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getDiscountErrorMessage from "@dashboard/utils/errors/discounts";
import { Box, Checkbox, Input, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { VoucherDetailsPageFormData } from "../VoucherDetailsPage";

interface VoucherDatesProps {
  data: VoucherDetailsPageFormData;
  disabled: boolean;
  errors: DiscountErrorFragment[];
  onChange: FormChange;
}

const VoucherDates = ({ data, disabled, errors, onChange }: VoucherDatesProps) => {
  const intl = useIntl();
  const formErrors = getFormErrors(["startDate", "endDate"], errors);

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "YjcN9w",
            defaultMessage: "Active Dates",
            description: "time during voucher is active, header",
          })}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <Box display="flex" flexDirection="row" gap={6}>
          <Input
            disabled={disabled}
            error={!!formErrors.startDate}
            helperText={getDiscountErrorMessage(formErrors.startDate, intl)}
            name={"startDate" as keyof VoucherDetailsPageFormData}
            onChange={onChange}
            label={intl.formatMessage(commonMessages.startDate)}
            value={data.startDate}
            type="date"
            width="100%"
          />
          <Input
            disabled={disabled}
            error={!!formErrors.startDate}
            helperText={getDiscountErrorMessage(formErrors.startDate, intl)}
            name={"startTime" as keyof VoucherDetailsPageFormData}
            onChange={onChange}
            label={intl.formatMessage(commonMessages.startHour)}
            value={data.startTime}
            type="time"
            width="100%"
          />
        </Box>
        <Checkbox
          checked={data.hasEndDate}
          name={"hasEndDate" as keyof VoucherDetailsPageFormData}
          onCheckedChange={() => {
            onChange({
              target: {
                name: "hasEndDate",
                value: !data.hasEndDate,
              },
            } as React.ChangeEvent<any>);
          }}
          marginTop={2}
          marginBottom={4}
        >
          <Text>
            {intl.formatMessage({
              id: "AVF5T5",
              defaultMessage: "Set end date",
              description: "voucher end date, switch button",
            })}
          </Text>
        </Checkbox>
        {data.hasEndDate && (
          <Box display="flex" flexDirection="row" gap={6}>
            <Input
              disabled={disabled}
              error={!!formErrors.endDate}
              helperText={getDiscountErrorMessage(formErrors.endDate, intl)}
              name={"endDate" as keyof VoucherDetailsPageFormData}
              onChange={onChange}
              label={intl.formatMessage(commonMessages.endDate)}
              value={data.endDate}
              type="date"
              width="100%"
            />
            <Input
              disabled={disabled}
              error={!!formErrors.endDate}
              helperText={getDiscountErrorMessage(formErrors.endDate, intl)}
              name={"endTime" as keyof VoucherDetailsPageFormData}
              onChange={onChange}
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

export default VoucherDates;
