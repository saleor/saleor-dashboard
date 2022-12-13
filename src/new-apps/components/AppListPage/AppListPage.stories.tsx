import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import AppListPage, { AppListPageProps } from "./AppListPage";

const props: AppListPageProps = {
  appList: [
    {
      id: "1",
      name: "App 1",
      logo: "https://picsum.photos/200/300",
      description: "Short description",
      features: [],
      integrations: [],
    },
  ],
};

storiesOf("Views / New Apps / App List", module)
  .addDecorator(Decorator)
  .add("default", () => <AppListPage {...props} />)
  .add("empty", () => <AppListPage {...props} appList={[]} />);
