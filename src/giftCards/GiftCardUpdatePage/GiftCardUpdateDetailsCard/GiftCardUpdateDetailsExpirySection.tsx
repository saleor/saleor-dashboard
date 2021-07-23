import { TextField, Typography } from "@material-ui/core";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import RadioGroupField from "@saleor/components/RadioGroupField";
import { GiftCardExpiryTypeEnum } from "@saleor/types/globalTypes";
import React, { useContext } from "react";
import { useIntl } from "react-intl";

import {
  GiftCardUpdateFormContext,
  GiftCardUpdateFormData
} from "../GiftCardUpdateFormProvider";
import { giftCardUpdateDetailsExpirySectionMessages as messages } from "./messages";
import { useGiftCardDetailsExpiryStyles as useStyles } from "./styles";
import TimePeriodField from "./TimePeriodField";

const GiftCardUpdateDetailsExpirySection: React.FC = ({}) => {
  const intl = useIntl();
  const classes = useStyles({});

  const {
    change,
    data: { expiryType, expiryPeriodAmount, expiryPeriodType }
  } = useContext(GiftCardUpdateFormContext);

  const options = [
    {
      label: intl.formatMessage(messages.neverExpireLabel),
      value: GiftCardExpiryTypeEnum.NEVER_EXPIRY
    },
    {
      label: intl.formatMessage(messages.expiryPeriodLabel),
      value: GiftCardExpiryTypeEnum.EXPIRY_PERIOD
    },
    {
      label: intl.formatMessage(messages.expirationDateLabel),
      value: GiftCardExpiryTypeEnum.EXPIRY_DATE
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
      <VerticalSpacer spacing={2} />

      {expiryType === GiftCardExpiryTypeEnum.EXPIRY_DATE && (
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

export default GiftCardUpdateDetailsExpirySection;
