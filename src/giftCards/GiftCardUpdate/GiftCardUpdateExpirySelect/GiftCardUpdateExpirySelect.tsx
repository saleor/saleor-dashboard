import {
  DetailSettingNestedField,
  DetailSettingToggleRow,
} from "@dashboard/components/DetailSettingToggleRow/DetailSettingToggleRow";
import { MicrocopyLink } from "@dashboard/components/MicrocopyLink";
import { settingsHashes } from "@dashboard/configuration/settingsCatalog/hashes";
import { getGiftCardErrorMessage } from "@dashboard/giftCards/GiftCardUpdate/messages";
import useGiftCardUpdateForm from "@dashboard/giftCards/GiftCardUpdate/providers/GiftCardUpdateFormProvider/hooks/useGiftCardUpdateForm";
import { giftCardSettingsUrl } from "@dashboard/giftCards/urls";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { Box, Input, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { giftCardExpirySelectMessages as messages } from "./messages";

export const GiftCardUpdateExpirySelect = (): JSX.Element => {
  const intl = useIntl();
  const {
    change,
    data: { expiryDate },
    formErrors,
  } = useGiftCardUpdateForm();
  // Local UI state so the toggle can stay on while the date is still empty
  // (channel expire-orders sets a numeric default instead).
  const [cardExpiresSelected, setCardExpiresSelected] = useStateFromProps(!!expiryDate);

  const setExpiryEnabled = (enabled: boolean): void => {
    setCardExpiresSelected(enabled);

    if (!enabled) {
      change({
        target: {
          name: "expiryDate",
          value: "",
        },
      });
    }
  };

  return (
    <DetailSettingToggleRow
      testId="gift-card-expire-section"
      title={<FormattedMessage {...messages.expiryToggleTitle} />}
      description={
        <FormattedMessage
          {...messages.expiryToggleDescription}
          values={{
            settingsLink: (
              <MicrocopyLink
                to={giftCardSettingsUrl({
                  from: "gift-cards",
                  hash: settingsHashes.giftCardsExpiry,
                })}
              >
                <FormattedMessage {...messages.expirySettingsLink} />
              </MicrocopyLink>
            ),
          }}
        />
      }
      pressed={cardExpiresSelected}
      onPressedChange={setExpiryEnabled}
    >
      {cardExpiresSelected ? (
        <DetailSettingNestedField>
          <Text size={3} fontWeight="medium">
            <FormattedMessage {...messages.expiryDateFieldLabel} />
          </Text>
          <Box width="100%" __maxWidth="22rem">
            <Input
              type="date"
              name="expiryDate"
              value={expiryDate ?? ""}
              error={!!formErrors?.expiryDate}
              helperText={getGiftCardErrorMessage(formErrors?.expiryDate, intl)}
              onChange={change}
              data-test-id="gift-card-expiry-date-input"
              width="100%"
            />
          </Box>
        </DetailSettingNestedField>
      ) : null}
    </DetailSettingToggleRow>
  );
};
