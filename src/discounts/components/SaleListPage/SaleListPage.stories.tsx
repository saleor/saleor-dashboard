import { saleList } from '@dashboard/discounts/fixtures';
import { SaleListUrlSortField } from '@dashboard/discounts/urls';
import { filterPageProps, listActionsProps, pageListProps, sortPageProps, tabPageProps } from '@dashboard/fixtures';
import { DiscountStatusEnum, DiscountValueTypeEnum } from '@dashboard/graphql';
import Decorator from '@dashboard/storybook/Decorator';
import { PaginatorContextDecorator } from '@dashboard/storybook/PaginatorContextDecorator';
import { storiesOf } from '@storybook/react';
import React from 'react';

import SaleListPage, { SaleListPageProps } from './SaleListPage';

const props: SaleListPageProps = {
  ...listActionsProps,
  ...pageListProps.default,
  ...filterPageProps,
  ...sortPageProps,
  ...tabPageProps,
  filterOpts: {
    channel: {
      active: false,
      value: 'default-channel',
      choices: [
        {
          value: 'default-channel',
          label: 'Default channel',
        },
      ],
    },
    saleType: {
      active: false,
      value: DiscountValueTypeEnum.FIXED,
    },
    started: {
      active: false,
      value: {
        max: undefined,
        min: undefined,
      },
    },
    status: {
      active: false,
      value: [DiscountStatusEnum.ACTIVE],
    },
  },
  sales: saleList,
  selectedChannelId: '123',
  sort: {
    ...sortPageProps.sort,
    sort: SaleListUrlSortField.name,
  },
};

storiesOf('Discounts / Sale list', module)
  .addDecorator(Decorator)
  .addDecorator(PaginatorContextDecorator)
  .add('default', () => <SaleListPage {...props} />)
  .add('loading', () => <SaleListPage {...props} sales={undefined} />)
  .add('no data', () => <SaleListPage {...props} sales={[]} />)
  .add('no channels', () => (
    <SaleListPage {...props} sales={saleList.map(sale => ({ ...sale, channelListings: [] }))} selectedChannelId="" />
  ));
