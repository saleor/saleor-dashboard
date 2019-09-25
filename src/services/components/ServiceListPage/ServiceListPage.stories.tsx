import { storiesOf } from "@storybook/react";
import React from "react";

import {
  listActionsProps,
  pageListProps,
  searchPageProps,
  tabPageProps
} from "@saleor/fixtures";
import ServiceListPage, {
  ServiceListPageProps
} from "@saleor/services/components/ServiceListPage";
import Decorator from "@saleor/storybook/Decorator";
import { serviceList } from "../../fixtures";

const props: ServiceListPageProps = {
  ...listActionsProps,
  ...pageListProps.default,
  ...searchPageProps,
  ...tabPageProps,
  onBack: () => undefined,
  onRemove: () => undefined,
  services: serviceList
};

storiesOf("Views / Services / Service list", module)
  .addDecorator(Decorator)
  .add("default", () => <ServiceListPage {...props} />)
  .add("loading", () => (
    <ServiceListPage {...props} disabled={true} services={undefined} />
  ))
  .add("no data", () => <ServiceListPage {...props} services={[]} />);
