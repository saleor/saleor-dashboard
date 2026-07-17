import { SettingsLinkCard } from "@dashboard/components/Settings/SettingsLinkCard";
import { settingsHashes } from "@dashboard/configuration/settingsCatalog/hashes";
import { sectionNames } from "@dashboard/intl";
import { refundsSettingsPath } from "@dashboard/refundsSettings/urls";
import { FormattedMessage, useIntl } from "react-intl";

export const OrderReturnsRefundsSettingsCard = (): JSX.Element => {
  const intl = useIntl();

  return (
    <SettingsLinkCard
      id={settingsHashes.ordersRefundsLink}
      data-test-id="order-returns-refunds-settings"
      ownership="shop"
      to={refundsSettingsPath}
      title={intl.formatMessage(sectionNames.refundsSettings)}
      description={
        <FormattedMessage
          id="34QbG4"
          defaultMessage="Choose model types used as refund and return reason references."
          description="hint under returns and refunds card on order settings"
        />
      }
    />
  );
};
