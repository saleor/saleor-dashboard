import { storiesOf } from "@storybook/react";
import React from "react";

import { pageListProps } from "../../../fixtures";
import PluginsListPage, {
  PluginsListPageProps
} from "../../../plugins/components/PluginsListPage";
import { pluginList } from "../../../plugins/fixtures";
import Decorator from "../../Decorator";

const props: PluginsListPageProps = {
  ...pageListProps.default,
  onBack: () => undefined,
  plugins: pluginList
};

storiesOf("Views / Plugins / Plugin list", module)
  .addDecorator(Decorator)
  .add("default", () => <PluginsListPage {...props} />)
  .add("loading", () => (
    <PluginsListPage {...props} disabled={true} plugins={undefined} />
  ))
  .add("no data", () => <PluginsListPage {...props} plugins={[]} />);
