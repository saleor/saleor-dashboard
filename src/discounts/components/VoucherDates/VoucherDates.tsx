import CardTitle from "@dashboard/components/CardTitle";
import { ControlledCheckbox } from "@dashboard/components/ControlledCheckbox";
import Grid from "@dashboard/components/Grid";
import { DiscountErrorFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getDiscountErrorMessage from "@dashboard/utils/errors/discounts";
import { Card, CardContent, TextField } from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";

import { VoucherDetailsPageFormData } from "../VoucherDetailsPage";

interface VoucherDatesProps {
  data: VoucherDetailsPageFormData;
  disabled: boolean;
  errors: DiscountErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const VoucherDates = ({
  data,
  disabled,
  errors,
  onChange,
}: VoucherDatesProps) => {
  const intl = useIntl();

  const formErrors = getFormErrors(["startDate", "endDate"], errors);

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          id: "YjcN9w",
          defaultMessage: "Active Dates",
          description: "time during voucher is active, header",
        })}
      />
      <CardContent>
        <Grid variant="uniform">
          <TextField
            disabled={disabled}
            error={!!formErrors.startDate}
            helperText={getDiscountErrorMessage(formErrors.startDate, intl)}
            name={"startDate" as keyof VoucherDetailsPageFormData}
            onChange={onChange}
            label={intl.formatMessage(commonMessages.startDate)}
            value={data.startDate}
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
          />
          <TextField
            disabled={disabled}
            error={!!formErrors.startDate}
            helperText={getDiscountErrorMessage(formErrors.startDate, intl)}
            name={"startTime" as keyof VoucherDetailsPageFormData}
            onChange={onChange}
            label={intl.formatMessage(commonMessages.startHour)}
            value={data.startTime}
            type="time"
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
          />
        </Grid>
        <ControlledCheckbox
          checked={data.hasEndDate}
          label={intl.formatMessage({
            id: "AVF5T5",
            defaultMessage: "Set end date",
            description: "voucher end date, switch button",
          })}
          name={"hasEndDate" as keyof VoucherDetailsPageFormData}
          onChange={onChange}
        />
        {data.hasEndDate && (
          <Grid variant="uniform">
            <TextField
              disabled={disabled}
              error={!!formErrors.endDate}
              helperText={getDiscountErrorMessage(formErrors.endDate, intl)}
              name={"endDate" as keyof VoucherDetailsPageFormData}
              onChange={onChange}
              label={intl.formatMessage(commonMessages.endDate)}
              value={data.endDate}
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
            <TextField
              disabled={disabled}
              error={!!formErrors.endDate}
              helperText={getDiscountErrorMessage(formErrors.endDate, intl)}
              name={"endTime" as keyof VoucherDetailsPageFormData}
              onChange={onChange}
              label={intl.formatMessage(commonMessages.endHour)}
              value={data.endTime}
              type="time"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};
export default VoucherDates;
