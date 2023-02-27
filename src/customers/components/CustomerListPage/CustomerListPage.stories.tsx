import {
  filterPageProps,
  listActionsProps,
  pageListProps,
  searchPageProps,
  sortPageProps,
  tabPageProps,
} from '@dashboard/fixtures';
import Decorator from '@dashboard/storybook/Decorator';
import { MockedUserProvider } from '@dashboard/storybook/MockedUserProvider';
import { PaginatorContextDecorator } from '@dashboard/storybook/PaginatorContextDecorator';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { customerList } from '../../fixtures';
import { CustomerListUrlSortField } from '../../urls';
import CustomerListPageComponent, { CustomerListPageProps } from './CustomerListPage';

const props: CustomerListPageProps = {
  ...filterPageProps,
  ...listActionsProps,
  ...pageListProps.default,
  ...searchPageProps,
  ...sortPageProps,
  ...tabPageProps,
  customers: customerList,
  selectedCustomerIds: ['123'],
  filterOpts: {
    joined: {
      active: false,
      value: {
        max: undefined,
        min: undefined,
      },
    },
    numberOfOrders: {
      active: false,
      value: {
        max: undefined,
        min: undefined,
      },
    },
  },
  sort: {
    ...sortPageProps.sort,
    sort: CustomerListUrlSortField.name,
  },
};

const CustomerListPage = props => (
  <MockedUserProvider>
    <CustomerListPageComponent {...props} />
  </MockedUserProvider>
);

storiesOf('Customers / Customer list', module)
  .addDecorator(Decorator)
  .addDecorator(PaginatorContextDecorator)
  .add('default', () => <CustomerListPage {...props} />)
  .add('loading', () => <CustomerListPage {...props} disabled={true} customers={undefined} />)
  .add('no data', () => <CustomerListPage {...props} customers={[]} />);
