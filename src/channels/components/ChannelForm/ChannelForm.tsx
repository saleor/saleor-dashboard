import { AutomaticallyCompleteCheckouts } from "@dashboard/channels/components/ChannelForm/automatic-checkout-complete/AutomaticallyCompleteCheckouts";
import {
  type ChannelShippingZones,
  type ChannelWarehouses,
} from "@dashboard/channels/pages/ChannelDetailsPage/types";
import { DashboardCard } from "@dashboard/components/Card";
import FormSpacer from "@dashboard/components/FormSpacer";
import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { MicrocopyLink } from "@dashboard/components/MicrocopyLink";
import {
  type ChannelErrorFragment,
  type CountryCode,
  isStagingSchema,
  MarkAsPaidStrategyEnum,
  type StockSettingsInput,
  TransactionFlowStrategyEnum,
} from "@dashboard/graphql";
import { useClipboard } from "@dashboard/hooks/useClipboard";
import { type ChangeEvent, type FormChange } from "@dashboard/hooks/useForm";
import { commonMessages, sectionNames } from "@dashboard/intl";
import { orderSettingsPath } from "@dashboard/orders/urls";
import { getFormErrors } from "@dashboard/utils/errors";
import getChannelsErrorMessage from "@dashboard/utils/errors/channels";
import {
  Box,
  Button,
  Checkbox,
  DynamicCombobox,
  Input,
  type Option,
  Text,
} from "@saleor/macaw-ui-next";
import { Copy } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

