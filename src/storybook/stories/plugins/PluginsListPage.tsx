import { PluginListUrlSortField } from "@saleor/plugins/urls";
import { PluginConfigurationType } from "@saleor/types/globalTypes";
import { storiesOf } from "@storybook/react";
import React from "react";

import {
  filterPageProps,
  pageListProps,
  sortPageProps
} from "../../../fixtures";
import PluginsListPage, {
  PluginsListPageProps
} from "../../../plugins/components/PluginsListPage";
import { pluginList } from "../../../plugins/fixtures";
import Decorator from "../../Decorator";

const props: PluginsListPageProps = {
  ...pageListProps.default,
  ...sortPageProps,
  ...filterPageProps,
  filterOpts: {
    isActive: {
      active: false,
      value: true
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
      value: []
    },
    status: {
      active: false,
      value: false
    },
    type: {
      active: false,
      value: PluginConfigurationType.GLOBAL
    }
  },
  onBack: () => undefined,
  plugins: pluginList,
  sort: {
    ...sortPageProps.sort,
    sort: PluginListUrlSortField.name
  }
};

storiesOf("Views / Plugins / Plugin list", module)
  .addDecorator(Decorator)
  .add("default", () => <PluginsListPage {...props} />)
  .add("loading", () => (
    <PluginsListPage {...props} disabled={true} plugins={undefined} />
  ))
  .add("no data", () => <PluginsListPage {...props} plugins={[]} />);
