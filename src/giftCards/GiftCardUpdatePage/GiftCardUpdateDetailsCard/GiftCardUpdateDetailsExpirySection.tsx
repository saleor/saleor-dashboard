import { TextField, Typography } from "@material-ui/core";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import RadioGroupField from "@saleor/components/RadioGroupField";
import { GiftCardExpiryType } from "@saleor/types/globalTypes";
import React, { useContext } from "react";
import { useIntl } from "react-intl";

import {
  GiftCardUpdateFormContext,
  GiftCardUpdateFormData
} from "../GiftCardUpdateFormProvider";
import { giftCardUpdateDetailsExpirySectionMessages as messages } from "./messages";
import { useGiftCardDetailsExpiryStyles as useStyles } from "./styles";
import TimePeriodTextWithSelectField from "./TimePeriodTextWithSelectField";

const GiftCardUpdateDetailsExpirySection: React.FC = ({}) => {
  const intl = useIntl();
  const classes = useStyles({});

  const {
    change,
    setSelectedTimePeriodType,
    data: { expiryType, expiryPeriodAmount, expiryPeriodType }
  } = useContext(GiftCardUpdateFormContext);

  const options = [
    {
      label: intl.formatMessage(messages.neverExpireLabel),
      value: GiftCardExpiryType.NEVER_EXPIRE
    },
    {
      label: intl.formatMessage(messages.expiryPeriodLabel),
      value: GiftCardExpiryType.EXPIRY_PERIOD
    },
    {
      label: intl.formatMessage(messages.expirationDateLabel),
      value: GiftCardExpiryType.EXPIRY_DATE
    }
  ];
  return (
    <>
      <Typography>
        {intl.formatMessage(messages.expirationDateLabel)}
      </Typography>
      <VerticalSpacer />
      <RadioGroupField
        innerContainerClassName={classes.radioGroupContainer}
        choices={options}
        onChange={change}
        name={"expiryType" as keyof GiftCardUpdateFormData}
        value={expiryType}
      />
      <VerticalSpacer />

      {expiryType === GiftCardExpiryType.EXPIRY_DATE && (
        <TextField
          onChange={change}
          name={"expiryDate" as keyof GiftCardUpdateFormData}
          className={classes.dateField}
          label={intl.formatMessage(messages.expiryDateLabel)}
          InputLabelProps={{
            shrink: true
          }}
          type="date"
        />
      )}

      {expiryType === GiftCardExpiryType.EXPIRY_PERIOD && (
        <TimePeriodTextWithSelectField
          periodType={expiryPeriodType}
          periodAmount={expiryPeriodAmount}
          change={change}
          setSelectedTimePeriod={setSelectedTimePeriodType}
          textFieldName={"expiryPeriodAmount" as keyof GiftCardUpdateFormData}
          selectFieldName={"expiryPeriodType" as keyof GiftCardUpdateFormData}
        />
      )}
    </>
  );
};

export default GiftCardUpdateDetailsExpirySection;
