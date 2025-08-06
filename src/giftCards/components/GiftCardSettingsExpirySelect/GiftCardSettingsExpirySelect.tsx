import ControlledCheckbox from "@dashboard/components/ControlledCheckbox";
import VerticalSpacer from "@dashboard/components/VerticalSpacer";
import { getGiftCardSettingsErrorMessage } from "@dashboard/giftCards/GiftCardSettings/messages";
import { GiftCardSettingsErrorFragment, TimePeriodTypeEnum } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import TimePeriodField from "../TimePeriodField/TimePeriodField";
import { giftCardSettingsExpirySelectMessages as messages } from "./messages";

export interface GiftCardSettingsExpirySelectProps {
  change: FormChange;
  disabled: boolean;
  expiryPeriodActive: boolean;
  expiryPeriodType: TimePeriodTypeEnum;
  expiryPeriodAmount: number;
  errors?: Record<"expiryPeriod", GiftCardSettingsErrorFragment>;
}

const GiftCardSettingsExpirySelect = ({
  errors,
  change,
  disabled,
  expiryPeriodActive,
  expiryPeriodType,
  expiryPeriodAmount,
}: GiftCardSettingsExpirySelectProps) => {
  const intl = useIntl();

  return (
    <>
      <ControlledCheckbox
        name={"expiryPeriodActive"}
        label={
          <>
            <FormattedMessage {...messages.setExpirationPeriodTitle} />
            <Text size={2} fontWeight="light">
              <FormattedMessage {...messages.setExpirationPeriodDescription} />
            </Text>
          </>
        }
        checked={expiryPeriodActive}
        onChange={change}
        disabled={disabled}
        data-test-id="expiry-period-active"
      />

      {expiryPeriodActive && (
        <>
          <VerticalSpacer spacing={2} />
          <TimePeriodField
            isError={!!errors?.expiryPeriod}
            helperText={getGiftCardSettingsErrorMessage(errors?.expiryPeriod, intl)}
            change={change}
            periodType={expiryPeriodType}
            periodAmount={expiryPeriodAmount}
            amountFieldName={"expiryPeriodAmount"}
            typeFieldName={"expiryPeriodType"}
          />
        </>
      )}
    </>
  );
};

export default GiftCardSettingsExpirySelect;
