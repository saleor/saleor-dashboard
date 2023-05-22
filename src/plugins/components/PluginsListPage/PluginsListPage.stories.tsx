import {
  filterPageProps,
  pageListProps,
  sortPageProps,
} from "@dashboard/fixtures";
import { PluginConfigurationType } from "@dashboard/graphql";
import { pluginList } from "@dashboard/plugins/fixtures";
import { PluginListUrlSortField } from "@dashboard/plugins/urls";
import { Meta, StoryObj } from "@storybook/react";

import { PaginatorContextDecorator } from "../../../../.storybook/decorators";
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

const meta: Meta<typeof PluginsListPage> = {
  title: "Plugins / Plugin list",
  decorators: [PaginatorContextDecorator],
  component: PluginsListPage,
};
export default meta;
type Story = StoryObj<typeof PluginsListPage>;

export const Default: Story = {
  args: {
    ...props,
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};
