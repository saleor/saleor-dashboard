import {
  listActionsProps,
  pageListProps,
  sortPageProps,
} from "@saleor/fixtures";
import { pageList } from "@saleor/pages/fixtures";
import { PageListUrlSortField } from "@saleor/pages/urls";
import Decorator from "@saleor/storybook/Decorator";
import { PaginatorContextDecorator } from "@saleor/storybook/PaginatorContextDecorator";
import { storiesOf } from "@storybook/react";
import React from "react";

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

storiesOf("Pages / Page list", module)
  .addDecorator(Decorator)
  .addDecorator(PaginatorContextDecorator)
  .add("default", () => <PageListPage {...props} />)
  .add("loading", () => (
    <PageListPage {...props} disabled={true} pages={undefined} />
  ))
  .add("no data", () => <PageListPage {...props} pages={[]} />);
