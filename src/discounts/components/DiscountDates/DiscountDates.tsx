import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import CardTitle from "@saleor/components/CardTitle";
import { ControlledCheckbox } from "@saleor/components/ControlledCheckbox";
import Grid from "@saleor/components/Grid";
import { DiscountErrorFragment } from "@saleor/fragments/types/DiscountErrorFragment";
import { commonMessages } from "@saleor/intl";
import { getFormErrors } from "@saleor/utils/errors";
import getDiscountErrorMessage from "@saleor/utils/errors/discounts";
import React from "react";
import { useIntl } from "react-intl";

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
}

const DiscountDates = ({
  data,
  disabled,
  errors,
  onChange
}: DiscountDatesProps) => {
  const intl = useIntl();

  const formErrors = getFormErrors(["startDate", "endDate"], errors);

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Active Dates",
          description: "time during discount is active, header"
        })}
      />
      <CardContent>
        <Grid variant="uniform">
          <TextField
            disabled={disabled}
            error={!!formErrors.startDate}
            helperText={getDiscountErrorMessage(formErrors.startDate, intl)}
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
            error={!!formErrors.startDate}
            helperText={getDiscountErrorMessage(formErrors.startDate, intl)}
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
              error={!!formErrors.endDate}
              helperText={getDiscountErrorMessage(formErrors.endDate, intl)}
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
              error={!!formErrors.endDate}
              helperText={getDiscountErrorMessage(formErrors.endDate, intl)}
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
export default DiscountDates;
