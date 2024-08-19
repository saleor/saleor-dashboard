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
import { Box, Checkbox, Input, RadioGroup, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, MessageDescriptor, useIntl } from "react-intl";

import { giftCardCreateExpirySelectMessages as messages } from "./messages";

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
  const translatedOptions = options.map(({ label, value }) => ({
    value,
    label: intl.formatMessage(label),
  }));
  const currentDate = useCurrentDate();

  return (
    <>
      <Checkbox
        data-test-id="expiry-section"
        name={"expirySelected"}
        checked={expirySelected}
        onCheckedChange={value => change({ target: { name: "expirySelected", value } })}
      >
        <Text>
          <FormattedMessage {...messages.expirySelectedLabel} />
        </Text>
      </Checkbox>
      {expirySelected && (
        <>
          <RadioGroup
            size="large"
            value={expiryType}
            name="expiryType"
            onValueChange={value => change({ target: { name: "expiryType", value } })}
            display="flex"
            gap={2}
            flexDirection="column"
          >
            {translatedOptions.map(({ label, value }) => (
              <RadioGroup.Item id={value} key={value} value={value}>
                <Text>{label}</Text>
              </RadioGroup.Item>
            ))}
          </RadioGroup>

          {expiryType === "EXPIRY_DATE" && (
            <Input
              error={!!errors?.expiryDate}
              helperText={getGiftCardErrorMessage(errors?.expiryDate, intl)}
              onChange={change}
              name={"expiryDate"}
              label={intl.formatMessage(messages.expiryDateLabel)}
              value={expiryDate}
              type="date"
            />
          )}

          {expiryType === "EXPIRY_PERIOD" && (
            <Box
              data-test-id="gift-card-expire-data-fields"
              display="flex"
              flexDirection="row"
              gap={4}
              alignItems={errors?.expiryDate ? "flex-start" : "center"}
            >
              <TimePeriodField
                isError={!!errors?.expiryDate}
                helperText={getGiftCardErrorMessage(errors?.expiryDate, intl)}
                change={change}
                periodType={expiryPeriodType}
                periodAmount={expiryPeriodAmount}
                amountFieldName={"expiryPeriodAmount"}
                typeFieldName={"expiryPeriodType"}
                // containerClassName={sprinkles({ width: "100%" })}
              />
              <Text style={{ textWrap: "nowrap" }}>
                <Text size={2} fontWeight="light" display="block">
                  <FormattedMessage {...messages.expiryOnLabel} />
                </Text>

                {getExpiryPeriodTerminationDate(
                  currentDate,
                  expiryPeriodType,
                  expiryPeriodAmount,
                )?.format("ll")}
              </Text>
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default GiftCardCreateExpirySelect;
