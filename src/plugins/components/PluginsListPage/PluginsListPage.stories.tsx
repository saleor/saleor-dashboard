import {
  filterPageProps,
  pageListProps,
  sortPageProps,
} from "@saleor/fixtures";
import { PluginConfigurationType } from "@saleor/graphql";
import { pluginList } from "@saleor/plugins/fixtures";
import { PluginListUrlSortField } from "@saleor/plugins/urls";
import Decorator from "@saleor/storybook/Decorator";
import { PaginatorContextDecorator } from "@saleor/storybook/PaginatorContextDecorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import PluginsListPage, { PluginsListPageProps } from "./PluginsListPage";

const props: PluginsListPageProps = {
  ...pageListProps.default,
  ...sortPageProps,
  ...filterPageProps,
  filterOpts: {
    isActive: {
      active: false,
      value: true,
    },
    channels: {
      active: false,
      choices: [],
      displayValues: [],
      initialSearch: "",
      hasMore: false,
      loading: false,
      onFetchMore: () => undefined,
      onSearchChange: () => undefined,
      value: [],
    },
    status: {
      active: false,
      value: false,
    },
    type: {
      active: false,
      value: PluginConfigurationType.GLOBAL,
    },
  },
  plugins: pluginList,
  sort: {
    ...sortPageProps.sort,
    sort: PluginListUrlSortField.name,
  },
};

storiesOf("Plugins / Plugin list", module)
  .addDecorator(Decorator)
  .addDecorator(PaginatorContextDecorator)
  .add("default", () => <PluginsListPage {...props} />)
  .add("loading", () => (
    <PluginsListPage {...props} disabled={true} plugins={undefined} />
  ))
  .add("no data", () => <PluginsListPage {...props} plugins={[]} />);
