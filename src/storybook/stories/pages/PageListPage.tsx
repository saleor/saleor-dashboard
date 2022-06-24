import { PageListUrlSortField } from "@saleor/pages/urls";
import { PaginatorContextDecorator } from "@saleor/storybook/PaginatorContextDecorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import {
  listActionsProps,
  pageListProps,
  sortPageProps,
} from "../../../fixtures";
import PageListPage, {
  PageListPageProps,
} from "../../../pages/components/PageListPage";
import { pageList } from "../../../pages/fixtures";
import Decorator from "../../Decorator";

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

storiesOf("Views / Pages / Page list", module)
  .addDecorator(Decorator)
  .addDecorator(PaginatorContextDecorator)
  .add("default", () => <PageListPage {...props} />)
  .add("loading", () => (
    <PageListPage {...props} disabled={true} pages={undefined} />
  ))
  .add("no data", () => <PageListPage {...props} pages={[]} />);
