// @ts-strict-ignore
import { AccountErrorCode } from "@dashboard/graphql";
import React from "react";

import { MockedUserProvider } from "../../../../.storybook/helpers";
import { customer } from "../../fixtures";
import CustomerDetailsPageComponent, {
  CustomerDetailsPageProps,
} from "./CustomerDetailsPage";

const props: Omit<CustomerDetailsPageProps, "classes"> = {
  customerId: "123",
  customer,
  disabled: false,
  errors: [],
  onDelete: () => undefined,
  onSubmit: () => undefined,
  saveButtonBar: "default",
};

interface CustomerDetailsPageErrors {
  firstName: string;
  email: string;
  lastName: string;
  note: string;
}

const CustomerDetailsPage = props => (
  <MockedUserProvider>
    <CustomerDetailsPageComponent {...props} />
  </MockedUserProvider>
);

export default {
  title: "Customers / Customer details",
};

export const Default = () => <CustomerDetailsPage {...props} />;

export const Loading = () => (
  <CustomerDetailsPage {...props} customer={undefined} disabled={true} />
);

export const FormErrors = () => (
  <CustomerDetailsPage
    {...props}
    errors={(
      ["email", "firstName", "lastName"] as Array<
        keyof CustomerDetailsPageErrors
      >
    ).map(field => ({
      __typename: "AccountError",
      code: AccountErrorCode.INVALID,
      field,
      addressType: null,
      message: "Account invalid",
    }))}
  />
);

export const DifferentAddresses = () => (
  <CustomerDetailsPage
    {...props}
    customer={{
      ...customer,
      defaultBillingAddress: {
        ...customer.defaultBillingAddress,
        id: "AvSduf72=",
      },
    }}
  />
);

export const NeverLogged = () => (
  <CustomerDetailsPage
    {...props}
    customer={{
      ...customer,
      lastLogin: null,
    }}
  />
);

export const NeverPlacedOrder = () => (
  <CustomerDetailsPage
    {...props}
    customer={{
      ...customer,
      lastPlacedOrder: {
        ...customer.lastPlacedOrder,
        edges: [],
      },
    }}
  />
);

export const NoDefaultBillingAddress = () => (
  <CustomerDetailsPage
    {...props}
    customer={{
      ...customer,
      defaultBillingAddress: null,
    }}
  />
);

export const NoDefaultShippingAddress = () => (
  <CustomerDetailsPage
    {...props}
    customer={{
      ...customer,
      defaultShippingAddress: null,
    }}
  />
);

export const NoAddressAtAll = () => (
  <CustomerDetailsPage
    {...props}
    customer={{
      ...customer,
      defaultBillingAddress: null,
      defaultShippingAddress: null,
    }}
  />
);
