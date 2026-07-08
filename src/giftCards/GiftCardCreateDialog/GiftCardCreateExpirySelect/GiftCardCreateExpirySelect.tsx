import { NewRadioGroupField as RadioGroupField } from "@dashboard/components/RadioGroupField";
import TimePeriodField from "@dashboard/giftCards/components/TimePeriodField";
import {
  type GiftCardBulkCreateFormErrors,
  type GiftCardCreateCommonFormData,
} from "@dashboard/giftCards/GiftCardBulkCreateDialog/types";
import { type GiftCardExpiryType } from "@dashboard/giftCards/GiftCardCreateDialog/types";
import { getExpiryPeriodTerminationDate } from "@dashboard/giftCards/GiftCardCreateDialog/utils";
import { getGiftCardErrorMessage } from "@dashboard/giftCards/GiftCardUpdate/messages";
import { useCurrentDate } from "@dashboard/hooks/useCurrentDate";
import { type FormChange } from "@dashboard/hooks/useForm";
import { Box, Checkbox, Input, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, type MessageDescriptor, useIntl } from "react-intl";

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
  change: FormChange;
  data: Pick<
    GiftCardCreateCommonFormData,
    "expiryDate" | "expiryPeriodAmount" | "expiryPeriodType" | "expirySelected" | "expiryType"
  >;
  errors: GiftCardBulkCreateFormErrors;
}

const GiftCardCreateExpirySelect = ({
  change,
  data: { expiryDate, expiryPeriodAmount, expiryPeriodType, expirySelected, expiryType },
  errors,
}: GiftCardCreateExpirySelectProps) => {
  const intl = useIntl();
  const translatedOptions = options.map(({ label, value }) => ({
    label: intl.formatMessage(label),
    value,
  }));
  const currentDate = useCurrentDate();
  const expiryPreviewDate = getExpiryPeriodTerminationDate(
    currentDate,
    expiryPeriodType,
    expiryPeriodAmount,
  )?.format("ll");

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Checkbox
        checked={expirySelected}
        data-test-id="expiry-section"
        gap={3}
        name="expirySelected"
        onCheckedChange={value => change({ target: { name: "expirySelected", value } })}
      >
        <Text>
          <FormattedMessage {...messages.expirySelectedLabel} />
        </Text>
      </Checkbox>
      {expirySelected ? (
        <Box display="flex" flexDirection="column" gap={4} paddingLeft={6}>
          <RadioGroupField
            choices={translatedOptions}
            error={false}
            name="expiryType"
            onChange={change}
            value={expiryType}
          />

          {expiryType === "EXPIRY_DATE" ? (
            <Input
              error={!!errors?.expiryDate}
              helperText={getGiftCardErrorMessage(errors?.expiryDate, intl)}
              label={intl.formatMessage(messages.expiryDateLabel)}
              name="expiryDate"
              onChange={change}
              type="date"
              value={expiryDate}
            />
          ) : null}

          {expiryType === "EXPIRY_PERIOD" ? (
            <Box display="flex" flexDirection="column" gap={2}>
              <TimePeriodField
                amountFieldName="expiryPeriodAmount"
                change={change}
                helperText={getGiftCardErrorMessage(errors?.expiryDate, intl)}
                isError={!!errors?.expiryDate}
                periodAmount={expiryPeriodAmount}
                periodType={expiryPeriodType}
                typeFieldName="expiryPeriodType"
              />
              {expiryPreviewDate ? (
                <Text color="default2" size={2}>
                  <FormattedMessage {...messages.expiryOnLabel} />{" "}
                  <Text as="span" color="default1" size={2}>
                    {expiryPreviewDate}
                  </Text>
                </Text>
              ) : null}
            </Box>
          ) : null}
        </Box>
      ) : null}
    </Box>
  );
};

export { GiftCardCreateExpirySelect };
export default GiftCardCreateExpirySelect;
