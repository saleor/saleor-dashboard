import { storiesOf } from "@storybook/react";
import React from "react";

import { PluginListUrlSortField } from "@saleor/plugins/urls";
import {
  pageListProps,
  sortPageProps,
  filterPageProps
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
