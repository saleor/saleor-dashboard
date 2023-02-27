import {
  limits,
  limitsReached,
  pageListProps,
  searchPageProps,
  sortPageProps,
  tabPageProps,
} from '@dashboard/fixtures';
import Decorator from '@dashboard/storybook/Decorator';
import { PaginatorContextDecorator } from '@dashboard/storybook/PaginatorContextDecorator';
import { WarehouseListUrlSortField } from '@dashboard/warehouses/urls';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { warehouseList } from '../../fixtures';
import WarehouseListPage, { WarehouseListPageProps } from './WarehouseListPage';

const props: WarehouseListPageProps = {
  ...pageListProps.default,
  ...searchPageProps,
  ...sortPageProps,
  ...tabPageProps,
  limits,
  onRemove: () => undefined,
  sort: {
    ...sortPageProps.sort,
    sort: WarehouseListUrlSortField.name,
  },
  warehouses: warehouseList,
};

storiesOf('Warehouses / Warehouse list', module)
  .addDecorator(Decorator)
  .addDecorator(PaginatorContextDecorator)
  .add('default', () => <WarehouseListPage {...props} />)
  .add('loading', () => <WarehouseListPage {...props} disabled={true} warehouses={undefined} />)
  .add('no data', () => <WarehouseListPage {...props} warehouses={[]} />)
  .add('no limits', () => <WarehouseListPage {...props} limits={undefined} />)
  .add('limits reached', () => <WarehouseListPage {...props} limits={limitsReached} />);
