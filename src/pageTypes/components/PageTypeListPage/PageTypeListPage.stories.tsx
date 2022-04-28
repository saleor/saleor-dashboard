import { PageTypeListUrlSortField } from "@saleor/pageTypes/urls";
import React from "react";

import {
  listActionsProps,
  pageListProps,
  searchPageProps,
  sortPageProps,
  tabPageProps
} from "../../../fixtures";
import Decorator from "../../../storybook/Decorator";
import { pageTypes } from "../../fixtures";
import PageTypeListPage, { PageTypeListPageProps } from ".";

const props: PageTypeListPageProps = {
  ...listActionsProps,
  ...pageListProps.default,
  ...searchPageProps,
  ...sortPageProps,
  sort: {
    ...sortPageProps.sort,
    sort: PageTypeListUrlSortField.name
  },
  ...tabPageProps,
  onBack: () => undefined,
  pageTypes
};

export default {
  title: "Views / Page types / Page types list",
  decorators: [Decorator]
};

export const Default = () => <PageTypeListPage {...props} />;

Default.story = {
  name: "default"
};

export const Loading = () => (
  <PageTypeListPage {...props} disabled={true} pageTypes={undefined} />
);

Loading.story = {
  name: "loading"
};

export const NoData = () => <PageTypeListPage {...props} pageTypes={[]} />;

NoData.story = {
  name: "no data"
};
