import {
  ChannelShippingZones,
  ChannelWarehouses,
} from "@dashboard/channels/pages/ChannelDetailsPage/types";
import { DashboardCard } from "@dashboard/components/Card";
import { Combobox } from "@dashboard/components/Combobox";
import FormSpacer from "@dashboard/components/FormSpacer";
import {
  ChannelErrorFragment,
  CountryCode,
  MarkAsPaidStrategyEnum,
  StockSettingsInput,
  TransactionFlowStrategyEnum,
} from "@dashboard/graphql";
import useClipboard from "@dashboard/hooks/useClipboard";
import { ChangeEvent, FormChange } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getChannelsErrorMessage from "@dashboard/utils/errors/channels";
import { Box, Button, CopyIcon, Input, Option, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

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
  defaultTransactionFlowStrategy: TransactionFlowStrategyEnum;
}

export interface ChannelFormProps {
  data: FormData;
  disabled: boolean;
  currencyCodes?: Option[];
  errors: ChannelErrorFragment[];
  selectedCurrencyCode?: string;
  selectedCountryDisplayName: string;
  countries: Option[];
  onChange: FormChange;
  onCurrencyCodeChange?: (event: ChangeEvent) => void;
  onDefaultCountryChange: (event: ChangeEvent) => void;
  onMarkAsPaidStrategyChange: () => void;
  onTransactionFlowStrategyChange: () => void;
}

export const ChannelForm: React.FC<ChannelFormProps> = ({
  currencyCodes,
  data,
  disabled,
  errors,
  selectedCurrencyCode,
  selectedCountryDisplayName,
  countries,
  onChange,
  onCurrencyCodeChange,
  onDefaultCountryChange,
  onMarkAsPaidStrategyChange,
  onTransactionFlowStrategyChange,
}) => {
  const intl = useIntl();
  const [, copy] = useClipboard();
  const formErrors = getFormErrors<keyof FormData, ChannelErrorFragment>(
    ["name", "slug", "currencyCode", "defaultCountry", "deleteExpiredOrdersAfter"],
    errors,
  );
  const renderCurrencySelection = currencyCodes && typeof onCurrencyCodeChange === "function";

  return (
    <>
      <DashboardCard>
        <DashboardCard.Title>
          {intl.formatMessage(commonMessages.generalInformations)}
        </DashboardCard.Title>
        <DashboardCard.Content data-test-id="general-information">
          <Input
            error={!!formErrors.name}
            helperText={getChannelsErrorMessage(formErrors?.name, intl)}
            disabled={disabled}
            label={intl.formatMessage(messages.channelName)}
            name="name"
            value={data.name}
            onChange={onChange}
            data-test-id="channel-name-input"
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
                onClick={() => copy(data.slug)}
                textTransform="uppercase"
                icon={<CopyIcon />}
              />
            }
          />
        </DashboardCard.Content>
      </DashboardCard>
      <Box display="grid" __gridTemplateColumns="2fr 1fr" rowGap={2}>
        <Text size={5} fontWeight="bold" margin={6}>
          <FormattedMessage {...messages.channelSettings} />
        </Text>
        <Text size={5} fontWeight="bold" margin={6}>
          <FormattedMessage {...messages.orderExpiration} />
        </Text>
        <Box paddingX={6}>
          {renderCurrencySelection ? (
            <Combobox
              data-test-id="channel-currency-select-input"
              allowCustomValues
              disabled={disabled}
              error={!!formErrors.currencyCode}
              label={intl.formatMessage(messages.channelCurrency)}
              helperText={getChannelsErrorMessage(formErrors?.currencyCode, intl)}
              options={currencyCodes}
              fetchOptions={() => undefined}
              name="currencyCode"
              value={{
                label: selectedCurrencyCode ?? "",
                value: selectedCurrencyCode ?? "",
              }}
              onChange={onCurrencyCodeChange}
            />
          ) : (
            <Box display="flex" flexDirection="column">
              <Text size={2}>
                <FormattedMessage {...messages.selectedCurrency} />
              </Text>
              <Text>{data.currencyCode}</Text>
            </Box>
          )}
        </Box>
        <Text size={2} paddingX={6}>
          <FormattedMessage {...messages.orderExpirationDescription} />
        </Text>
        <Box paddingX={6}>
          <Combobox
            data-test-id="country-select-input"
            disabled={disabled}
            error={!!formErrors.defaultCountry}
            label={intl.formatMessage(messages.defaultCountry)}
            helperText={getChannelsErrorMessage(formErrors?.defaultCountry, intl)}
            options={countries}
            fetchOptions={() => undefined}
            name="defaultCountry"
            value={{
              label: selectedCountryDisplayName,
              value: data.defaultCountry,
            }}
            onChange={onDefaultCountryChange}
          />
        </Box>
        <Box paddingX={6}>
          <Input
            name="deleteExpiredOrdersAfter"
            data-test-id="delete-expired-order-input"
            value={data.deleteExpiredOrdersAfter}
            error={!!formErrors.deleteExpiredOrdersAfter}
            type="number"
            label="TTL"
            onChange={onChange}
            min={0}
            max={120}
            // TODO: Should be removed after single autocomplete
            // select is migrated to macaw inputs
            __height={12.5}
          />
        </Box>
        <MarkAsPaid
          isChecked={data.markAsPaidStrategy === MarkAsPaidStrategyEnum.TRANSACTION_FLOW}
          onCheckedChange={onMarkAsPaidStrategyChange}
          hasError={!!formErrors.markAsPaidStrategy}
          disabled={disabled}
        />
        <Box />
        <AllowUnpaidOrders
          onChange={onChange}
          isChecked={data.allowUnpaidOrders}
          hasError={!!formErrors.allowUnpaidOrders}
          disabled={disabled}
        />
        <Box />
        <DefaultTransactionFlowStrategy
          onChange={onTransactionFlowStrategyChange}
          isChecked={
            data.defaultTransactionFlowStrategy === TransactionFlowStrategyEnum.AUTHORIZATION
          }
          hasError={!!formErrors.defaultTransactionFlowStrategy}
          disabled={disabled}
        />
      </Box>
    </>
  );
};
