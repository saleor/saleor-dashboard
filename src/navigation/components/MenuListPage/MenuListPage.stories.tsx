import { listActionsProps, pageListProps, sortPageProps } from '@dashboard/fixtures';
import { menuList } from '@dashboard/navigation/fixtures';
import { MenuListUrlSortField } from '@dashboard/navigation/urls';
import Decorator from '@dashboard/storybook/Decorator';
import { PaginatorContextDecorator } from '@dashboard/storybook/PaginatorContextDecorator';
import { storiesOf } from '@storybook/react';
import React from 'react';

import MenuListPage, { MenuListPageProps } from './MenuListPage';

const props: MenuListPageProps = {
  ...pageListProps.default,
  ...listActionsProps,
  ...sortPageProps,
  menus: menuList,
  onDelete: () => undefined,
  sort: {
    ...sortPageProps.sort,
    sort: MenuListUrlSortField.name,
  },
};

storiesOf('Navigation / Menu list', module)
  .addDecorator(Decorator)
  .addDecorator(PaginatorContextDecorator)
  .add('default', () => <MenuListPage {...props} />)
  .add('loading', () => <MenuListPage {...props} disabled={true} menus={undefined} />)
  .add('no data', () => <MenuListPage {...props} menus={[]} />);
