import { ChannelShippingZones, ChannelWarehouses } from '@dashboard/channels/pages/ChannelDetailsPage/types';
import CardSpacer from '@dashboard/components/CardSpacer';
import CardTitle from '@dashboard/components/CardTitle';
import FormSpacer from '@dashboard/components/FormSpacer';
import SingleAutocompleteSelectField, {
  SingleAutocompleteChoiceType,
} from '@dashboard/components/SingleAutocompleteSelectField';
import { ChannelErrorFragment, CountryCode, StockSettingsInput } from '@dashboard/graphql';
import useClipboard from '@dashboard/hooks/useClipboard';
import { ChangeEvent, FormChange } from '@dashboard/hooks/useForm';
import { commonMessages } from '@dashboard/intl';
import { getFormErrors } from '@dashboard/utils/errors';
import getChannelsErrorMessage from '@dashboard/utils/errors/channels';
import { Card, CardContent, InputAdornment, TextField, Typography } from '@material-ui/core';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { useStyles } from '../styles';
import { ExtendedFormHelperTextProps } from './types';

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
}) => {
  const intl = useIntl();
  const [copied, copy] = useClipboard();
  const formErrors = getFormErrors<keyof FormData, ChannelErrorFragment>(
    ['name', 'slug', 'currencyCode', 'defaultCountry'],
    errors,
  );
  const classes = useStyles();

  return (
    <>
      <Card>
        <CardTitle title={intl.formatMessage(commonMessages.generalInformations)} />
        <CardContent>
          <TextField
            error={!!formErrors.name}
            helperText={getChannelsErrorMessage(formErrors?.name, intl)}
            disabled={disabled}
            fullWidth
            label={intl.formatMessage({
              id: 'UymotP',
              defaultMessage: 'Channel name',
              description: 'channel name',
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
                'data-test-id': 'slug-text-input-helper-text',
              } as ExtendedFormHelperTextProps
            }
            label={intl.formatMessage({
              id: '74Zo/H',
              defaultMessage: 'Slug',
              description: 'channel slug',
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
                    <FormattedMessage id="r86alc" defaultMessage="Copied" description="button" />
                  ) : (
                    <FormattedMessage id="ZhaXLU" defaultMessage="Copy" description="button" />
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
            id: '3y4r+z',
            defaultMessage: 'Channel Settings',
            description: 'channel settings',
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
                  'data-test-id': 'currency-text-input-helper-text',
                } as ExtendedFormHelperTextProps
              }
              helperText={getChannelsErrorMessage(formErrors?.currencyCode, intl)}
              disabled={disabled}
              label={intl.formatMessage({
                id: '9Sz0By',
                defaultMessage: 'Currency',
                description: 'channel currency',
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
                <FormattedMessage id="39yi8w" defaultMessage="Selected currency" description="selected currency" />
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
                'data-test-id': 'country-text-input-helper-text',
              } as ExtendedFormHelperTextProps
            }
            helperText={getChannelsErrorMessage(formErrors?.defaultCountry, intl)}
            disabled={disabled}
            label={intl.formatMessage({
              id: 'tV+Dcm',
              defaultMessage: 'Default country',
            })}
            choices={countries}
            name="defaultCountry"
            displayValue={selectedCountryDisplayName}
            value={data.defaultCountry}
            onChange={onDefaultCountryChange}
          />
        </CardContent>
      </Card>
    </>
  );
};

ChannelForm.displayName = 'ChannelForm';
export default ChannelForm;
