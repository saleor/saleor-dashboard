// @ts-strict-ignore
import {
  ChannelShippingZones,
  ChannelWarehouses,
} from "@dashboard/channels/pages/ChannelDetailsPage/types";
import { DashboardCard } from "@dashboard/components/Card";
import ControlledSwitch from "@dashboard/components/ControlledSwitch";
import FormSpacer from "@dashboard/components/FormSpacer";
import Link from "@dashboard/components/Link";
import PreviewPill from "@dashboard/components/PreviewPill";
import SingleAutocompleteSelectField, {
  SingleAutocompleteChoiceType,
} from "@dashboard/components/SingleAutocompleteSelectField";
import {
  ChannelErrorFragment,
  CountryCode,
  MarkAsPaidStrategyEnum,
  StockSettingsInput,
} from "@dashboard/graphql";
import useClipboard from "@dashboard/hooks/useClipboard";
import { ChangeEvent, FormChange } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getChannelsErrorMessage from "@dashboard/utils/errors/channels";
import { Box, Button, CopyIcon, Input, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";
import { ExtendedFormHelperTextProps } from "./types";

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
}

export interface ChannelFormProps {
  data: FormData;
  disabled: boolean;
  currencyCodes?: SingleAutocompleteChoiceType[];
  errors: ChannelErrorFragment[];
  selectedCurrencyCode?: string;
  selectedCountryDisplayName: string;
  countries: SingleAutocompleteChoiceType[];
  onChange: FormChange;
  onCurrencyCodeChange?: (event: ChangeEvent) => void;
  onDefaultCountryChange: (event: ChangeEvent) => void;
  onMarkAsPaidStrategyChange: () => void;
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
}) => {
  const intl = useIntl();
  const [, copy] = useClipboard();
  const formErrors = getFormErrors<keyof FormData, ChannelErrorFragment>(
    [
      "name",
      "slug",
      "currencyCode",
      "defaultCountry",
      "deleteExpiredOrdersAfter",
    ],
    errors,
  );

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
          />
          <FormSpacer />
          <Input
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
        <Text variant="heading" margin={6}>
          <FormattedMessage {...messages.channelSettings} />
        </Text>
        <Text variant="heading" margin={6}>
          <FormattedMessage {...messages.orderExpiration} />
        </Text>
        <Box paddingX={6}>
          {currencyCodes ? (
            <SingleAutocompleteSelectField
              data-test-id="channel-currency-select-input"
              allowCustomValues
              error={!!formErrors.currencyCode}
              FormHelperTextProps={
                {
                  "data-test-id": "currency-text-input-helper-text",
                } as ExtendedFormHelperTextProps
              }
              helperText={getChannelsErrorMessage(
                formErrors?.currencyCode,
                intl,
              )}
              disabled={disabled}
              label={intl.formatMessage(messages.channelCurrency)}
              choices={currencyCodes}
              name="currencyCode"
              displayValue={selectedCurrencyCode}
              value={selectedCurrencyCode}
              onChange={onCurrencyCodeChange}
            />
          ) : (
            <Box display="flex" flexDirection="column">
              <Text variant="caption">
                <FormattedMessage {...messages.selectedCurrency} />
              </Text>
              <Text>{data.currencyCode}</Text>
            </Box>
          )}
        </Box>
        <Text variant="caption" paddingX={6}>
          <FormattedMessage {...messages.orderExpirationDescription} />
        </Text>
        <Box paddingX={6}>
          <SingleAutocompleteSelectField
            data-test-id="country-select-input"
            error={!!formErrors.defaultCountry}
            FormHelperTextProps={
              {
                "data-test-id": "country-text-input-helper-text",
              } as ExtendedFormHelperTextProps
            }
            helperText={getChannelsErrorMessage(
              formErrors?.defaultCountry,
              intl,
            )}
            disabled={disabled}
            label={intl.formatMessage(messages.defaultCountry)}
            choices={countries}
            name="defaultCountry"
            displayValue={selectedCountryDisplayName}
            value={data.defaultCountry}
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
        <Box display="flex" gap={1.5} alignItems="center" paddingX={6}>
          <ControlledSwitch
            data-test-id="order-settings-mark-as-paid"
            disabled={disabled}
            checked={
              data.markAsPaidStrategy ===
              MarkAsPaidStrategyEnum.TRANSACTION_FLOW
            }
            onChange={onMarkAsPaidStrategyChange}
            name="markAsPaidStrategy"
            label={
              <span>
                <FormattedMessage
                  defaultMessage='"Mark as paid" feature creates a'
                  id="MDOw8D"
                />{" "}
                <Link
                  href="https://docs.saleor.io/docs/3.x/developer/payments#processing-a-payment-with-payment-app"
                  target="_blank"
                  rel="noopener noreferer"
                >
                  <FormattedMessage defaultMessage="Transaction" id="1+ROfp" />
                </Link>{" "}
                <FormattedMessage
                  defaultMessage="- used by Payment Apps"
                  id="Fqe4aB"
                />
              </span>
            }
            secondLabel={
              <span>
                <FormattedMessage
                  defaultMessage="If left unchecked it creates a"
                  id="hHv0ih"
                />{" "}
                <Link
                  href="https://docs.saleor.io/docs/3.x/developer/payments#payment-plugin"
                  target="_blank"
                  rel="noopener noreferer"
                >
                  <FormattedMessage defaultMessage="Payment" id="NmK6zy" />
                </Link>{" "}
                <FormattedMessage
                  defaultMessage="- used by Payment Plugins"
                  id="50lR2F"
                />
              </span>
            }
          />
          <PreviewPill />
        </Box>
      </Box>
    </>
  );
};
