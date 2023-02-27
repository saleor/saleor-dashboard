import { listActionsProps, pageListProps, sortPageProps } from '@dashboard/fixtures';
import { pageList } from '@dashboard/pages/fixtures';
import { PageListUrlSortField } from '@dashboard/pages/urls';
import Decorator from '@dashboard/storybook/Decorator';
import { PaginatorContextDecorator } from '@dashboard/storybook/PaginatorContextDecorator';
import { storiesOf } from '@storybook/react';
import React from 'react';

import PageListPage, { PageListPageProps } from './PageListPage';

const props: PageListPageProps = {
  ...listActionsProps,
  ...pageListProps.default,
  ...sortPageProps,
  pages: pageList,
  sort: {
    ...sortPageProps.sort,
    sort: PageListUrlSortField.title,
  },
  actionDialogOpts: {
    open: () => undefined,
    close: () => undefined,
  },
  params: {
    ids: [],
  },
};

storiesOf('Pages / Page list', module)
  .addDecorator(Decorator)
  .addDecorator(PaginatorContextDecorator)
  .add('default', () => <PageListPage {...props} />)
  .add('loading', () => <PageListPage {...props} disabled={true} pages={undefined} />)
  .add('no data', () => <PageListPage {...props} pages={[]} />);
