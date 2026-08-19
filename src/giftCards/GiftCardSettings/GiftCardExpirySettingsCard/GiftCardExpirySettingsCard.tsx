import { SettingsFieldStack } from "@dashboard/components/Settings/SettingsFieldStack";
import { SettingsSection } from "@dashboard/components/Settings/SettingsSection";
import { SettingsToggleRow } from "@dashboard/components/Settings/SettingsToggleRow";
import { settingsHashes } from "@dashboard/configuration/settingsCatalog/hashes";
import TimePeriodField from "@dashboard/giftCards/components/TimePeriodField/TimePeriodField";
import { type GiftCardSettingsErrorFragment } from "@dashboard/graphql";
import { type FormChange } from "@dashboard/hooks/useForm";
import { type ChangeEvent } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { getGiftCardSettingsErrorMessage } from "../messages";
import { type GiftCardSettingsFormData } from "../types";
import { giftCardExpirySettingsCard as messages } from "./messages";

interface GiftCardExpirySettingsCardProps {
  data: GiftCardSettingsFormData;
  disabled: boolean;
  onChange: FormChange;
  errors?: {
    expiryPeriod?: GiftCardSettingsErrorFragment;
  };
}

export const GiftCardExpirySettingsCard = ({
  data,
  disabled,
  errors,
  onChange,
}: GiftCardExpirySettingsCardProps): JSX.Element => {
  const intl = useIntl();

  const handleToggle = (checked: boolean) => {
    onChange({
      target: { name: "expiryPeriodActive", value: checked },
    } as ChangeEvent<any>);
  };

  return (
    <SettingsSection
      id={settingsHashes.giftCardsExpiry}
      data-test-id="gift-card-settings"
      ownership="shop"
      title={intl.formatMessage(messages.expiryDateTitle)}
      description={<FormattedMessage {...messages.expiryDateSectionDescription} />}
    >
      <SettingsToggleRow
        name="expiryPeriodActive"
        title={<FormattedMessage {...messages.setExpirationPeriodTitle} />}
        description={<FormattedMessage {...messages.setExpirationPeriodDescription} />}
        checked={data.expiryPeriodActive}
        disabled={disabled}
        onCheckedChange={handleToggle}
        data-test-id="expiry-period-active"
      />
      {data.expiryPeriodActive ? (
        <SettingsFieldStack>
          <TimePeriodField
            isError={!!errors?.expiryPeriod}
            helperText={getGiftCardSettingsErrorMessage(errors?.expiryPeriod, intl)}
            change={onChange}
            periodType={data.expiryPeriodType}
            periodAmount={data.expiryPeriodAmount}
            amountFieldName="expiryPeriodAmount"
            typeFieldName="expiryPeriodType"
          />
        </SettingsFieldStack>
      ) : null}
    </SettingsSection>
  );
};
