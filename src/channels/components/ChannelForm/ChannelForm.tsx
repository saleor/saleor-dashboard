import {
  type ChannelShippingZones,
  type ChannelWarehouses,
} from "@dashboard/channels/pages/ChannelDetailsPage/types";
import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { iconSize, iconStrokeWidth, iconStrokeWidthBySize } from "@dashboard/components/icons";
import {
  type ChannelErrorFragment,
  type CountryCode,
  type MarkAsPaidStrategyEnum,
  type StockSettingsInput,
  type TransactionFlowStrategyEnum,
} from "@dashboard/graphql";
import { useClipboard } from "@dashboard/hooks/useClipboard";
import { type FormChange } from "@dashboard/hooks/useForm";
import { buttonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getChannelsErrorMessage from "@dashboard/utils/errors/channels";
import { Box, Button, DynamicCombobox, Input, type Option } from "@saleor/macaw-ui-next";
import { Copy, Lock } from "lucide-react";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

import { channelSectionIds } from "../ChannelSectionNav/channelSectionIds";
import { ChannelSection } from "../ChannelSectionNav/ChannelSectionNav";
import styles from "./ChannelForm.module.css";
import { ChannelOrdersSection } from "./ChannelOrdersSection";
import { ChannelPaymentsCheckoutSection } from "./ChannelPaymentsCheckoutSection";
import { messages } from "./messages";

export interface FormData extends StockSettingsInput {
  name: string;
  currencyCode: string;
  slug: string;
  shippingZonesIdsToAdd: string[];
  shippingZonesIdsToRemove: string[];
  warehousesIdsToAdd: string[];
  warehousesIdsToRemove: string[];
  shippingZonesToDisplay: ChannelShippingZones;
  warehousesToDisplay: ChannelWarehouses;
  defaultCountry: CountryCode;
  markAsPaidStrategy: MarkAsPaidStrategyEnum;
  /** Minutes until unpaid unconfirmed orders expire; `0` / `null` disables. */
  expireOrdersAfter: number | null;
  deleteExpiredOrdersAfter: number;
  allowUnpaidOrders: boolean;
  automaticallyConfirmAllNewOrders: boolean;
  automaticallyFulfillNonShippableGiftCard: boolean;
  defaultTransactionFlowStrategy: TransactionFlowStrategyEnum;
  releaseFundsForExpiredCheckouts: boolean;
  /** Hours after checkout expiry before releasing held funds; unused when release is off. */
  checkoutTtlBeforeReleasingFunds: number | null;
  automaticallyCompleteCheckouts: boolean;
  automaticCompletionDelay: number | string | null;
  automaticCompletionCutOffDate: string;
  automaticCompletionCutOffTime: string;
  allowLegacyGiftCardUse?: boolean;
}

interface ChannelFormProps {
  data: FormData;
  disabled: boolean;
  errors: ChannelErrorFragment[];
  selectedCountryDisplayName: string;
  countries: Option[];
  /**
   * Edit layout: wrap General / Orders / Payments in scroll-spy sections
   * (parent owns padding + section nav; sidebar stays separate).
   */
  sectionLayout?: boolean;
  /** Rendered after the Payments section when section layout is enabled. */
  trailingSection?: ReactNode;
  savedAutomaticallyCompleteCheckouts: boolean;
  savedAutomaticCompletionCutOffDate: string;
  savedAutomaticCompletionCutOffTime: string;
  onChange: FormChange;
  onDefaultCountryChange: (event: { target: { name: string; value: string } }) => void;
}

export const ChannelForm = ({
  data,
  disabled,
  errors,
  selectedCountryDisplayName,
  countries,
  sectionLayout = false,
  trailingSection,
  savedAutomaticallyCompleteCheckouts,
  savedAutomaticCompletionCutOffDate,
  savedAutomaticCompletionCutOffTime,
  onChange,
  onDefaultCountryChange,
}: ChannelFormProps) => {
  const intl = useIntl();
  const [, copy] = useClipboard();
  const formErrors = getFormErrors<keyof FormData, ChannelErrorFragment>(
    ["name", "slug", "currencyCode", "defaultCountry"],
    errors,
  );

  const ordersSection = (
    <ChannelOrdersSection data={data} disabled={disabled} errors={errors} onChange={onChange} />
  );

  const paymentsCheckoutSection = (
    <ChannelPaymentsCheckoutSection
      data={data}
      disabled={disabled}
      errors={errors}
      savedAutomaticallyCompleteCheckouts={savedAutomaticallyCompleteCheckouts}
      savedAutomaticCompletionCutOffDate={savedAutomaticCompletionCutOffDate}
      savedAutomaticCompletionCutOffTime={savedAutomaticCompletionCutOffTime}
      onChange={onChange}
    />
  );

  const nameError = getChannelsErrorMessage(formErrors?.name, intl);
  const slugError = getChannelsErrorMessage(formErrors?.slug, intl);
  const countryError = getChannelsErrorMessage(formErrors?.defaultCountry, intl);

  const generalCard = (
    <DetailSettingsCard
      data-test-id="general-information"
      title={intl.formatMessage(messages.generalSettings)}
    >
      <Box display="flex" flexDirection="column" gap={4}>
        <Input
          error={!!formErrors.name}
          helperText={nameError || intl.formatMessage(messages.channelNameHint)}
          disabled={disabled}
          label={intl.formatMessage(messages.channelName)}
          name="name"
          value={data.name}
          onChange={onChange}
        />
        <Input
          data-test-id="slug-name-input"
          error={!!formErrors.slug}
          helperText={slugError || intl.formatMessage(messages.channelSlugHint)}
          disabled={disabled}
          label={intl.formatMessage(messages.channelSlug)}
          name="slug"
          value={data.slug}
          onChange={onChange}
          endAdornment={
            <Button
              variant="tertiary"
              size="small"
              type="button"
              className={styles.slugCopyButton}
              onClick={() => copy(data.slug)}
              aria-label={intl.formatMessage(buttonMessages.copyToClipboard)}
              icon={<Copy size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
            />
          }
        />
        <Box
          display="flex"
          flexDirection={{ mobile: "column", tablet: "row", desktop: "row" }}
          gap={4}
        >
          <Box __flex="1 1 0" __minWidth="0" width="100%">
            <DynamicCombobox
              data-test-id="country-select-input"
              disabled={disabled}
              error={!!formErrors.defaultCountry}
              label={intl.formatMessage(messages.defaultCountry)}
              helperText={countryError || intl.formatMessage(messages.defaultCountryHint)}
              options={countries}
              name="defaultCountry"
              value={{
                label: selectedCountryDisplayName,
                value: data.defaultCountry,
              }}
              onChange={v =>
                onDefaultCountryChange({
                  target: {
                    value: v?.value ?? "",
                    name: "defaultCountry",
                  },
                })
              }
            />
          </Box>
          <Box __flex="1 1 0" __minWidth="0" width="100%">
            <Input
              data-test-id="channel-currency-locked-input"
              disabled
              label={intl.formatMessage(messages.channelCurrency)}
              name="currencyCode"
              value={data.currencyCode}
              helperText={intl.formatMessage(messages.channelCurrencyHintLocked)}
              endAdornment={
                <Box
                  display="flex"
                  alignItems="center"
                  color="default2"
                  paddingRight={1}
                  aria-hidden
                >
                  <Lock size={iconSize.small} strokeWidth={iconStrokeWidth} />
                </Box>
              }
            />
          </Box>
        </Box>
      </Box>
    </DetailSettingsCard>
  );

  const ordersCard = (
    <DetailSettingsCard
      data-test-id="channel-orders-settings"
      title={intl.formatMessage(messages.ordersSectionTitle)}
      contentFlush
    >
      {ordersSection}
    </DetailSettingsCard>
  );

  const paymentsCard = (
    <DetailSettingsCard
      data-test-id="channel-payments-checkout-settings"
      title={intl.formatMessage(messages.paymentsCheckoutSectionTitle)}
      contentFlush
    >
      {paymentsCheckoutSection}
    </DetailSettingsCard>
  );

  if (sectionLayout) {
    return (
      <Box display="flex" flexDirection="column" gap={4}>
        <ChannelSection id={channelSectionIds.general}>{generalCard}</ChannelSection>
        <ChannelSection id={channelSectionIds.orders}>{ordersCard}</ChannelSection>
        <ChannelSection id={channelSectionIds.payments}>{paymentsCard}</ChannelSection>
        {trailingSection}
      </Box>
    );
  }

  return (
    <Box paddingX={6} paddingBottom={8} display="flex" flexDirection="column" gap={4}>
      {generalCard}
      {ordersCard}
      {paymentsCard}
    </Box>
  );
};
