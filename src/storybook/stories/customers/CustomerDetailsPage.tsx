import { AccountErrorCode } from "@saleor/graphql";
import { storiesOf } from "@storybook/react";
import React from "react";

import CustomerDetailsPageComponent, {
  CustomerDetailsPageProps,
} from "../../../customers/components/CustomerDetailsPage";
import { customer } from "../../../customers/fixtures";
import Decorator from "../../Decorator";
import { MockedUserProvider } from "./MockedUserProvider";

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

storiesOf("Views / Customers / Customer details", module)
  .addDecorator(Decorator)
  .add("default", () => <CustomerDetailsPage {...props} />)
  .add("loading", () => (
    <CustomerDetailsPage {...props} customer={undefined} disabled={true} />
  ))
  .add("form errors", () => (
    <CustomerDetailsPage
      {...props}
      errors={(["email", "firstName", "lastName"] as Array<
        keyof CustomerDetailsPageErrors
      >).map(field => ({
        __typename: "AccountError",
        code: AccountErrorCode.INVALID,
        field,
        addressType: null,
        message: "Account invalid",
      }))}
    />
  ))
  .add("different addresses", () => (
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
  ))
  .add("never logged", () => (
    <CustomerDetailsPage
      {...props}
      customer={{
        ...customer,
        lastLogin: null,
      }}
    />
  ))
  .add("never placed order", () => (
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
  ))
  .add("no default billing address", () => (
    <CustomerDetailsPage
      {...props}
      customer={{
        ...customer,
        defaultBillingAddress: null,
      }}
    />
  ))
  .add("no default shipping address", () => (
    <CustomerDetailsPage
      {...props}
      customer={{
        ...customer,
        defaultShippingAddress: null,
      }}
    />
  ))
  .add("no address at all", () => (
    <CustomerDetailsPage
      {...props}
      customer={{
        ...customer,
        defaultBillingAddress: null,
        defaultShippingAddress: null,
      }}
    />
  ));
