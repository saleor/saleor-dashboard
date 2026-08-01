import {
  type ChannelShippingZones,
  type ChannelWarehouses,
} from "@dashboard/channels/pages/ChannelDetailsPage/types";
import { DashboardCard } from "@dashboard/components/Card";
import { DetailGroupBox } from "@dashboard/components/DetailGroupBox/DetailGroupBox";
import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { Title2 } from "@dashboard/components/Title2/Title2";
import {
  type ChannelErrorFragment,
  type CountryCode,
  type MarkAsPaidStrategyEnum,
  type StockSettingsInput,
  type TransactionFlowStrategyEnum,
} from "@dashboard/graphql";
import { useClipboard } from "@dashboard/hooks/useClipboard";
import { type ChangeEvent, type FormChange } from "@dashboard/hooks/useForm";
import { buttonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getChannelsErrorMessage from "@dashboard/utils/errors/channels";
import { Box, Button, DynamicCombobox, Input, type Option } from "@saleor/macaw-ui-next";
import { Copy, Lock } from "lucide-react";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import slugify from "slugify";

import { ChannelOrderSettings } from "./ChannelOrderSettings";
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
  deleteExpiredOrdersAfter: number;
  allowUnpaidOrders: boolean;
  automaticallyConfirmAllNewOrders: boolean;
  automaticallyFulfillNonShippableGiftCard: boolean;
  defaultTransactionFlowStrategy: TransactionFlowStrategyEnum;
  automaticallyCompleteCheckouts: boolean;
  automaticCompletionDelay: number | string | null;
  automaticCompletionCutOffDate: string;
  automaticCompletionCutOffTime: string;
  allowLegacyGiftCardUse?: boolean;
}

interface ChannelFormProps {
  data: FormData;
  disabled: boolean;
  currencyCodes?: Option[];
  errors: ChannelErrorFragment[];
  selectedCurrencyCode?: string;
  selectedCountryDisplayName: string;
  countries: Option[];
  /** When true, show market helper, auto-slug, and collapse order settings into Advanced. */
  isCreate?: boolean;
  savedAutomaticallyCompleteCheckouts: boolean;
  savedAutomaticCompletionCutOffDate: string;
  savedAutomaticCompletionCutOffTime: string;
  onChange: FormChange;
  onCurrencyCodeChange?: (event: ChangeEvent) => void;
  onDefaultCountryChange: (event: ChangeEvent) => void;
  onMarkAsPaidStrategyChange: () => void;
  onTransactionFlowStrategyChange: () => void;
  onAutomaticallyCompleteCheckoutsChange: () => void;
  onAllowLegacyGiftCardUseChange?: () => void;
}

