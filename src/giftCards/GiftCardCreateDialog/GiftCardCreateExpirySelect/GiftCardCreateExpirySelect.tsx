import { TextField, Typography } from "@material-ui/core";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import RadioGroupField from "@saleor/components/RadioGroupField";
import TimePeriodField from "@saleor/giftCards/components/TimePeriodField";
import {
  GiftCardBulkCreateFormErrors,
  GiftCardCreateCommonFormData,
} from "@saleor/giftCards/GiftCardBulkCreateDialog/types";
import { GiftCardExpiryType } from "@saleor/giftCards/GiftCardCreateDialog/types";
import { getExpiryPeriodTerminationDate } from "@saleor/giftCards/GiftCardCreateDialog/utils";
import { getGiftCardErrorMessage } from "@saleor/giftCards/GiftCardUpdate/messages";
import useCurrentDate from "@saleor/hooks/useCurrentDate";
import { FormChange } from "@saleor/hooks/useForm";
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
    | "expirySelected"
    | "expiryPeriodType"
    | "expiryPeriodAmount"
    | "expiryType"
    | "expiryDate"
  >;
}

const GiftCardCreateExpirySelect: React.FC<GiftCardCreateExpirySelectProps> = ({
  errors,
  change,
  data: {
    expirySelected,
    expiryPeriodType,
    expiryPeriodAmount,
    expiryType,
    expiryDate,
  },
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
            <div className={classes.periodField}>
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
