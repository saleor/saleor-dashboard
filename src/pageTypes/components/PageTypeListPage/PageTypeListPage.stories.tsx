import {
  listActionsProps,
  pageListProps,
  searchPageProps,
  sortPageProps,
  tabPageProps,
} from "@dashboard/fixtures";
import { PageTypeListUrlSortField } from "@dashboard/pageTypes/urls";
import React from "react";

import { PaginatorContextDecorator } from "../../../../.storybook/decorators";
import { pageTypes } from "../../fixtures";
import PageTypeListPage, { PageTypeListPageProps } from "./PageTypeListPage";

const props: PageTypeListPageProps = {
  ...listActionsProps,
  ...pageListProps.default,
  ...searchPageProps,
  ...sortPageProps,
  sort: {
    ...sortPageProps.sort,
    sort: PageTypeListUrlSortField.name,
  },
  ...tabPageProps,
  pageTypes,
};

export default {
  title: "Page types / Page types list",
  decorators: [PaginatorContextDecorator],
};

export const Default = () => <PageTypeListPage {...props} />;

export const Loading = () => (
  <PageTypeListPage {...props} disabled={true} pageTypes={undefined} />
);

export const NoData = () => <PageTypeListPage {...props} pageTypes={[]} />;
