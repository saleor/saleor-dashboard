import { ShopErrorCode } from '@dashboard/graphql';
import { shop } from '@dashboard/siteSettings/fixtures';
import Decorator from '@dashboard/storybook/Decorator';
import { storiesOf } from '@storybook/react';
import React from 'react';

import SiteSettingsPage, { SiteSettingsPageProps } from './SiteSettingsPage';

const props: Omit<SiteSettingsPageProps, 'classes'> = {
  disabled: false,
  errors: [],
  onSubmit: async () => undefined,
  saveButtonBarState: 'default',
  shop,
};

storiesOf('Site settings / Page', module)
  .addDecorator(Decorator)
  .add('default', () => <SiteSettingsPage {...props} />)
  .add('loading', () => <SiteSettingsPage {...props} disabled={true} shop={undefined} />)
  .add('form errors', () => (
    <SiteSettingsPage
      {...props}
      errors={[
        'description',
        'domain',
        'name',
        'defaultMailSenderAddress',
        'defaultMailSenderName',
        'customerSetPasswordUrl',
      ].map(field => ({
        __typename: 'ShopError',
        code: ShopErrorCode.INVALID,
        field,
        message: 'Shop form invalid',
      }))}
    />
  ));
