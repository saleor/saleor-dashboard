import { PageTypeListUrlSortField } from "@saleor/pageTypes/urls";
import { PaginatorContextDecorator } from "@saleor/storybook/PaginatorContextDecorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import {
  listActionsProps,
  pageListProps,
  searchPageProps,
  sortPageProps,
  tabPageProps,
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
    sort: PageTypeListUrlSortField.name,
  },
  ...tabPageProps,
  pageTypes,
};

storiesOf("Views / Page types / Page types list", module)
  .addDecorator(Decorator)
  .addDecorator(PaginatorContextDecorator)
  .add("default", () => <PageTypeListPage {...props} />)
  .add("loading", () => (
    <PageTypeListPage {...props} disabled={true} pageTypes={undefined} />
  ))
  .add("no data", () => <PageTypeListPage {...props} pageTypes={[]} />);
