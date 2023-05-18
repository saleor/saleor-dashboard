import {
  listActionsProps,
  pageListProps,
  sortPageProps,
} from "@dashboard/fixtures";
import { pageList } from "@dashboard/pages/fixtures";
import { PageListUrlSortField } from "@dashboard/pages/urls";
import React from "react";

import { PaginatorContextDecorator } from "../../../../.storybook/decorators";
import PageListPage, { PageListPageProps } from "./PageListPage";

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

export default {
  title: "Pages / Page list",
  decorators: [PaginatorContextDecorator],
};

export const Default = () => <PageListPage {...props} />;

export const Loading = () => (
  <PageListPage {...props} disabled={true} pages={undefined} />
);

export const NoData = () => <PageListPage {...props} pages={[]} />;