import { AllowLegacyGiftCardUse } from "./AllowLegacyGiftCardUse";
import { AllowUnpaidOrders } from "./AllowUnpaidOrders";
import { DefaultTransactionFlowStrategy } from "./DefaultTransactionFlowStrategy";
import { MarkAsPaid } from "./MarkAsPaid";
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
  // Saved values from backend for automatic checkout completion warnings
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
  const formErrors = getFormErrors<keyof FormData, ChannelErrorFragment>(
    [
      "name",
      "slug",
      "currencyCode",
      "defaultCountry",
      "deleteExpiredOrdersAfter",
      "automaticCompletionDelay",
      "automaticCompletionCutOffDate",
    ],
    errors,
  );
  const renderCurrencySelection = currencyCodes && typeof onCurrencyCodeChange === "function";

  return (
    <>
      <DashboardCard>
        <DashboardCard.Header>
          <DashboardCard.Title>
            {intl.formatMessage(commonMessages.generalInformations)}
          </DashboardCard.Title>
        </DashboardCard.Header>
        <DashboardCard.Content data-test-id="general-information">
          <Input
            error={!!formErrors.name}
            helperText={getChannelsErrorMessage(formErrors?.name, intl)}
            disabled={disabled}
            label={intl.formatMessage(messages.channelName)}
            name="name"
            value={data.name}
            onChange={onChange}
          />
          <FormSpacer />
          <Input
            data-test-id="slug-name-input"
            error={!!formErrors.slug}
            helperText={getChannelsErrorMessage(formErrors?.slug, intl)}
            disabled={disabled}
            label={intl.formatMessage(messages.channelSlug)}
            name="slug"
            value={data.slug}
            onChange={onChange}
            endAdornment={
              <Button
                variant="tertiary"
                size="small"
                onClick={() => copy(data.slug)}
                icon={<Copy size={iconSize.medium} strokeWidth={iconStrokeWidth} />}
              />
            }
          />
        </DashboardCard.Content>
      </DashboardCard>
      <DashboardCard>
        <DashboardCard.Header>
          <DashboardCard.Title>{intl.formatMessage(messages.channelSettings)}</DashboardCard.Title>
        </DashboardCard.Header>
        <DashboardCard.Content>
          <Box display="flex" flexDirection="column" gap={4}>
            {renderCurrencySelection ? (
              <DynamicCombobox
                data-test-id="channel-currency-select-input"
                disabled={disabled}
                error={!!formErrors.currencyCode}
                label={intl.formatMessage(messages.channelCurrency)}
                helperText={getChannelsErrorMessage(formErrors?.currencyCode, intl)}
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
              <Box display="flex" flexDirection="column">
                <Text size={2}>
                  <FormattedMessage {...messages.selectedCurrency} />
                </Text>
                <Text>{data.currencyCode}</Text>
              </Box>
            )}
            <DynamicCombobox
              data-test-id="country-select-input"
              disabled={disabled}
              error={!!formErrors.defaultCountry}
              label={intl.formatMessage(messages.defaultCountry)}
              helperText={getChannelsErrorMessage(formErrors?.defaultCountry, intl)}
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
        </DashboardCard.Content>
      </DashboardCard>
      <DashboardCard data-test-id="channel-order-checkout-settings">
        <DashboardCard.Header>
          <Box display="flex" flexDirection="column" gap={1}>
            <DashboardCard.Title>
              {intl.formatMessage(messages.orderAndCheckoutSettings)}
            </DashboardCard.Title>
            <DashboardCard.Subtitle fontSize={3} color="default2">
              <FormattedMessage
                {...messages.orderAndCheckoutSettingsHint}
                values={{
                  link: (
                    <MicrocopyLink to={orderSettingsPath}>
                      <FormattedMessage {...sectionNames.ordersAndFulfillment} />
                    </MicrocopyLink>
                  ),
                }}
              />
            </DashboardCard.Subtitle>
          </Box>
        </DashboardCard.Header>
        <DashboardCard.Content>
          <Box display="flex" flexDirection="column" gap={4}>
            <Box paddingX={0}>
              <Checkbox
                name="automaticallyConfirmAllNewOrders"
                data-test-id="channel-automatically-confirm-orders-checkbox"
                checked={data.automaticallyConfirmAllNewOrders}
                onCheckedChange={value =>
                  onChange({
                    target: { name: "automaticallyConfirmAllNewOrders", value },
                  })
                }
                disabled={disabled}
              >
                <Text>
                  <FormattedMessage {...messages.automaticallyConfirmAllNewOrdersLabel} />
                </Text>
              </Checkbox>
              <Box paddingLeft={4}>
                <Text size={3} color="default2">
                  <FormattedMessage {...messages.automaticallyConfirmAllNewOrdersDescription} />
                </Text>
              </Box>
            </Box>
            <Box>
              <Checkbox
                name="automaticallyFulfillNonShippableGiftCard"
                data-test-id="channel-automatically-fulfill-gift-cards-checkbox"
                checked={data.automaticallyFulfillNonShippableGiftCard}
                onCheckedChange={value =>
                  onChange({
                    target: { name: "automaticallyFulfillNonShippableGiftCard", value },
                  })
                }
                disabled={disabled}
              >
                <Text>
                  <FormattedMessage {...messages.automaticallyFulfillNonShippableGiftCardLabel} />
                </Text>
              </Checkbox>
              <Box paddingLeft={4}>
                <Text size={3} color="default2">
                  <FormattedMessage
                    {...messages.automaticallyFulfillNonShippableGiftCardDescription}
                  />
                </Text>
              </Box>
            </Box>
            <Box>
              <Text size={2} color="default2" marginBottom={2}>
                <FormattedMessage {...messages.orderExpirationDescription} />
              </Text>
              <Input
                name="deleteExpiredOrdersAfter"
                data-test-id="delete-expired-order-input"
                value={data.deleteExpiredOrdersAfter}
                error={!!formErrors.deleteExpiredOrdersAfter}
                type="number"
                label={intl.formatMessage(messages.orderExpiration)}
                onChange={onChange}
                min={0}
                max={120}
              />
            </Box>
            <MarkAsPaid
              isChecked={data.markAsPaidStrategy === MarkAsPaidStrategyEnum.TRANSACTION_FLOW}
              onCheckedChange={onMarkAsPaidStrategyChange}
              hasError={!!formErrors.markAsPaidStrategy}
              disabled={disabled}
            />
            <AllowUnpaidOrders
              onChange={onChange}
              isChecked={data.allowUnpaidOrders}
              hasError={!!formErrors.allowUnpaidOrders}
              disabled={disabled}
            />
            <DefaultTransactionFlowStrategy
              onChange={onTransactionFlowStrategyChange}
              isChecked={
                data.defaultTransactionFlowStrategy === TransactionFlowStrategyEnum.AUTHORIZATION
              }
              hasError={!!formErrors.defaultTransactionFlowStrategy}
              disabled={disabled}
            />
            <AutomaticallyCompleteCheckouts
              hasError={!!formErrors.automaticCompletionDelay}
              isChecked={data.automaticallyCompleteCheckouts}
              disabled={disabled}
              delay={data.automaticCompletionDelay}
              cutOffDate={data.automaticCompletionCutOffDate}
              cutOffTime={data.automaticCompletionCutOffTime}
              cutOffDateError={!!formErrors.automaticCompletionCutOffDate}
              savedIsEnabled={savedAutomaticallyCompleteCheckouts}
              savedCutOffDate={savedAutomaticCompletionCutOffDate}
              savedCutOffTime={savedAutomaticCompletionCutOffTime}
              onCheckboxChange={onAutomaticallyCompleteCheckoutsChange}
              onDelayChange={onChange}
              onCutOffDateChange={onChange}
              onCutOffTimeChange={onChange}
            />
            {isStagingSchema() && (
              <AllowLegacyGiftCardUse
                onChange={
                  onAllowLegacyGiftCardUseChange ? onAllowLegacyGiftCardUseChange : () => {}
                }
                hasError={!!formErrors.allowLegacyGiftCardUse}
                isChecked={data.allowLegacyGiftCardUse!}
                disabled={disabled}
              />
            )}
          </Box>
        </DashboardCard.Content>
      </DashboardCard>
    </>
  );
};
