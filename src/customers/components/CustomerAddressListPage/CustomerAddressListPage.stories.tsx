import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { customer } from "../../fixtures";
import CustomerAddressListPage, { CustomerAddressListPageProps } from ".";

const props: CustomerAddressListPageProps = {
  customer,
  disabled: false,
  onAdd: () => undefined,
  onEdit: () => undefined,
  onRemove: () => undefined,
  onSetAsDefault: () => undefined,
};

storiesOf("Customers / Address Book", module)
  .addDecorator(Decorator)
  .add("default", () => <CustomerAddressListPage {...props} />)
  .add("loading", () => (
    <CustomerAddressListPage {...props} customer={undefined} disabled={true} />
  ))
  .add("no data", () => (
    <CustomerAddressListPage
      {...props}
      customer={{ ...customer, addresses: [] }}
    />
  ));
