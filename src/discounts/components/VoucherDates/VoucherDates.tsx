import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import { ControlledCheckbox } from "@saleor/components/ControlledCheckbox";
import Grid from "@saleor/components/Grid";
import { commonMessages } from "@saleor/intl";
import { FormErrors } from "../../../types";
import { FormData } from "../VoucherDetailsPage";

interface VoucherDatesProps {
  data: FormData;
  defaultCurrency: string;
  disabled: boolean;
  errors: FormErrors<"endDate" | "startDate">;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const VoucherDates = ({
  data,
  disabled,
  errors,
  onChange
}: VoucherDatesProps) => {
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Active Dates",
          description: "time during voucher is active, header"
        })}
      />
      <CardContent>
        <Grid variant="uniform">
          <TextField
            disabled={disabled}
            error={!!errors.startDate}
            helperText={errors.startDate}
            name={"startDate" as keyof FormData}
            onChange={onChange}
            label={intl.formatMessage(commonMessages.startDate)}
            value={data.startDate}
            type="date"
            InputLabelProps={{
              shrink: true
            }}
            fullWidth
          />
          <TextField
            disabled={disabled}
            error={!!errors.startDate}
            helperText={errors.startDate}
            name={"startTime" as keyof FormData}
            onChange={onChange}
            label={intl.formatMessage(commonMessages.startHour)}
            value={data.startTime}
            type="time"
            InputLabelProps={{
              shrink: true
            }}
            fullWidth
          />
        </Grid>
        <ControlledCheckbox
          checked={data.hasEndDate}
          label={intl.formatMessage({
            defaultMessage: "Set end date",
            description: "voucher end date, switch button"
          })}
          name={"hasEndDate" as keyof FormData}
          onChange={onChange}
        />
        {data.hasEndDate && (
          <Grid variant="uniform">
            <TextField
              disabled={disabled}
              error={!!errors.endDate}
              helperText={errors.endDate}
              name={"endDate" as keyof FormData}
              onChange={onChange}
              label={intl.formatMessage(commonMessages.endDate)}
              value={data.endDate}
              type="date"
              InputLabelProps={{
                shrink: true
              }}
              fullWidth
            />
            <TextField
              disabled={disabled}
              error={!!errors.endDate}
              helperText={errors.endDate}
              name={"endTime" as keyof FormData}
              onChange={onChange}
              label={intl.formatMessage(commonMessages.endHour)}
              value={data.endTime}
              type="time"
              InputLabelProps={{
                shrink: true
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
