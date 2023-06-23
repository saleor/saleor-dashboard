// @ts-strict-ignore
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

export default {
  title: "Customers / Address Book",
};

export const Default = () => <CustomerAddressListPage {...props} />;

export const Loading = () => (
  <CustomerAddressListPage {...props} customer={undefined} disabled={true} />
);

export const NoData = () => (
  <CustomerAddressListPage
    {...props}
    customer={{ ...customer, addresses: [] }}
  />
);
