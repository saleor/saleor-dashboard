import {
  filterPageProps,
  listActionsProps,
  pageListProps,
  searchPageProps,
  sortPageProps,
  tabPageProps
} from "@saleor/fixtures";
import ServiceListPage, {
  ServiceListPageProps
} from "@saleor/services/components/ServiceListPage";
import { ServiceListUrlSortField } from "@saleor/services/urls";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { serviceList } from "../../fixtures";

const props: ServiceListPageProps = {
  ...listActionsProps,
  ...pageListProps.default,
  ...searchPageProps,
  ...sortPageProps,
  ...tabPageProps,
  ...filterPageProps,
  filterOpts: {
    isActive: {
      active: false,
      value: true
    }
  },
  onBack: () => undefined,
  onRemove: () => undefined,
  services: serviceList,
  sort: {
    ...sortPageProps.sort,
    sort: ServiceListUrlSortField.name
  }
};

storiesOf("Views / Services / Service list", module)
  .addDecorator(Decorator)
  .add("default", () => <ServiceListPage {...props} />)
  .add("loading", () => (
    <ServiceListPage {...props} disabled={true} services={undefined} />
  ))
  .add("no data", () => <ServiceListPage {...props} services={[]} />);
