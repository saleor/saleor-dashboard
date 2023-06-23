// @ts-strict-ignore
import {
  ChannelShippingZones,
  ChannelWarehouses,
} from "@dashboard/channels/pages/ChannelDetailsPage/types";
import CardSpacer from "@dashboard/components/CardSpacer";
import CardTitle from "@dashboard/components/CardTitle";
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
import {
  Card,
  CardContent,
  InputAdornment,
  TextField,
  Typography,
} from "@material-ui/core";
import { Box } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "../styles";
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
  const [copied, copy] = useClipboard();
  const formErrors = getFormErrors<keyof FormData, ChannelErrorFragment>(
    ["name", "slug", "currencyCode", "defaultCountry"],
    errors,
  );
  const classes = useStyles();

  return (
    <>
      <Card>
        <CardTitle
          title={intl.formatMessage(commonMessages.generalInformations)}
        />
        <CardContent>
          <TextField
            error={!!formErrors.name}
            helperText={getChannelsErrorMessage(formErrors?.name, intl)}
            disabled={disabled}
            fullWidth
            label={intl.formatMessage({
              id: "UymotP",
              defaultMessage: "Channel name",
              description: "channel name",
            })}
            name="name"
            value={data.name}
            onChange={onChange}
          />
          <FormSpacer />
          <TextField
            error={!!formErrors.slug}
            helperText={getChannelsErrorMessage(formErrors?.slug, intl)}
            disabled={disabled}
            fullWidth
            FormHelperTextProps={
              {
                "data-test-id": "slug-text-input-helper-text",
              } as ExtendedFormHelperTextProps
            }
            label={intl.formatMessage({
              id: "74Zo/H",
              defaultMessage: "Slug",
              description: "channel slug",
            })}
            name="slug"
            value={data.slug}
            onChange={onChange}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  className={classes.copyBtn}
                  position="end"
                  disableTypography
                  onClick={() => copy(data.slug)}
                >
                  {copied ? (
                    <FormattedMessage
                      id="r86alc"
                      defaultMessage="Copied"
                      description="button"
                    />
                  ) : (
                    <FormattedMessage
                      id="ZhaXLU"
                      defaultMessage="Copy"
                      description="button"
                    />
                  )}
                </InputAdornment>
              ),
            }}
          />
          <FormSpacer />
        </CardContent>
      </Card>
      <CardSpacer />
      <Card>
        <CardTitle
          title={intl.formatMessage({
            id: "3y4r+z",
            defaultMessage: "Channel Settings",
            description: "channel settings",
          })}
        />
        <CardContent>
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
              label={intl.formatMessage({
                id: "9Sz0By",
                defaultMessage: "Currency",
                description: "channel currency",
              })}
              choices={currencyCodes}
              name="currencyCode"
              displayValue={selectedCurrencyCode}
              value={selectedCurrencyCode}
              onChange={onCurrencyCodeChange}
            />
          ) : (
            <>
              <Typography variant="caption" className={classes.label}>
                <FormattedMessage
                  id="39yi8w"
                  defaultMessage="Selected currency"
                  description="selected currency"
                />
              </Typography>
              <Typography>{data.currencyCode}</Typography>
            </>
          )}
          <FormSpacer />
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
            label={intl.formatMessage({
              id: "tV+Dcm",
              defaultMessage: "Default country",
            })}
            choices={countries}
            name="defaultCountry"
            displayValue={selectedCountryDisplayName}
            value={data.defaultCountry}
            onChange={onDefaultCountryChange}
          />
          <FormSpacer />
          <Box display="flex" gap={1.5} alignItems="center">
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
                    <FormattedMessage
                      defaultMessage="Transaction"
                      id="1+ROfp"
                    />
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
        </CardContent>
      </Card>
    </>
  );
};