export const ChannelForm = ({
  currencyCodes,
  data,
  disabled,
  errors,
  selectedCurrencyCode,
  selectedCountryDisplayName,
  countries,
  isCreate = false,
  savedAutomaticallyCompleteCheckouts,
  savedAutomaticCompletionCutOffDate,
  savedAutomaticCompletionCutOffTime,
  onChange,
  onCurrencyCodeChange,
  onDefaultCountryChange,
  onMarkAsPaidStrategyChange,
  onTransactionFlowStrategyChange,
  onAutomaticallyCompleteCheckoutsChange,
  onAllowLegacyGiftCardUseChange,
}: ChannelFormProps) => {
  const intl = useIntl();
  const [, copy] = useClipboard();
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const formErrors = getFormErrors<keyof FormData, ChannelErrorFragment>(
    ["name", "slug", "currencyCode", "defaultCountry"],
    errors,
  );
  const renderCurrencySelection = currencyCodes && typeof onCurrencyCodeChange === "function";

  const handleNameChange = (event: ChangeEvent) => {
    onChange(event);

    if (isCreate && !slugManuallyEdited) {
      const nextName = typeof event.target.value === "string" ? event.target.value : "";

      onChange({
        target: {
          name: "slug",
          value: slugify(nextName).toLowerCase(),
        },
      });
    }
  };

  const handleSlugChange = (event: ChangeEvent) => {
    setSlugManuallyEdited(true);
    onChange(event);
  };

  const orderSettings = (
    <ChannelOrderSettings
      data={data}
      disabled={disabled}
      errors={errors}
      showHubHint={!isCreate}
      savedAutomaticallyCompleteCheckouts={savedAutomaticallyCompleteCheckouts}
      savedAutomaticCompletionCutOffDate={savedAutomaticCompletionCutOffDate}
      savedAutomaticCompletionCutOffTime={savedAutomaticCompletionCutOffTime}
      onChange={onChange}
      onMarkAsPaidStrategyChange={onMarkAsPaidStrategyChange}
      onTransactionFlowStrategyChange={onTransactionFlowStrategyChange}
      onAutomaticallyCompleteCheckoutsChange={onAutomaticallyCompleteCheckoutsChange}
      onAllowLegacyGiftCardUseChange={onAllowLegacyGiftCardUseChange}
    />
  );

  const nameError = getChannelsErrorMessage(formErrors?.name, intl);
  const slugError = getChannelsErrorMessage(formErrors?.slug, intl);
  const countryError = getChannelsErrorMessage(formErrors?.defaultCountry, intl);
  const currencyError = getChannelsErrorMessage(formErrors?.currencyCode, intl);

  return (
    <>
      <DashboardCard>
        <DashboardCard.Header>
          <Box display="flex" flexDirection="column" gap={1}>
            <DashboardCard.Title>
              {intl.formatMessage(messages.generalSettings)}
            </DashboardCard.Title>
            {isCreate && (
              <DashboardCard.Subtitle fontSize={3} color="default2">
                <FormattedMessage {...messages.marketHelper} />
              </DashboardCard.Subtitle>
            )}
          </Box>
        </DashboardCard.Header>
        <DashboardCard.Content data-test-id="general-information">
          <Box display="flex" flexDirection="column" gap={4}>
            <Input
              error={!!formErrors.name}
              helperText={nameError || intl.formatMessage(messages.channelNameHint)}
              disabled={disabled}
              label={intl.formatMessage(messages.channelName)}
              name="name"
              value={data.name}
              onChange={handleNameChange}
            />
            <Input
              data-test-id="slug-name-input"
              error={!!formErrors.slug}
              helperText={slugError || intl.formatMessage(messages.channelSlugHint)}
              disabled={disabled}
              label={intl.formatMessage(messages.channelSlug)}
              name="slug"
              value={data.slug}
              onChange={handleSlugChange}
              endAdornment={
                <Button
                  variant="tertiary"
                  size="small"
                  onClick={() => copy(data.slug)}
                  aria-label={intl.formatMessage(buttonMessages.copyToClipboard)}
                  icon={<Copy size={iconSize.medium} strokeWidth={iconStrokeWidth} />}
                />
              }
            />
            <Box
              display="flex"
              flexDirection={{ mobile: "column", tablet: "row", desktop: "row" }}
              gap={4}
            >
              <Box flexGrow="1" __minWidth="0">
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
              <Box flexGrow="1" __minWidth="0">
                {renderCurrencySelection ? (
                  <DynamicCombobox
                    data-test-id="channel-currency-select-input"
                    disabled={disabled}
                    error={!!formErrors.currencyCode}
                    label={intl.formatMessage(messages.channelCurrency)}
                    helperText={
                      currencyError || intl.formatMessage(messages.channelCurrencyHintCreate)
                    }
                    options={currencyCodes}
                    name="currencyCode"
                    value={{
                      label: selectedCurrencyCode ?? "",
                      value: selectedCurrencyCode ?? "",
                    }}
                    onChange={e =>
                      onCurrencyCodeChange({
                        target: {
                          value: e?.value ?? "",
                          name: "currencyCode",
                        },
                      })
                    }
                  />
                ) : (
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
                )}
              </Box>
            </Box>
          </Box>
        </DashboardCard.Content>
      </DashboardCard>
      {isCreate ? (
        <DashboardCard data-test-id="channel-order-checkout-settings">
          <DashboardCard.Content paddingY={6}>
            <DetailGroupBox
              groupId="channel-advanced-settings"
              triggerButtonTestId="channel-advanced-settings"
              defaultExpanded={false}
              marginTop={0}
              headerStart={<Title2>{intl.formatMessage(messages.advancedSettings)}</Title2>}
            >
              <Box padding={5}>{orderSettings}</Box>
            </DetailGroupBox>
          </DashboardCard.Content>
        </DashboardCard>
      ) : (
        <DashboardCard data-test-id="channel-order-checkout-settings">
          <DashboardCard.Header>
            <DashboardCard.Title>
              {intl.formatMessage(messages.orderAndCheckoutSettings)}
            </DashboardCard.Title>
          </DashboardCard.Header>
          <DashboardCard.Content>{orderSettings}</DashboardCard.Content>
        </DashboardCard>
      )}
    </>
  );
};
