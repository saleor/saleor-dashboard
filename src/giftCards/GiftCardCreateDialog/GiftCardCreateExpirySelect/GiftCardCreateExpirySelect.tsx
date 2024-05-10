import ControlledCheckbox from "@dashboard/components/ControlledCheckbox";
import RadioGroupField from "@dashboard/components/RadioGroupField";
import VerticalSpacer from "@dashboard/components/VerticalSpacer";
import TimePeriodField from "@dashboard/giftCards/components/TimePeriodField";
import {
  GiftCardBulkCreateFormErrors,
  GiftCardCreateCommonFormData,
} from "@dashboard/giftCards/GiftCardBulkCreateDialog/types";
import { GiftCardExpiryType } from "@dashboard/giftCards/GiftCardCreateDialog/types";
import { getExpiryPeriodTerminationDate } from "@dashboard/giftCards/GiftCardCreateDialog/utils";
import { getGiftCardErrorMessage } from "@dashboard/giftCards/GiftCardUpdate/messages";
import useCurrentDate from "@dashboard/hooks/useCurrentDate";
import { FormChange } from "@dashboard/hooks/useForm";
import { TextField, Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage, MessageDescriptor, useIntl } from "react-intl";

import { giftCardCreateExpirySelectMessages as messages } from "./messages";
import { useGiftCardCreateExpirySelectStyles as useStyles } from "./styles";

interface UntranslatedOption {
  label: MessageDescriptor;
  value: GiftCardExpiryType;
}

const options: UntranslatedOption[] = [
  {
    label: messages.expiryPeriodLabel,
    value: "EXPIRY_PERIOD",
  },
  {
    label: messages.expiryDateLabel,
    value: "EXPIRY_DATE",
  },
];

interface GiftCardCreateExpirySelectProps {
  errors: GiftCardBulkCreateFormErrors;
  change: FormChange;
  data: Pick<
    GiftCardCreateCommonFormData,
    "expirySelected" | "expiryPeriodType" | "expiryPeriodAmount" | "expiryType" | "expiryDate"
  >;
}

const GiftCardCreateExpirySelect: React.FC<GiftCardCreateExpirySelectProps> = ({
  errors,
  change,
  data: { expirySelected, expiryPeriodType, expiryPeriodAmount, expiryType, expiryDate },
}) => {
  const intl = useIntl();
  const classes = useStyles({});
  const translatedOptions = options.map(({ label, value }) => ({
    value,
    label: intl.formatMessage(label),
  }));
  const currentDate = useCurrentDate();

  return (
    <>
      <ControlledCheckbox
        data-test-id="expiry-section"
        name={"expirySelected"}
        label={intl.formatMessage(messages.expirySelectedLabel)}
        checked={expirySelected}
        onChange={change}
      />
      {expirySelected && (
        <>
          <VerticalSpacer spacing={2} />
          <RadioGroupField
            innerContainerClassName={classes.radioGroupContainer}
            choices={translatedOptions}
            onChange={change}
            name={"expiryType"}
            value={expiryType}
            variant="inline"
          />
          <VerticalSpacer spacing={2} />

          {expiryType === "EXPIRY_DATE" && (
            <TextField
              error={!!errors?.expiryDate}
              helperText={getGiftCardErrorMessage(errors?.expiryDate, intl)}
              onChange={change}
              name={"expiryDate"}
              className={classes.dateField}
              label={intl.formatMessage(messages.expiryDateLabel)}
              value={expiryDate}
              InputLabelProps={{
                shrink: true,
              }}
              type="date"
            />
          )}

          {expiryType === "EXPIRY_PERIOD" && (
            <div data-test-id="gift-card-expire-data-fields" className={classes.periodField}>
              <TimePeriodField
                isError={!!errors?.expiryDate}
                helperText={getGiftCardErrorMessage(errors?.expiryDate, intl)}
                change={change}
                periodType={expiryPeriodType}
                periodAmount={expiryPeriodAmount}
                amountFieldName={"expiryPeriodAmount"}
                typeFieldName={"expiryPeriodType"}
              />
              <div>
                <Typography variant="caption">
                  <FormattedMessage {...messages.expiryOnLabel} />
                </Typography>
                <Typography>
                  {getExpiryPeriodTerminationDate(
                    currentDate,
                    expiryPeriodType,
                    expiryPeriodAmount,
                  )?.format("ll")}
                </Typography>
              </div>
            </div>
          )}
          <VerticalSpacer spacing={2} />
        </>
      )}
    </>
  );
};

export default GiftCardCreateExpirySelect;
