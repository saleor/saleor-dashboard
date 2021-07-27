import { TextField, Typography } from "@material-ui/core";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import RadioGroupField from "@saleor/components/RadioGroupField";
import { FormChange } from "@saleor/hooks/useForm";
import {
  GiftCardExpiryTypeEnum,
  TimePeriodTypeEnum
} from "@saleor/types/globalTypes";
import React from "react";
import { MessageDescriptor, useIntl } from "react-intl";

import { giftCardExpirySelectMessages as messages } from "./messages";
import { useGiftCardExpirySelectStyles as useStyles } from "./styles";
import TimePeriodField from "../TimePeriodField/TimePeriodField";

interface UntranslatedOption {
  label: MessageDescriptor;
  value: GiftCardExpiryTypeEnum;
}

const options: UntranslatedOption[] = [
  {
    label: messages.neverExpireLabel,
    value: GiftCardExpiryTypeEnum.NEVER_EXPIRY
  },
  {
    label: messages.expiryPeriodLabel,
    value: GiftCardExpiryTypeEnum.EXPIRY_PERIOD
  },
  {
    label: messages.expirationDateLabel,
    value: GiftCardExpiryTypeEnum.EXPIRY_DATE
  }
];

interface GiftCardExpirySelectProps {
  change: FormChange;
  expiryPeriodType: TimePeriodTypeEnum;
  expiryPeriodAmount: number;
  expiryType: GiftCardExpiryTypeEnum;
  customOptions?: UntranslatedOption[];
}

const GiftCardExpirySelect: React.FC<GiftCardExpirySelectProps> = ({
  change,
  expiryPeriodType,
  expiryPeriodAmount,
  expiryType,
  customOptions
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  const translatedOptions = (customOptions || options).map(
    ({ label, value }) => ({
      value,
      label: intl.formatMessage(label)
    })
  );

  return (
    <>
      <Typography>
        {intl.formatMessage(messages.expirationDateLabel)}
      </Typography>
      <VerticalSpacer />
      <RadioGroupField
        innerContainerClassName={classes.radioGroupContainer}
        choices={translatedOptions}
        onChange={change}
        name={"expiryType"}
        value={expiryType}
      />
      <VerticalSpacer spacing={2} />

      {expiryType === GiftCardExpiryTypeEnum.EXPIRY_DATE && (
        <TextField
          onChange={change}
          name={"expiryDate"}
          className={classes.dateField}
          label={intl.formatMessage(messages.expiryDateLabel)}
          InputLabelProps={{
            shrink: true
          }}
          type="date"
        />
      )}

      {expiryType === GiftCardExpiryTypeEnum.EXPIRY_PERIOD && (
        <TimePeriodField
          change={change}
          periodType={expiryPeriodType}
          periodAmount={expiryPeriodAmount}
          amountFieldName={"expiryPeriodAmount"}
          typeFieldName={"expiryPeriodType"}
        />
      )}
    </>
  );
};

export default GiftCardExpirySelect;
