import { TextField, Typography } from "@material-ui/core";
import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import RadioGroupField from "@saleor/components/RadioGroupField";
import { GiftCardError } from "@saleor/fragments/types/GiftCardError";
import { GiftCardExpiryType } from "@saleor/giftCards/GiftCardCreateDialog/types";
import { getExpiryPeriodTerminationDate } from "@saleor/giftCards/GiftCardCreateDialog/utils";
import { handleCheckboxChange } from "@saleor/giftCards/GiftCardUpdate/GiftCardResendCodeDialog/utils";
import { getGiftCardErrorMessage } from "@saleor/giftCards/GiftCardUpdate/messages";
import { FormChange } from "@saleor/hooks/useForm";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { TimePeriodTypeEnum } from "@saleor/types/globalTypes";
import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { MessageDescriptor, useIntl } from "react-intl";

import TimePeriodField from "../TimePeriodField/TimePeriodField";
import { giftCardExpirySelectMessages as messages } from "./messages";
import { useGiftCardExpirySelectStyles as useStyles } from "./styles";

interface UntranslatedOption {
  label: MessageDescriptor;
  value: GiftCardExpiryType;
}

const options: UntranslatedOption[] = [
  {
    label: messages.expiryPeriodLabel,
    value: "EXPIRY_PERIOD"
  },
  {
    label: messages.expiryDateLabel,
    value: "EXPIRY_DATE"
  }
];

interface GiftCardExpirySelectProps {
  change: FormChange;
  expiryPeriodType: TimePeriodTypeEnum;
  expiryPeriodAmount: number;
  expiryType: GiftCardExpiryType;
  customOptions?: UntranslatedOption[];
  errors?: Record<"expiryDate", GiftCardError>;
  expiryDate?: string;
}

const GiftCardExpirySelect: React.FC<GiftCardExpirySelectProps> = ({
  errors,
  change,
  expiryPeriodType,
  expiryPeriodAmount,
  expiryType = "EXPIRY_PERIOD",
  expiryDate,
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

  const [cardExpiresSelected, setCardExpiresSelected] = useStateFromProps(
    !!expiryDate
  );

  useEffect(() => {
    if (!cardExpiresSelected) {
      change({
        target: {
          name: "expiryDate",
          value: null
        }
      });
    }
  }, [cardExpiresSelected]);

  return (
    <>
      <ControlledCheckbox
        name={"cardExpiresSelected"}
        label={intl.formatMessage(messages.cardExpiresSelectedLabel)}
        checked={cardExpiresSelected}
        onChange={handleCheckboxChange(setCardExpiresSelected)}
      />
      {cardExpiresSelected && (
        <>
          <VerticalSpacer spacing={2} />
          <RadioGroupField
            innerContainerClassName={classes.radioGroupContainer}
            choices={translatedOptions}
            onChange={change}
            name={"expiryType"}
            value={expiryType}
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
                shrink: true
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
              <HorizontalSpacer spacing={2} />
              <div className={classes.dateText}>
                <Typography variant="caption">
                  <FormattedMessage {...messages.expiryOnLabel} />
                </Typography>
                <Typography>
                  {getExpiryPeriodTerminationDate(
                    expiryPeriodType,
                    expiryPeriodAmount
                  )}
                </Typography>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default GiftCardExpirySelect;
